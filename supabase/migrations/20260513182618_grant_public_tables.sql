grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

grant select, insert, update, delete on public.companies to authenticated;
grant select, insert, update, delete on public.companies to service_role;

grant select, insert, update, delete on public.tickets to authenticated;
grant select, insert, update, delete on public.tickets to service_role;

grant select, insert, update, delete on public.ticket_comments to authenticated;
grant select, insert, update, delete on public.ticket_comments to service_role;

grant select, insert, update, delete on public.ticket_events to authenticated;
grant select, insert, update, delete on public.ticket_events to service_role;

grant select, insert, update, delete on public.principal_clients to authenticated;
grant select, insert, update, delete on public.principal_clients to service_role;

grant select, insert, update, delete on public.contacts to authenticated;
grant select, insert, update, delete on public.contacts to service_role;
