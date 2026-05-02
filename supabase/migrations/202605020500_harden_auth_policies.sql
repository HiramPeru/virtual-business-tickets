ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'technician', 'pending'));

CREATE OR REPLACE FUNCTION public.has_any_profile()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles);
$$;

GRANT EXECUTE ON FUNCTION public.has_any_profile() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.can_access_app()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'technician')
  );
$$;

GRANT EXECUTE ON FUNCTION public.can_access_app() TO authenticated;

DROP POLICY IF EXISTS companies_read_authenticated ON companies;
DROP POLICY IF EXISTS companies_insert_authenticated ON companies;
DROP POLICY IF EXISTS companies_update_authenticated ON companies;
DROP POLICY IF EXISTS contacts_read_authenticated ON contacts;
DROP POLICY IF EXISTS contacts_insert_authenticated ON contacts;
DROP POLICY IF EXISTS contacts_update_authenticated ON contacts;
DROP POLICY IF EXISTS profiles_read_authenticated ON profiles;
DROP POLICY IF EXISTS profiles_update_self_name ON profiles;
DROP POLICY IF EXISTS profiles_admin_all ON profiles;
DROP POLICY IF EXISTS tickets_read_authenticated ON tickets;
DROP POLICY IF EXISTS tickets_insert_authenticated ON tickets;
DROP POLICY IF EXISTS tickets_update_authenticated ON tickets;
DROP POLICY IF EXISTS comments_read_authenticated ON ticket_comments;
DROP POLICY IF EXISTS comments_insert_authenticated ON ticket_comments;
DROP POLICY IF EXISTS events_read_authenticated ON ticket_events;

CREATE POLICY companies_read_active ON companies
  FOR SELECT TO authenticated USING (public.can_access_app());
CREATE POLICY companies_insert_active ON companies
  FOR INSERT TO authenticated WITH CHECK (public.can_access_app());
CREATE POLICY companies_update_active ON companies
  FOR UPDATE TO authenticated USING (public.can_access_app()) WITH CHECK (public.can_access_app());

CREATE POLICY contacts_read_active ON contacts
  FOR SELECT TO authenticated USING (public.can_access_app());
CREATE POLICY contacts_insert_active ON contacts
  FOR INSERT TO authenticated WITH CHECK (public.can_access_app());
CREATE POLICY contacts_update_active ON contacts
  FOR UPDATE TO authenticated USING (public.can_access_app()) WITH CHECK (public.can_access_app());

CREATE POLICY profiles_read_active_or_self ON profiles
  FOR SELECT TO authenticated USING (public.can_access_app() OR id = auth.uid());
CREATE POLICY profiles_update_self_active ON profiles
  FOR UPDATE TO authenticated
  USING (public.can_access_app() AND id = auth.uid())
  WITH CHECK (public.can_access_app() AND id = auth.uid());
CREATE POLICY profiles_admin_all ON profiles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY tickets_read_active ON tickets
  FOR SELECT TO authenticated USING (public.can_access_app());
CREATE POLICY tickets_insert_active ON tickets
  FOR INSERT TO authenticated WITH CHECK (public.can_access_app() AND created_by = auth.uid());
CREATE POLICY tickets_update_active ON tickets
  FOR UPDATE TO authenticated USING (public.can_access_app()) WITH CHECK (public.can_access_app() AND updated_by = auth.uid());

CREATE POLICY comments_read_active ON ticket_comments
  FOR SELECT TO authenticated USING (public.can_access_app());
CREATE POLICY comments_insert_active ON ticket_comments
  FOR INSERT TO authenticated WITH CHECK (public.can_access_app() AND author_id = auth.uid());

CREATE POLICY events_read_active ON ticket_events
  FOR SELECT TO authenticated USING (public.can_access_app());

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
