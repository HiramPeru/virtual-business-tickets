# Ticket Workflow

## Overview

This document separates what is implemented in the repository today from what remains conceptual for future service-operations maturity.

## Implemented Workflow

## 1. Ticket creation

Internal users can create tickets from the application.

Implemented fields and workflow signals include:

- category;
- platform;
- priority;
- subject;
- description;
- contact/customer context.

The codebase also supports creating customer contact data as part of the wider operational workflow.

## 2. Triage

The current implementation supports manual triage through:

- category selection;
- platform selection;
- priority selection;
- operator review after creation.

There is no automated classification engine in the current repository.

## 3. Assignment and ownership

Tickets can be assigned to an internal operator through the ticket detail workflow.

This supports a clear ownership signal for operational follow-up, even though no advanced queue-balancing logic is implemented yet.

## 4. Status progression

Implemented statuses:

- `New`
- `Assigned`
- `In Progress`
- `Pending Customer`
- `Resolved`
- `Closed`

These allow operators to distinguish newly created work, actively owned work, items waiting on customer response, and tickets that are resolved or formally closed.

## 5. Comments and event history

The current implementation supports:

- internal comments;
- comments marked as `customer_visible`;
- automatic event records for ticket creation and key lifecycle changes.

This gives the repository a practical operational-history model instead of a simple mutable record with no audit trail.

## 6. Resolution and closure

The database schema includes `resolved_at` and `closed_at` lifecycle behavior tied to status updates.

That supports a clean separation between technical resolution and operational closure.

## Implemented Supporting Workflows

- Ticket list filtering by workflow fields such as status, priority, category, and platform.
- Customer and contact lookup for ticket context.
- Principal-client grouping for MSP account visibility.
- CSV export for internal reporting and review.

## Conceptual Or Future Workflow Layers

Not clearly implemented in the current repository:

- automated intake from email or chat;
- round-robin or rule-based assignment;
- formal queue ownership rules;
- SLA timer automation;
- escalation playbooks;
- customer portal interaction beyond scoped read visibility;
- duplicate ticket detection;
- executive service dashboards.

## Implemented Vs Conceptual Summary

| Area | Current state |
| --- | --- |
| Ticket creation | Implemented |
| Manual triage | Implemented |
| Assignment | Implemented |
| Status tracking | Implemented |
| Comments | Implemented |
| Event history | Implemented |
| CSV export | Implemented |
| Automated classification | Conceptual |
| SLA breach automation | Conceptual |
| Duplicate detection | Conceptual |
| Executive reporting layer | Conceptual |

## Operational Reading

From a portfolio perspective, the important point is that this repository already models a believable service desk core:

- clear ticket states;
- explicit priorities;
- scoped customer context;
- ownership fields;
- operational history.

That makes it credible both as an MSP workflow artifact and as a foundation for future automation.
