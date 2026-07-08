# Security Public Review

## Purpose

This document is a public-repository sanitization checklist and security review frame for Virtual Business Tickets.

It focuses on what should be protected when a real operations system is shared as a public portfolio repository.

## Public Repository Sanitization Checklist

## Secrets and credentials

- Do not commit `.env`, `.env.local`, or provider secrets.
- Keep `.env.example` limited to placeholder variable names only.
- Never expose service-role keys in browser code, screenshots, docs, or issue threads.
- Avoid committing raw CLI output that contains private tokens or dashboard links.

## Authentication and authorization

- Keep authentication delegated to Supabase Auth.
- Preserve route protection for operational areas.
- Keep privileged actions server-side.
- Review admin-only workflows any time user-management logic changes.

## Supabase RLS and access model

- Treat RLS as a primary enforcement layer, not just a backup.
- Re-review policies whenever schema or role behavior changes.
- Confirm `client_readonly` access remains limited to the assigned principal-client scope.
- Confirm `pending` users remain blocked from operational access.

## Audit and event history

- Preserve ticket comments and event history as operational evidence.
- Avoid changes that weaken traceability of status, priority, or assignment changes.
- Expand audit coverage carefully if more editable fields are introduced later.

## Deployment risks

- Do not publish production deployment URLs if they reveal private workflows.
- Do not commit Vercel account identifiers, project metadata, or runtime secrets.
- Keep environment-variable handling in platform settings rather than in source files.

## Backup and disaster recovery

- Document backup and recovery expectations at a policy level, not with private runbooks or live credentials.
- Avoid publishing internal recovery instructions that would help an attacker.
- Keep public DR notes high-level unless a sanitized process is explicitly intended for sharing.

## Sensitive business content

- Remove real customer names, emails, phone numbers, and ticket content from screenshots and examples.
- Avoid publishing private SLAs, account commitments, or incident details.
- Do not describe internal-only escalation procedures as if they were public policy.

## Current Public Review Findings

At the repository level, a safe public baseline should include:

- placeholder-only environment examples;
- no committed production secrets;
- documentation written with sanitized examples;
- generated local build artifacts excluded from version control;
- conceptual deployment notes without live private endpoints.

## Recommended Security Roadmap

1. Add periodic secret scanning in CI.
2. Review RLS behavior alongside schema changes.
3. Expand documented backup and restore posture in a sanitized way.
4. Add a formal public-release checklist for screenshots and sample data.
5. Consider lightweight dependency and static-analysis checks in CI.

## Review Standard

For a public portfolio repository, “secure enough” means the repository can demonstrate architecture and workflow maturity without becoming a source of secrets, private customer information, or exploit-friendly operational detail.
