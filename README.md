# Virtual Business Tickets

Internal ticketing platform designed for MSP operations, built with Next.js, TypeScript, Supabase and Vercel.

## Overview

Virtual Business Tickets is a web-based support management system created to centralize operational ticket handling for managed IT services.

The platform supports internal operators, customer entities, contact management, protected workflows, ticket lifecycle tracking, comments, assignments, priorities, status changes and audit history.

This repository can be used as a technical portfolio showcase. Sensitive production configuration, credentials, customer data and operational records are not included.

## Core Capabilities

- Supabase Auth login.
- Protected application routes.
- First-admin setup workflow.
- Customer management for companies and contacts.
- Parent customer grouping for managed accounts.
- Role-based access model:
  - `admin`
  - `operator`
  - `client_readonly`
  - `pending`
- Manual ticket creation for:
  - Cloud activation
  - Support
  - General consultation
- Ticket filters by:
  - Status
  - Priority
  - Category
  - Platform
- Ticket detail view with:
  - Comments
  - Assignment
  - Priority
  - Status
  - Change history
- Editable technician profile.
- Supabase Postgres schema with:
  - Row Level Security
  - Triggers
  - Daily ticket codes
  - Audit history

## Technical Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js App Router |
| Language | TypeScript |
| UI | React, Tailwind CSS, lucide-react |
| Authentication | Supabase Auth |
| Database | Supabase Postgres |
| Security | Row Level Security |
| Deployment | Vercel |
| Quality | ESLint |

## Architecture

```text
User
  ↓
Next.js App Router
  ↓
Protected Routes / Server Components / Client Components
  ↓
Supabase Auth
  ↓
Supabase Postgres
  ↓
RLS Policies + Triggers + Audit History
```

## Documentation

- [Showcase overview](docs/SHOWCASE.md)
- [Operation guide](docs/OPERACION.md)
- [Technical architecture](docs/ARQUITECTURA.md)
- [Supabase and database](docs/SUPABASE.md)
- [Security model](docs/SECURITY_MODEL.md)
- [Vercel deployment](docs/VERCEL.md)
- [QA checklist](docs/QA.md)
- [Roadmap](docs/ROADMAP.md)
- [Screenshots guide](screenshots/README.md)

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` must be used only in trusted server-side contexts and must never be exposed to client-side code.

## Initial Flow

1. Open `/setup`.
2. Create the first user.
3. The first profile is assigned the `admin` role.
4. Log in through `/login`.
5. Create customers, contacts and tickets.

After at least one profile exists, `/setup` is closed. New Supabase users are created as `pending` until an admin enables them.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npx supabase db push
npx vercel --prod --yes
```

## Portfolio Notes

This project demonstrates:

- Practical SaaS-style application design.
- MSP-oriented workflow modeling.
- Role-based access control.
- Supabase Auth and Postgres integration.
- Row Level Security implementation.
- Serverless deployment with Vercel.
- Internal operations digitization for B2B IT services.

## Status

Private/internal production system. Public-facing material should be treated as a sanitized technical showcase.