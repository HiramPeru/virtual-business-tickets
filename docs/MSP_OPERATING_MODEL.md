# MSP Operating Model

## Overview

Virtual Business Tickets models a managed service provider workflow where service requests move through a controlled operational path instead of being handled ad hoc.

The goal is to give operators and managers a shared system for intake, prioritization, customer context, progress tracking, and service history.

## Service Model

At a conceptual level, the operating model looks like this:

1. A support need is reported or registered.
2. The request is categorized and prioritized.
3. Ownership is assigned to an internal operator.
4. Work progresses through defined statuses.
5. Comments and events preserve the working history.
6. The ticket is resolved and later closed when operational follow-up is complete.

## Roles And Personas

## Implemented application roles

| Role | Purpose |
| --- | --- |
| `admin` | Governs users, access, and operational administration. |
| `operator` | Handles day-to-day ticket work, customer maintenance, and ticket updates. |
| `client_readonly` | Reviews scoped ticket information tied to the assigned principal client. |
| `pending` | Authenticated but blocked from operational access until approved. |

## Conceptual operating personas

| Persona | Status |
| --- | --- |
| Service Manager | Conceptual oversight persona for queue health, escalations, and service review. Not currently a distinct app role. |
| Technician | Operationally represented by the current `operator` role in this repository. |
| Client Contact | Represented through customer/contact records and optional `client_readonly` access. |

## Ticket Lifecycle

The implemented status model supports:

- `New`
- `Assigned`
- `In Progress`
- `Pending Customer`
- `Resolved`
- `Closed`

This sequence supports a practical MSP flow where requests can be acknowledged, worked, paused for customer response, resolved, and formally closed.

## Prioritization

The current priority model includes:

- `Critical`
- `High`
- `Medium`
- `Low`

These values provide a simple operational signal for workload triage and can support later SLA reporting without claiming any specific contractual response times.

## Escalation And Ownership

Implemented today:

- tickets can be assigned to an internal operator;
- status and priority can be updated during the life of the ticket;
- comments and events preserve visible operational progress.

Conceptual next layer:

- manager-driven escalation paths;
- breach-risk reporting;
- workload balancing across operators;
- customer-communication escalation rules.

## SLA Alignment

This repository demonstrates SLA alignment conceptually rather than contract administration.

What is already useful for SLA-oriented workflows:

- structured priority values;
- explicit ticket states;
- created, resolved, and closed timestamps;
- assignment and comment history;
- exportable ticket data.

What is not currently implemented as a formal SLA engine:

- contract-specific SLA matrices;
- automated breach timers;
- customer-specific response targets;
- escalation automation by SLA rule.

## Governance Value

For MSP operations, the application’s main governance contribution is not just ticket storage. It is the combination of:

- scoped visibility;
- role separation;
- recorded lifecycle changes;
- account grouping through principal clients;
- a workflow that can later support reporting and automation.
