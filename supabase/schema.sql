CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  ruc TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'pending' CHECK (role IN ('admin', 'technician', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_daily_counters (
  day TEXT PRIMARY KEY,
  seq INT NOT NULL DEFAULT 0
);

CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code TEXT UNIQUE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE RESTRICT,
  category TEXT NOT NULL CHECK (category IN ('Activacion Cloud', 'Soporte', 'Consulta')),
  subcategory TEXT,
  platform TEXT CHECK (platform IN ('Acronis', 'Microsoft', 'Ambas', 'Ninguna')),
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Assigned', 'In Progress', 'Pending Customer', 'Resolved', 'Closed')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  author_type TEXT NOT NULL CHECK (author_type IN ('technician', 'system')),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal', 'customer_visible')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  actor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_set_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER contacts_set_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tickets_set_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TEXT AS $$
DECLARE
  today TEXT := to_char(CURRENT_DATE, 'YYYYMMDD');
  new_seq INT;
BEGIN
  INSERT INTO ticket_daily_counters(day, seq)
  VALUES (today, 1)
  ON CONFLICT (day)
  DO UPDATE SET seq = ticket_daily_counters.seq + 1
  RETURNING seq INTO new_seq;

  RETURN 'T-' || today || '-' || LPAD(new_seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_ticket_lifecycle()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_code IS NULL THEN
    NEW.ticket_code := generate_ticket_code();
  END IF;

  IF NEW.status = 'Resolved' AND NEW.resolved_at IS NULL THEN
    NEW.resolved_at := NOW();
  END IF;

  IF NEW.status = 'Closed' AND NEW.closed_at IS NULL THEN
    NEW.closed_at := NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tickets_set_ticket_lifecycle
BEFORE INSERT OR UPDATE ON tickets
FOR EACH ROW EXECUTE FUNCTION set_ticket_lifecycle();

CREATE OR REPLACE FUNCTION track_ticket_changes()
RETURNS TRIGGER AS $$
DECLARE
  actor UUID := NEW.updated_by;
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO ticket_events(ticket_id, event_type, actor_id, new_value)
    VALUES (NEW.id, 'created', NEW.created_by, NEW.ticket_code);
    RETURN NEW;
  END IF;

  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO ticket_events(ticket_id, event_type, field_name, old_value, new_value, actor_id)
    VALUES (NEW.id, 'changed', 'status', OLD.status, NEW.status, actor);
  END IF;

  IF OLD.priority IS DISTINCT FROM NEW.priority THEN
    INSERT INTO ticket_events(ticket_id, event_type, field_name, old_value, new_value, actor_id)
    VALUES (NEW.id, 'changed', 'priority', OLD.priority, NEW.priority, actor);
  END IF;

  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
    INSERT INTO ticket_events(ticket_id, event_type, field_name, old_value, new_value, actor_id)
    VALUES (NEW.id, 'changed', 'assigned_to', OLD.assigned_to::TEXT, NEW.assigned_to::TEXT, actor);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tickets_track_insert
AFTER INSERT ON tickets
FOR EACH ROW EXECUTE FUNCTION track_ticket_changes();

CREATE TRIGGER tickets_track_update
AFTER UPDATE ON tickets
FOR EACH ROW EXECUTE FUNCTION track_ticket_changes();

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_full_name ON contacts(full_name);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_tickets_created_at_desc ON tickets(created_at DESC);
CREATE INDEX idx_tickets_status_created_at ON tickets(status, created_at DESC);
CREATE INDEX idx_tickets_priority_created_at ON tickets(priority, created_at DESC);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_contact_id ON tickets(contact_id);
CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX idx_ticket_events_ticket_id ON ticket_events(ticket_id);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_events ENABLE ROW LEVEL SECURITY;

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

CREATE OR REPLACE FUNCTION prevent_self_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo un admin puede cambiar roles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_prevent_role_change
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION prevent_self_role_change();

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

CREATE TRIGGER auth_user_create_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION create_profile_for_new_user();
