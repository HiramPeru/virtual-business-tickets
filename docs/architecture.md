# Architecture Overview

## Summary

Virtual Business Tickets uses a straightforward service-operations architecture:

- a Next.js frontend and server layer for user workflows;
- Supabase Auth for identity;
- PostgreSQL tables, policies, and triggers for operational data;
- Vercel-oriented deployment for application delivery.

## Main Layers

| Layer | Responsibility |
| --- | --- |
| User roles | Admin, operator, pending user, and scoped customer read access |
| Next.js app | UI, route protection, server handlers, and workflow orchestration |
| Supabase Auth | Authentication and session management |
| PostgreSQL schema | Tickets, comments, events, contacts, companies, profiles, and principal clients |
| RLS and triggers | Access enforcement, ticket-code generation, and lifecycle event history |
| Reporting and automation | CSV export today, AI/reporting extensions later |

## Repository Evidence

Relevant implementation surfaces include:

- `src/app/(auth)` for setup and login flows;
- `src/app/(dashboard)` for operational pages;
- `src/app/api` for server-side workflow handlers;
- `src/app/lib` for Supabase clients and environment validation;
- `supabase/schema.sql` and `supabase/migrations` for data model and policy logic.

## Diagrams

- [System architecture](../diagrams/system-architecture.mmd)
- [Ticket lifecycle](../diagrams/ticket-lifecycle.mmd)
- [AI triage roadmap](../diagrams/ai-triage-roadmap.mmd)
