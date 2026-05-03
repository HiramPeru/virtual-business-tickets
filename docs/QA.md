# QA Checklist

## Build

```bash
npm run build
```

The build must finish without TypeScript errors.

## Authentication

- Open `/setup`.
- Create the first admin user.
- Confirm that `/setup` is closed after the first profile exists.
- Confirm email if Supabase requires it.
- Log in through `/login`.
- Confirm redirect to `/tickets`.
- Log out.
- Confirm that `/tickets` redirects to `/login` when no session exists.
- Test that `/login?next=https://example.com` redirects to `/tickets`, not to the external domain.

## Customers

- Create or confirm a demo parent customer.
- Create a customer from `/customers/new`.
- Associate a company with a parent customer.
- Verify that it appears in `/customers`.
- Create a customer from `/tickets/new` using `New customer`.
- Search customer by a synthetic email.
- Search customer by a synthetic name.

## Tickets

- Create a ticket with an existing demo customer.
- Create a ticket with a new demo customer.
- Verify the automatic code format `T-YYYYMMDD-0001`.
- Test filters by status, priority, category and platform.
- Open ticket detail.
- Change status.
- Change priority.
- Assign technician.
- Edit description.
- Confirm that history records the main changes.

## Comments

- Add an internal comment.
- Add a comment marked as visible for a future customer portal.
- Confirm differentiated styling in the detail page.

## Profile

- Change the visible full name.
- Verify that the name appears in the header and in new comments.
- Confirm that the UI does not expose role changes from the profile page.

## Users

- Create an `operator` user using synthetic data.
- Create a `client_readonly` user linked to a demo parent customer.
- Confirm that `client_readonly` can view assigned tickets without create, edit or comment actions.
- Confirm that `client_readonly` does not see customer, parent-customer or user administration sections.

## Production / Demo Deployment

- Open the deployed `/login` route.
- Log in with a demo or test user.
- Create a demo customer.
- Create a demo ticket.
- Resolve or close the demo ticket.

## Showcase Rules

For public screenshots or demos, use only synthetic data. Do not use real customers, real tickets, real contact data or production-only operational records.
