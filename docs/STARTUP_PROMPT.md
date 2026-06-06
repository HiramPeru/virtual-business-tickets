<!-- TEMPLATE -->
# STARTUP_PROMPT

Use this prompt to start future AI sessions with minimal token overhead.

```text
Read the generated AGENT_CONTEXT.md first.
Then read ACTIVE_WORK.md.

Rules:
- Audit before acting.
- Verify live repository state before trusting memory or old reports.
- Do not create parallel files, parallel workflows, or duplicate architecture when an existing path already exists.
- Keep prompts and delegated instructions in English.

Before changing anything:
- Run git status.
- Inspect the exact files or docs named in the request.
- Confirm forbidden surfaces and stay within scope.

Before closing:
- Validate the changed surface.
- Report touched files and intentionally untouched surfaces.
- Do not commit, push, or deploy unless explicitly authorized.
```
