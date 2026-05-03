# Supabase and Database

## Overview

The application uses Supabase as the authentication and database layer.

Production identifiers, dashboard URLs and real environment values are intentionally excluded from this document so the repository can be used safely as a portfolio or showcase reference.

## Environment Variables

Required variables are documented in `.env.example` with empty values.

Do not commit local environment files or production credentials.

Privileged server-side credentials must only be configured in trusted server-side environments and must never be exposed to browser code.

## Files

- `supabase/schema.sql`: readable snapshot of the database schema.
- `supabase/migrations/202605012353_initial_schema.sql`: initial migration.
- `supabase/migrations/202605020340_first_user_admin.sql`: updates the trigger so the first profile becomes admin.
- `supabase/migrations/202605020500_harden_auth_policies.sql`: blocks operational access for pending accounts and hardens RLS.
- `supabase/migrations/202605020620_principal_clients_and_users.sql`: adds parent customers, operator roles and customer read-only access.

## Tables

- `companies`: customer companies.
- `principal_clients`: parent customers used to group companies under a managed account.
- `contacts`: contacts associated with companies.
- `profiles`: internal and external users with `admin`, `operator`, `client_readonly` or `pending` roles.
- `ticket_daily_counters`: daily sequence for ticket codes.
- `tickets`: main ticket records.
- `ticket_comments`: ticket comments.
- `ticket_events`: automatic history records.

## Ticket Code

The database trigger generates ticket codes with the following format:

```text
T-YYYYMMDD-0001
```

The `ticket_daily_counters` table prevents collisions under concurrent creation scenarios.

## First Admin

The `create_profile_for_new_user()` trigger creates a profile when a user signs up:

- If no profile exists, the role is set to `admin`.
- If at least one profile exists, the role is set to `pending`.
- `/setup` calls `has_any_profile()` and closes the setup flow after the first profile exists.

## Row Level Security

RLS is enabled for:

- `companies`
- `contacts`
- `profiles`
- `tickets`
- `ticket_comments`
- `ticket_events`

The v1 model allows operational work only for `admin` and `operator` profiles. `client_readonly` users can only read tickets, history and visible comments for their assigned parent customer. `pending` accounts can exist in Auth but are blocked by RLS from reading or modifying operational records.

## Apply Migrations

```bash
npx supabase db push
```

## Public Showcase Rules

Do not expose:

1. Real Supabase project references.
2. Dashboard URLs.
3. Production credentials.
4. Real customer data.
5. Real ticket records.
6. Internal user emails.

## Pending Risks / Hardening Items

- Review tenant-level isolation for larger multi-customer scenarios.
- Expand audit history to all editable fields.
- Document backup and retention policies according to the selected Supabase plan.
- Add automated security checks to CI.
