# Portfolio Overview

## Purpose

Virtual Business Tickets is presented here as a public technical portfolio for an MSP-oriented support and service operations platform.

The repository shows how a practical internal service desk can be modeled with modern web tooling, database-backed access control, and workflow traceability.

## What The Repository Demonstrates

- MSP service operations and support delivery workflows.
- Ticket lifecycle management from intake through closure.
- Role-based access for administrators, operators, and scoped customer visibility.
- Principal-client account modeling for managed service relationships.
- Supabase Auth and PostgreSQL-backed operational data handling.
- Service history through comments, events, and status transitions.
- Deployment-ready Next.js application structure.
- Documentation-aware engineering and repository governance.

## Why It Matters For MSP And B2B Operations

MSP environments need more than a generic CRUD interface. They need controlled access, operational visibility, prioritization, and a durable record of service activity across multiple customer accounts.

This repository demonstrates those concerns in a focused way:

- customer entities and contacts are modeled explicitly;
- ticket status and priority are first-class workflow fields;
- principal clients support grouped account visibility;
- audit-friendly event history is stored alongside ticket activity;
- customer read access is deliberately narrower than operator access.

## Professional Positioning

This project is relevant for roles and engagements involving:

- technical account management;
- MSP consulting;
- service operations leadership;
- support workflow design;
- AI-assisted support automation;
- modern web delivery with Supabase and Vercel.

## Positioning For AI Automation

Although the current application is primarily a structured operational system, it already contains the surfaces an AI workflow would need:

- normalized ticket inputs;
- priority and status fields;
- comment and event history;
- customer/account context;
- exportable operational data.

That makes the repository a strong starting point for future AI-assisted triage, service reporting, summarization, and risk detection work.

## Public Portfolio Boundaries

This is a sanitized public repository:

- no production credentials should appear here;
- no private customer records should be shown;
- no confidential SLAs, contracts, or internal procedures should be disclosed;
- roadmap ideas should be labeled as conceptual unless already implemented.

## Recommended Reading Path

1. [README.md](../README.md)
2. [docs/MSP_OPERATING_MODEL.md](./MSP_OPERATING_MODEL.md)
3. [docs/TICKET_WORKFLOW.md](./TICKET_WORKFLOW.md)
4. [docs/architecture.md](./architecture.md)
5. [docs/AI_TRIAGE_ROADMAP.md](./AI_TRIAGE_ROADMAP.md)
