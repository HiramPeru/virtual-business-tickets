# Deployment Notes

## Overview

This repository is structured for deployment as a Next.js application backed by Supabase services.

These notes are intentionally conceptual and sanitized. They describe deployment expectations without exposing private infrastructure identifiers, production URLs, or credentials.

## Application Hosting

The documented hosting model is:

- Next.js application deployed on Vercel;
- Supabase Auth for authentication;
- Supabase PostgreSQL for transactional data and RLS-enforced access.

## Environment Variables

Environment configuration should be managed outside version control.

The repository currently documents placeholder variable names in `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Expected handling:

- public client values remain limited to the browser-safe Supabase URL and anon key;
- privileged service-role credentials remain server-side only;
- local development uses `.env.local`;
- hosted environments use platform-managed secrets.

## Deployment Considerations

- Ensure required environment variables are configured before building.
- Keep user-management operations on trusted server-side routes only.
- Validate authenticated route behavior after deployment.
- Verify that protected dashboard routes redirect unauthenticated traffic correctly.
- Confirm RLS-backed behavior using approved test accounts rather than assuming UI restrictions are sufficient.

## Database And Schema Considerations

- Supabase migrations define the operational schema and policy model.
- Schema changes should be applied deliberately and reviewed for RLS impact.
- Public docs should describe migration handling conceptually rather than exposing live project references.

## Verification Checklist

After a deployment, a safe verification pass would typically confirm:

- the app builds successfully;
- login and setup routes respond as expected;
- protected routes require authentication;
- admin-only user workflows remain restricted;
- ticket creation and updates still function with valid test data;
- export and reporting surfaces respond without leaking secrets.

## Public Portfolio Boundaries

Do not publish:

- production URLs tied to private operations;
- live Supabase project identifiers or dashboard links;
- real environment values;
- deployment logs containing private payloads;
- internal runbooks with privileged recovery steps.

## Related Docs

- [docs/VERCEL.md](./VERCEL.md)
- [docs/SUPABASE.md](./SUPABASE.md)
- [docs/SECURITY_PUBLIC_REVIEW.md](./SECURITY_PUBLIC_REVIEW.md)
