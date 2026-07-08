# Virtual Business Tickets

Virtual Business Tickets is a public technical portfolio repository for an MSP-oriented ticketing and service operations system built with Next.js, TypeScript, Supabase, and Vercel.

## Executive Summary

This project demonstrates how a lightweight service desk platform can support MSP workflows such as ticket intake, prioritization, role-based operations, customer visibility, audit history, and service governance.

The repository contains real application code, but it is presented as a sanitized portfolio artifact. It is intended to show architecture, workflow design, access-control decisions, and delivery discipline without exposing production secrets, private customer data, or internal operating details.

## Business Problem

Managed service providers need a reliable way to centralize support requests, track ownership, preserve service history, and separate internal operator actions from limited customer visibility.

Without a structured ticketing workflow, support delivery becomes harder to prioritize, harder to audit, and harder to align with SLA-oriented service expectations.

## Solution Overview

Virtual Business Tickets models that operational problem as a web application with:

- authenticated access via Supabase Auth;
- protected Next.js routes for operational users;
- a PostgreSQL-backed ticket lifecycle;
- role-based access with Row Level Security;
- customer, contact, and parent-account management;
- comment and event history for operational traceability;
- a foundation for reporting, exports, and future automation.

## Functional Modules

Implemented in the current repository:

- First-admin setup and authenticated login.
- Dashboard access control for approved users.
- User administration for `admin` users.
- Principal-client management for grouped MSP accounts.
- Customer company and contact management.
- Ticket creation, list filtering, detail review, and updates.
- Ticket comments with internal and customer-visible visibility modes.
- Ticket event history generated from lifecycle changes.
- CSV ticket export for internal operational reporting.
- Profile management for visible operator identity.

## Technical Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js App Router, React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Supabase Auth |
| Data | Supabase PostgreSQL |
| Access Control | PostgreSQL Row Level Security |
| Hosting | Vercel |
| Quality | ESLint |

## Architecture Summary

The system uses a Next.js application as the operator-facing workflow layer, Supabase Auth for authentication, and Supabase PostgreSQL for transactional ticket data and access enforcement.

- Users authenticate through Supabase Auth.
- The Next.js app protects operational routes and server handlers.
- PostgreSQL stores tickets, comments, events, companies, contacts, profiles, and principal clients.
- RLS policies restrict data access by role and customer scope.
- Database triggers generate ticket codes and record lifecycle events.
- Export and future automation/reporting capabilities sit on top of the core workflow data.

See [docs/architecture.md](docs/architecture.md) and [diagrams/system-architecture.mmd](diagrams/system-architecture.mmd).

## Core Workflows

- First-admin bootstrap: the first approved profile becomes `admin`, then later users remain `pending` until reviewed.
- Ticket operations: internal users create tickets, set category/platform/priority, update status, assign ownership, and add comments.
- Customer scoping: principal clients group customer companies for MSP account visibility.
- Customer-read access: `client_readonly` users are limited to records associated with their assigned principal client.
- Audit trail: ticket events and comments preserve operational history for follow-up and service review.

## Security And Access Control

- Supabase Auth handles user authentication.
- Next.js route protection limits dashboard access to authenticated users.
- PostgreSQL RLS enforces role-based and customer-scoped access at the data layer.
- `pending` users are blocked from operational access until approved.
- `admin` users can manage users and privileged workflows.
- `operator` users can manage day-to-day ticket workflows.
- `client_readonly` users are limited to scoped read access.
- Service-role credentials are intended for trusted server-side use only.

More detail: [docs/SECURITY_PUBLIC_REVIEW.md](docs/SECURITY_PUBLIC_REVIEW.md) and [docs/SECURITY_MODEL.md](docs/SECURITY_MODEL.md).

## Public Repository Scope

This repository is a public technical portfolio, not a production-operations dump.

- Production secrets and private credentials must never be committed.
- Real customer names, emails, ticket records, and internal procedures should stay out of public materials.
- Documentation should distinguish implemented capabilities from roadmap ideas.
- Deployment examples should stay conceptual and use placeholders only.

## Documentation Index

Public portfolio documentation:

- [Portfolio overview](docs/PORTFOLIO_OVERVIEW.md)
- [MSP operating model](docs/MSP_OPERATING_MODEL.md)
- [Ticket workflow](docs/TICKET_WORKFLOW.md)
- [AI triage roadmap](docs/AI_TRIAGE_ROADMAP.md)
- [Security public review](docs/SECURITY_PUBLIC_REVIEW.md)
- [Deployment notes](docs/DEPLOYMENT_NOTES.md)
- [Architecture overview](docs/architecture.md)

Supporting repository docs:

- [Showcase overview](docs/SHOWCASE.md)
- [Operation guide](docs/OPERACION.md)
- [Technical architecture (Spanish)](docs/ARQUITECTURA.md)
- [Supabase and database](docs/SUPABASE.md)
- [Security model](docs/SECURITY_MODEL.md)
- [Vercel deployment](docs/VERCEL.md)
- [Spec driven development](docs/SDD.md)
- [QA checklist](docs/QA.md)
- [Roadmap](docs/ROADMAP.md)
- [Specs index](docs/specs/README.md)

## Local Development

The existing package scripts support local development:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Useful scripts:

```bash
npm run lint
npm run build
```

Required environment variables are intentionally documented with placeholders only:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` must stay server-side and must never be exposed to browser code.

## Portfolio Positioning

This repository is designed to showcase:

- MSP service operations modeling.
- Ticket lifecycle design.
- SLA-aligned support workflow thinking.
- Role-based access and governance controls.
- Supabase/PostgreSQL-backed B2B application delivery.
- Security-aware engineering for internal operations tools.
- A credible foundation for AI-assisted triage and operational reporting.

## Sanitization Notice

If this repository continues to evolve as a public portfolio, contributors should treat sanitization as an ongoing requirement. The codebase should communicate technical depth without exposing secrets, customer data, private infrastructure, or unsupported production claims.
