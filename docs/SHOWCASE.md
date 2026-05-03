# Virtual Business Tickets — Showcase Overview

## Purpose

Virtual Business Tickets is an internal ticketing platform designed for a managed services provider operation.

The system centralizes support requests, customer entities, contacts, operators, ticket lifecycle tracking, role-based access, comments and operational history.

## Business Context

MSP operations require consistent visibility over support requests, service categories, responsible operators, customer contacts and ticket history.

This project models that workflow as a lightweight SaaS-style internal application using a serverless web architecture and a managed PostgreSQL backend.

## Product Scope

The current version focuses on internal technical operations.

Included capabilities:

1. Authentication and first-admin setup.
2. Protected operational routes.
3. Customer and contact management.
4. Parent-customer grouping for managed accounts.
5. Ticket creation and tracking.
6. Ticket detail with comments and history.
7. Role-based access for internal and read-only customer users.
8. Supabase Row Level Security policies.
9. Daily ticket code generation.
10. Deployment through Vercel.

## User Roles

| Role | Purpose |
|---|---|
| `admin` | Administrative user with operational control. |
| `operator` | Internal technical operator. |
| `client_readonly` | External or customer-side user with read-only access to assigned information. |
| `pending` | Newly created user awaiting approval. |

## Representative Workflow

```text
Customer request
  ↓
Operator creates ticket
  ↓
Ticket receives category, priority and platform
  ↓
Operator updates status and assignment
  ↓
Comments and events are recorded
  ↓
Ticket history remains available for audit and follow-up
```

## Technical Highlights

- Next.js App Router application structure.
- TypeScript-based implementation.
- Supabase Auth for identity.
- Supabase Postgres as operational database.
- RLS policies to restrict access by role.
- Database triggers for ticket codes and history.
- Vercel deployment model.
- Documentation-first repository structure.

## Portfolio Value

This project demonstrates the ability to translate a real MSP operational need into a working web application with authentication, database modeling, access control, traceability and deployment discipline.

It is positioned as an example of applied technology for B2B IT operations rather than a generic demo application.

## Exclusions From Public Showcase

The public-facing material must not include:

- Production secrets.
- Service role keys.
- Real customer data.
- Real support tickets.
- Private Supabase dashboard links.
- Internal operational credentials.
- Personally identifiable customer information.

## Suggested Screenshots

Recommended screenshots for a public portfolio page:

1. Login page with neutral demo branding.
2. Ticket list using synthetic records.
3. Ticket detail with synthetic comments.
4. Customer/contact list using demo data.
5. Role or profile page with no real user information.
6. Architecture diagram or documentation screenshot.

## Status

Internal production-oriented project. Showcase documentation is sanitized for portfolio use.