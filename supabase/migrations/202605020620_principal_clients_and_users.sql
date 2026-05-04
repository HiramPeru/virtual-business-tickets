CREATE TABLE IF NOT EXISTS principal_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  ruc TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE principal_clients ENABLE ROW LEVEL SECURITY;

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS principal_client_id UUID REFERENCES principal_clients(id) ON DELETE SET NULL;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS principal_client_id UUID REFERENCES principal_clients(id) ON DELETE SET NULL;

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'operator', 'technician', 'client_readonly', 'pending'));

UPDATE profiles SET role = 'operator' WHERE role = 'technician';

CREATE TRIGGER principal_clients_set_updated_at
BEFORE UPDATE ON principal_clients
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO principal_clients(name)
VALUES ('Demo Parent Customer')
ON CONFLICT (name) DO NOTHING;

UPDATE companies
SET principal_client_id = (SELECT id FROM principal_clients WHERE name = 'Demo Parent Customer')
WHERE principal_client_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_companies_principal_client_id ON companies(principal_client_id);
CREATE INDEX IF NOT EXISTS idx_profiles_principal_client_id ON profiles(principal_client_id);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_internal_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'operator', 'technician')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_internal_user() TO authenticated;

CREATE OR REPLACE FUNCTION public.can_access_app()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'operator', 'technician', 'client_readonly')
  );
$$;

CREATE OR REPLACE FUNCTION public.current_principal_client_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT principal_client_id FROM profiles WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.current_principal_client_id() TO authenticated;

CREATE OR REPLACE FUNCTION public.can_read_ticket(ticket_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_internal_user()
    OR EXISTS (
      SELECT 1
      FROM tickets t
      JOIN contacts c ON c.id = t.contact_id
      JOIN profiles p ON p.id = auth.uid()
      WHERE t.id = ticket_uuid
        AND p.role = 'client_readonly'
        AND p.principal_client_id IS NOT NULL
        AND c.company_id IN (
          SELECT id FROM companies WHERE principal_client_id = p.principal_client_id
        )
    );
$$;

GRANT EXECUTE ON FUNCTION public.can_read_ticket(UUID) TO authenticated;

DROP POLICY IF EXISTS principal_clients_read_active ON principal_clients;
DROP POLICY IF EXISTS principal_clients_insert_internal ON principal_clients;
DROP POLICY IF EXISTS principal_clients_update_internal ON principal_clients;
DROP POLICY IF EXISTS companies_read_active ON companies;
DROP POLICY IF EXISTS companies_insert_active ON companies;
DROP POLICY IF EXISTS companies_update_active ON companies;
DROP POLICY IF EXISTS contacts_read_active ON contacts;
DROP POLICY IF EXISTS contacts_insert_active ON contacts;
DROP POLICY IF EXISTS contacts_update_active ON contacts;
DROP POLICY IF EXISTS profiles_read_active_or_self ON profiles;
DROP POLICY IF EXISTS profiles_update_self_active ON profiles;
DROP POLICY IF EXISTS profiles_admin_all ON profiles;
DROP POLICY IF EXISTS tickets_read_active ON tickets;
DROP POLICY IF EXISTS tickets_insert_active ON tickets;
DROP POLICY IF EXISTS tickets_update_active ON tickets;
DROP POLICY IF EXISTS comments_read_active ON ticket_comments;
DROP POLICY IF EXISTS comments_insert_active ON ticket_comments;
DROP POLICY IF EXISTS events_read_active ON ticket_events;

CREATE POLICY principal_clients_read_active ON principal_clients
  FOR SELECT TO authenticated
  USING (public.is_internal_user() OR id = public.current_principal_client_id());
CREATE POLICY principal_clients_insert_internal ON principal_clients
  FOR INSERT TO authenticated WITH CHECK (public.is_internal_user());
CREATE POLICY principal_clients_update_internal ON principal_clients
  FOR UPDATE TO authenticated USING (public.is_internal_user()) WITH CHECK (public.is_internal_user());

CREATE POLICY companies_read_scoped ON companies
  FOR SELECT TO authenticated
  USING (public.is_internal_user() OR principal_client_id = public.current_principal_client_id());
CREATE POLICY companies_insert_internal ON companies
  FOR INSERT TO authenticated WITH CHECK (public.is_internal_user());
CREATE POLICY companies_update_internal ON companies
  FOR UPDATE TO authenticated USING (public.is_internal_user()) WITH CHECK (public.is_internal_user());

CREATE POLICY contacts_read_scoped ON contacts
  FOR SELECT TO authenticated
  USING (
    public.is_internal_user()
    OR company_id IN (SELECT id FROM companies WHERE principal_client_id = public.current_principal_client_id())
  );
CREATE POLICY contacts_insert_internal ON contacts
  FOR INSERT TO authenticated WITH CHECK (public.is_internal_user());
CREATE POLICY contacts_update_internal ON contacts
  FOR UPDATE TO authenticated USING (public.is_internal_user()) WITH CHECK (public.is_internal_user());

CREATE POLICY profiles_read_scoped ON profiles
  FOR SELECT TO authenticated
  USING (public.is_internal_user() OR id = auth.uid());
CREATE POLICY profiles_update_self_internal ON profiles
  FOR UPDATE TO authenticated
  USING (public.is_internal_user() AND id = auth.uid())
  WITH CHECK (public.is_internal_user() AND id = auth.uid());
CREATE POLICY profiles_admin_all ON profiles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY tickets_read_scoped ON tickets
  FOR SELECT TO authenticated USING (public.can_read_ticket(id));
CREATE POLICY tickets_insert_internal ON tickets
  FOR INSERT TO authenticated WITH CHECK (public.is_internal_user() AND created_by = auth.uid());
CREATE POLICY tickets_update_internal ON tickets
  FOR UPDATE TO authenticated USING (public.is_internal_user()) WITH CHECK (public.is_internal_user() AND updated_by = auth.uid());

CREATE POLICY comments_read_scoped ON ticket_comments
  FOR SELECT TO authenticated USING (public.is_internal_user() OR (visibility = 'customer_visible' AND public.can_read_ticket(ticket_id)));
CREATE POLICY comments_insert_internal ON ticket_comments
  FOR INSERT TO authenticated WITH CHECK (public.is_internal_user() AND author_id = auth.uid());

CREATE POLICY events_read_scoped ON ticket_events
  FOR SELECT TO authenticated USING (public.can_read_ticket(ticket_id));

CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles(id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE WHEN NOT public.has_any_profile() THEN 'admin' ELSE 'pending' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
