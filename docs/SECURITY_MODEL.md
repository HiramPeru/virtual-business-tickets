# Security Model

## Overview

Virtual Business Tickets uses Supabase Auth, Supabase Postgres and Row Level Security to separate authenticated access, operational roles and data visibility.

The security model is designed for an internal MSP ticketing workflow with the possibility of limited read-only customer visibility.

## Authentication

Authentication is handled through Supabase Auth.

Application routes are protected at the Next.js layer, while database access is additionally restricted through Supabase RLS policies.

## Role Model

| Role | Access Intent |
|---|---|
| `admin` | Manage operational data and enable users. |
| `operator` | Work with tickets, customers and comments. |
| `client_readonly` | Read assigned customer information without operational write access. |
| `pending` | Authenticated account without operational access until enabled. |

## First Admin Control

The setup flow creates the first administrative profile.

After a profile already exists, the setup path is closed and new accounts are created as `pending` until reviewed by an admin.

## Route Protection

Protected areas include:

- `/tickets`
- `/customers`
- `/profile`

Public or controlled entry routes include:

- `/login`
- `/setup`

## Database Security

RLS is applied to operational tables, including:

- `companies`
- `contacts`
- `profiles`
- `tickets`
- `ticket_comments`
- `ticket_events`

The database layer enforces access even when application routes or UI controls are bypassed.

## Operational Traceability

Ticket changes are supported by event history, allowing the application to preserve a record of relevant lifecycle actions.

Ticket identifiers follow a daily sequence format:

```text
T-YYYYMMDD-0001
```

## Secret Handling

Environment variables must remain outside version control.

Required variables are documented in `.env.example` without real values.

The service role key must only be configured in trusted server-side environments and must never be exposed in client-side code.

## Public Showcase Sanitization

Before making this project public, remove or avoid exposing:

1. Production Supabase project references.
2. Supabase dashboard links.
3. Production deployment URLs if they expose internal workflows.
4. Real customer names.
5. Real contacts, emails or phone numbers.
6. Real ticket records.
7. Secrets, tokens or service-role keys.
8. Internal operational procedures that should remain private.

## Current Security Position

This repository demonstrates a practical security baseline for an internal MSP operations tool:

- Authenticated access.
- Role separation.
- Pending-user gating.
- Read-only customer role.
- Supabase RLS enforcement.
- Server-side secret separation.
- Operational event history.

Further hardening can include tenant-level isolation reviews, expanded audit coverage, backup policy documentation and automated security checks in CI.