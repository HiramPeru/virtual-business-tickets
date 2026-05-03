# Operation Guide

## Overview

This guide describes the operational flow for the Virtual Business Tickets application using sanitized route examples.

Production URLs and real customer references are intentionally excluded so this document can be used as part of a public or portfolio-oriented showcase.

## Main Routes

- `/setup`: initial setup and first-admin creation.
- `/login`: user login.
- `/tickets`: ticket list.
- `/tickets/new`: ticket creation.
- `/tickets/[id]`: ticket detail.
- `/customers`: customer and contact list.
- `/customers/new`: customer creation.
- `/profile`: visible technician profile.

## First Admin

1. Open `/setup`.
2. Register the first user.
3. If no profile exists in `profiles`, Supabase creates the profile with `role = 'admin'`.
4. If a profile already exists, `/setup` is closed.
5. If email confirmation is required by Supabase, confirm the account before logging in.
6. Log in through `/login`.

## User Management

- Users created after the first admin remain as `pending` until enabled by an admin.
- A `pending` profile cannot read or modify operational data.
- An admin can create and enable users from the application.
- The `operator` role can work with tickets and customer records.
- The `client_readonly` role is linked to a parent customer and can only read the corresponding historical records.

## Parent Customers

Parent customers group multiple companies under a managed account.

Each customer company should be associated with a parent customer when applicable.

## Daily Use

### Manage Customers

**Create customer:**

1. Go to `Customers`.
2. Select `New customer`.
3. Register the required customer and company fields.

A customer can also be created during ticket creation from the `New customer` section.

**Edit customer:**

1. Go to `Customers`.
2. Select the edit action in the customer row.
3. Modify the required contact or company fields.

If the company or parent customer is modified, the related company association may also change.

### Create Ticket

1. Go to `Tickets`.
2. Select `New ticket`.
3. Search for the customer.
4. Complete category, platform, priority, subject and description.
5. Save the ticket.
6. The application redirects to the ticket detail page.

### Manage Ticket

From the ticket detail page, an operator can:

- Change status.
- Change priority.
- Assign technician.
- Edit category, platform, subcategory, subject and description.
- Add internal comments.
- Add comments marked as customer-visible for future portal use.
- Review automatic history for creation, status, priority and assignment events.

## Status Values

- `New`: recently created.
- `Assigned`: assigned to a technician.
- `In Progress`: actively being worked on.
- `Pending Customer`: waiting for customer information.
- `Resolved`: technically resolved.
- `Closed`: operationally closed.

## Priority Values

- `Critical`: high impact or immediate urgency.
- `High`: important and requires prompt attention.
- `Medium`: normal priority.
- `Low`: non-urgent request or consultation.

## Operating Rules

- Tickets are created manually in v1.
- There is no automatic email ingestion in this version.
- A customer contact must exist before a ticket is created, although the contact can be created during the ticket creation flow.
- The ticket code must not be manually changed.
- Closing a ticket should be used only when no further action is required.
- `customer_visible` comments are prepared for a future customer portal; in v1 they remain within the technical panel.

## Public Showcase Rules

Do not include in screenshots or documentation:

1. Real customer names.
2. Real support cases.
3. Real contact data.
4. Production URLs.
5. Internal-only procedures that should not be public.
