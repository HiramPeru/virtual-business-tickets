# Vercel Deployment

## Overview

The application is designed to be deployed on Vercel as a Next.js project.

Production deployment URLs, account scopes and project identifiers are intentionally excluded from this document so the repository can be used safely as a portfolio or showcase reference.

## Environment Variables

Configure the required Supabase-related environment variables in Vercel Project Settings.

Use `.env.example` as the reference for variable names and keep real values outside version control.

## Manual Deployment

```bash
npx vercel --prod --yes
```

For regular maintenance, environment variables should be stored in Vercel Project Settings rather than passed manually in CLI commands.

## Verification

Use the deployment URL assigned by Vercel and validate the main routes:

```bash
curl -I https://your-deployment-domain/login
curl -I https://your-deployment-domain/setup
```

Expected behavior:

- `/` responds and redirects to `/tickets`.
- `/tickets` without a session redirects to `/login?next=%2Ftickets`.
- `/login` responds successfully.
- `/setup` responds when accessed without a session, subject to first-admin setup rules.

## Important Files

- `.vercelignore`: prevents `.env.local`, `.next`, `node_modules` and local metadata from being uploaded.
- `.env.local`: local-only environment file; must not be committed.
- `.vercel/`: local Vercel metadata; should not be reviewed or edited unless needed.

## Logs

```bash
npx vercel logs https://your-deployment-domain
```

Depending on the Vercel CLI version, `logs` may remain in streaming mode waiting for new events.

## Public Showcase Rules

Do not expose:

1. Production deployment URLs that reveal internal workflows.
2. Vercel project identifiers.
3. Vercel account or scope identifiers.
4. Production environment values.
5. Internal deployment logs containing sensitive data.
