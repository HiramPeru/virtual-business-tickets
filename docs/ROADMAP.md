# Roadmap

## Current V1

- Internal system for technical operators.
- Manual ticket entry.
- Customers, tickets, comments and history.
- First-admin setup through `/setup`.
- Supabase RLS baseline for authenticated users.
- Deployment on Vercel.
- Parent-customer grouping.
- Operator and customer read-only roles.
- Spec Driven Development workflow documented in `docs/SDD.md`.

## Priority Improvements

1. Export tickets and customers to Excel or CSV.
2. Attachments with Supabase Storage.
3. Operational dashboard: open tickets, overdue tickets, tickets by technician and tickets by platform.
4. SLA and target dates by priority.
5. Email notifications.
6. More complete audit trail for editable fields.
7. Global search by code, subject, customer and description.
8. Demo seed data for portfolio screenshots.
9. Automated tests for the main API routes.
10. Public showcase repository or sanitized public branch.

## Future Scope

- Customer portal.
- Truly customer-visible comments.
- Email ingestion or mailbox integration.
- WhatsApp integration.
- Monthly report by customer and platform.
- More granular roles.
- Multi-tenant hardening.
- CI checks for lint, build and dependency review.

## Technical Debt

- Persist deployment variables in the platform dashboard instead of passing values through CLI.
- Add automated tests for core API routes.
- Define backup and retention policy.
- Review dependencies before broader production use.
- Add sample data scripts using only synthetic records.
- Add screenshots with demo records.

## Portfolio Track

To make the project suitable for public presentation:

1. Keep production information out of documentation.
2. Use only synthetic data in screenshots.
3. Avoid exposing real customer names or operational records.
4. Add architecture diagrams.
5. Add a short product demo flow.
6. Publish either a sanitized branch or a separate showcase repository.
