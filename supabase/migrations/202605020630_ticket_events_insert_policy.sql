CREATE POLICY events_insert_internal ON ticket_events
  FOR INSERT TO authenticated WITH CHECK (public.is_internal_user());
