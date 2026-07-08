# AI Triage Roadmap

## Status

This document is conceptual roadmap material unless a future change explicitly implements the described capability.

The current repository contains a structured ticketing workflow, but it does not yet implement end-to-end AI triage inside the application.

## Why AI Triage Fits This Repository

Virtual Business Tickets already captures the data structures that AI-assisted support operations typically need:

- ticket subject and description;
- category and platform fields;
- priority and status values;
- customer/account context;
- comment and event history;
- exportable operational records.

That makes the repository a strong candidate for gradual AI augmentation without changing its core business purpose.

## Candidate AI-Assisted Capabilities

## Classification

Use a model to suggest category, platform, or support type from the initial request text.

## Priority suggestion

Recommend a likely priority based on issue wording, affected account context, and historical patterns.

## Summary generation

Generate short operator-ready summaries for tickets, comments, or status transitions.

## Suggested next action

Propose follow-up steps such as:

- request missing information;
- assign to a specialist queue;
- escalate for high business impact;
- prepare a customer update.

## Duplicate detection

Compare new tickets against recent tickets to flag possible duplicates or recurring incidents.

## SLA risk detection

Highlight tickets that may be at risk because of age, inactivity, unresolved priority, or repeated status churn.

## Executive service reporting

Aggregate operational trends into service summaries for account review, queue health, or recurring issue analysis.

## Possible Tooling Paths

Potential implementation paths could involve:

- ChatGPT;
- Claude;
- Codex, OpenCode, or Antigravity-assisted workflows;
- MCP-based orchestration;
- OpenRouter for model routing experiments;
- local models for privacy-sensitive inference;
- Supabase Edge Functions;
- external automation layers and webhooks.

## Responsible Implementation Notes

Any AI integration should preserve:

- role-based access boundaries;
- customer data minimization;
- clear human review for high-impact actions;
- auditable prompts or workflow decisions where appropriate;
- separation between conceptual suggestions and committed operational changes.

## Suggested Rollout Sequence

1. Offline ticket summarization for internal review.
2. Assisted classification and priority suggestion with human approval.
3. SLA-risk flags and duplicate detection alerts.
4. Reporting and service-review summaries.
5. Carefully scoped automations tied to approved workflows.

## What This Repo Already Provides

The current codebase already offers the most important foundation pieces:

- normalized ticket records;
- explicit workflow fields;
- operator roles;
- event history;
- exportable data;
- a server-side surface for future integrations.

That means the roadmap is additive, not speculative fantasy. It extends a real operational system rather than inventing a disconnected AI demo.
