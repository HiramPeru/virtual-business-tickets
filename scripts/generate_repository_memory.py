#!/usr/bin/env python3
from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass
from pathlib import Path


REPO_ROOT = Path.cwd()
DOCS_DIR = REPO_ROOT / "Data" / "Docs"

AGENT_CONTEXT_PATH = DOCS_DIR / "AGENT_CONTEXT.md"
ACTIVE_WORK_PATH = DOCS_DIR / "ACTIVE_WORK.md"
DECISIONS_LOG_PATH = DOCS_DIR / "DECISIONS_LOG.md"

PROJECT_INSTRUCTIONS_CANDIDATES = [
    REPO_ROOT / "PROJECT_INSTRUCTIONS.md",
    REPO_ROOT / "AGENT_RULES.md",
]
README_PATH = REPO_ROOT / "README.md"
CHANGELOG_CANDIDATES = [
    DOCS_DIR / "CHANGELOG.md",
    REPO_ROOT / "CHANGELOG.md",
]
DECISION_LOG_CANDIDATES = [
    DOCS_DIR / "decision-log.md",
    DOCS_DIR / "DECISIONS.md",
    REPO_ROOT / "docs" / "decision-log.md",
]


@dataclass
class DecisionRow:
    date: str
    decision: str
    rationale: str
    impact: str


def run_git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        cwd=REPO_ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.rstrip("\n")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def first_existing(paths: list[Path]) -> Path | None:
    for path in paths:
        if path.exists():
            return path
    return None


def architecture_paths() -> list[Path]:
    paths: list[Path] = []
    for candidate in [
        DOCS_DIR / "architecture.md",
        *sorted(DOCS_DIR.glob("ARCHITECTURE*.md")),
        *(sorted((REPO_ROOT / "docs").glob("architecture*.md")) if (REPO_ROOT / "docs").exists() else []),
    ]:
        if candidate.exists() and candidate not in paths:
            paths.append(candidate)
    return paths


def extract_section_bullets(text: str, heading_fragment: str) -> list[str]:
    pattern = re.compile(
        rf"^##\s+.*{re.escape(heading_fragment)}.*$([\s\S]*?)(?=^##\s+|\Z)",
        re.MULTILINE,
    )
    match = pattern.search(text)
    if not match:
        return []
    body = match.group(1)
    return [line[2:].strip() for line in body.splitlines() if line.startswith("- ")]


def first_sentence(text: str) -> str:
    collapsed = " ".join(
        line.strip()
        for line in text.splitlines()
        if line.strip() and not line.lstrip().startswith("#") and not line.lstrip().startswith("```")
    )
    match = re.match(r"(.+?[.!?])(?:\s|$)", collapsed)
    return match.group(1) if match else collapsed


def compact_text(text: str, max_length: int = 96) -> str:
    collapsed = " ".join(
        line.strip().lstrip("* ").strip()
        for line in text.splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    )
    collapsed = re.sub(r"\s+", " ", collapsed)
    if len(collapsed) <= max_length:
        return collapsed
    trimmed = collapsed[: max_length - 1].rsplit(" ", 1)[0].rstrip(",;:-")
    return trimmed + "..."


def recent_changelog_sections(changelog_text: str, limit: int = 2) -> list[tuple[str, str]]:
    matches = list(
        re.finditer(r"^##\s+(\d{4}-\d{2}-\d{2}(?:\s+-\s+.+)?)\s*$", changelog_text, re.MULTILINE)
    )
    sections: list[tuple[str, str]] = []
    for index, match in enumerate(matches[:limit]):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(changelog_text)
        sections.append((match.group(1), changelog_text[start:end].strip()))
    return sections


def active_branch() -> str:
    branch = run_git("branch", "--show-current").strip()
    return branch or "unknown-branch"


def product_summary(readme_text: str, governance_text: str) -> str:
    summary = ""
    for line in readme_text.splitlines():
        stripped = line.strip()
        if stripped and not stripped.startswith("#"):
            summary = stripped
            break
    preserve_rule = "Preserve current project behavior unless the current prompt explicitly authorizes a behavior change."
    if preserve_rule in extract_section_bullets(governance_text, "Core governance rules"):
        summary = f"{summary} Preserve current operator or product behavior unless explicitly authorized."
    return summary or "Repository purpose not found. Document the product summary in README.md."


def governance_summary(governance_text: str) -> list[str]:
    lines = extract_section_bullets(governance_text, "Core governance rules")[:5]
    source_rules = extract_section_bullets(governance_text, "Source-of-truth rules")
    if source_rules:
        lines.append("Treat changelog and historical reports as evidence only, not active authority.")
    return lines or ["Document governance rules in PROJECT_INSTRUCTIONS.md or AGENT_RULES.md."]


def architecture_summary(paths: list[Path]) -> list[str]:
    if not paths:
        return ["No architecture docs found. Add an architecture doc before relying on generated summaries."]
    first = read_text(paths[0])
    summary = [first_sentence(first)]
    summary.append("Navigation, orchestration, and trust boundaries should be summarized from the repository's current architecture docs.")
    if len(paths) > 1:
        refs = ", ".join(path.name for path in paths[1:5])
        summary.append(f"Additional architecture references: {refs}.")
    return summary


def primary_source_docs(governance_path: Path | None, changelog_path: Path | None, decision_path: Path | None, arch_paths: list[Path]) -> list[str]:
    docs = [README_PATH]
    if governance_path:
        docs.insert(0, governance_path)
    if changelog_path:
        docs.append(changelog_path)
    if decision_path:
        docs.append(decision_path)
    docs.extend(arch_paths[:4])
    unique: list[Path] = []
    for path in docs:
        if path.exists() and path not in unique:
            unique.append(path)
    return [f"`{path.relative_to(REPO_ROOT)}`" for path in unique]


def infer_focus(sections: list[tuple[str, str]]) -> list[str]:
    if not sections:
        return ["No durable active theme inferred from changelog; start with a live repository audit."]
    heading = sections[0][0].lower()
    if "dashboard" in heading or "ui" in heading:
        return ["Recent durable focus points to current UI or dashboard work documented in the changelog."]
    if "infra" in heading or "governance" in heading or "dr" in heading:
        return ["Recent durable focus points to repository governance, infrastructure, or recovery work."]
    return [f"Most recent durable documented focus: {sections[0][0]}"]


def blocked_tasks() -> list[str]:
    return [
        "Push, deploy, schema, auth, and runtime changes remain blocked unless explicitly approved in the current prompt.",
        "If browser validation requires authenticated access, use approved credentials only.",
    ]


def next_authorized_action() -> list[str]:
    return [
        "Run git status and inspect the exact files named in the next request.",
        "Regenerate the repository memory layer after any approved governance, changelog, architecture, or decision-log change.",
        "Stop before push or deploy unless explicitly authorized.",
    ]


def extract_decisions(decision_text: str, limit: int = 6) -> list[DecisionRow]:
    rows: list[DecisionRow] = []
    for block in decision_text.split("\n---"):
        heading = re.search(r"##\s+(?:ADR\s+\d+:\s+)?(.+)", block)
        date = re.search(r"\* \*\*Date\*\*: ([0-9-]+)", block)
        context = re.search(r"\* \*\*Context\*\*:\n(.*?)(?=\n\* \*\*Decision\*\*:|\Z)", block, re.S)
        consequences = re.search(r"\* \*\*Consequences\*\*:\n(.*?)(?=\Z)", block, re.S)
        if not (heading and date and context and consequences):
            continue
        rows.append(
            DecisionRow(
                date=date.group(1),
                decision=compact_text(heading.group(1), max_length=52),
                rationale=compact_text(context.group(1), max_length=80),
                impact=compact_text(consequences.group(1), max_length=80),
            )
        )
        if len(rows) >= limit:
            break
    return rows


def render_bullets(lines: list[str]) -> str:
    return "\n".join(f"- {line}" for line in lines)


def render_agent_context(
    branch: str,
    summary: str,
    architecture: list[str],
    governance: list[str],
    recent_signals: list[str],
    primary_docs: list[str],
) -> str:
    return f"""<!-- AUTO-GENERATED: run `python3 scripts/generate_repository_memory.py` -->
# AGENT_CONTEXT

Compact operational context for future AI sessions. Refresh from stable repository evidence instead of editing manually.

## Product summary

{summary}

## Current branch and status

- Active branch: `{branch}`
- Run `git status` at session start.

## Architecture summary

{render_bullets(architecture)}

## Core modules

- Document the repository's main application entrypoints, orchestration layer, views, backend surfaces, and automation scripts here.
- Keep module bullets short and grounded in actual repository files.

## Business rules

- Summarize durable business rules from current specs, README, and changelog.
- Avoid volatile operational state and temporary worktree observations.

## Governance rules

{render_bullets(governance)}

## Known constraints

- No timestamps in generated output.
- No dirty git status in generated output.
- No latest commit hash in generated output.
- Output should remain stable across two consecutive runs with unchanged inputs.

## Agent working conventions

- Audit the exact files, docs, tables, or workflows named in the prompt before proposing or implementing non-trivial changes.
- Prefer repository and runtime evidence over memory; use memory only as a routing hint.
- Reuse existing implementation paths instead of creating parallel files or duplicate workflows.
- Keep instructions and prompts in English unless the target repository explicitly requires otherwise.

## Recent repo signals

{render_bullets(recent_signals)}

## Primary source docs

{render_bullets(primary_docs)}
"""


def render_active_work(branch: str, focus: list[str], blocked: list[str], next_action: list[str]) -> str:
    return f"""<!-- AUTO-GENERATED: run `python3 scripts/generate_repository_memory.py` -->
# ACTIVE_WORK

Current execution snapshot for future sessions. Re-verify with live repo state before acting.

## Active branch

- `{branch}`

Run `git status` at session start.

## Active module or focus

{render_bullets(focus)}

## Blocked tasks

{render_bullets(blocked)}

## Next authorized action

{render_bullets(next_action)}
"""


def render_decisions_log(decision_path: Path | None, rows: list[DecisionRow]) -> str:
    source_ref = f"`{decision_path.relative_to(REPO_ROOT)}`" if decision_path else "`decision-log.md`"
    lines = [
        "<!-- AUTO-GENERATED: run `python3 scripts/generate_repository_memory.py` -->",
        "# DECISIONS_LOG",
        "",
        "Durable decisions only. Keep this compressed and reference the full ADR source when more detail exists.",
        "",
        f"For full ADR detail, read {source_ref}.",
        "",
        "| Date | Decision | Rationale | Impact |",
        "| --- | --- | --- | --- |",
    ]
    for row in rows:
        lines.append(f"| {row.date} | {row.decision} | {row.rationale} | {row.impact} |")
    return "\n".join(lines)


def main() -> None:
    governance_path = first_existing(PROJECT_INSTRUCTIONS_CANDIDATES)
    changelog_path = first_existing(CHANGELOG_CANDIDATES)
    decision_path = first_existing(DECISION_LOG_CANDIDATES)
    arch_paths = architecture_paths()

    governance_text = read_text(governance_path) if governance_path else ""
    readme_text = read_text(README_PATH) if README_PATH.exists() else ""
    changelog_text = read_text(changelog_path) if changelog_path else ""
    decision_text = read_text(decision_path) if decision_path else ""

    branch = active_branch()
    recent_sections = recent_changelog_sections(changelog_text, limit=2) if changelog_text else []
    recent_signals = [f"{heading}: {body_line[2:].strip()}" for heading, body in recent_sections for body_line in body.splitlines() if body_line.startswith("- ")][:2]
    if not recent_signals:
        recent_signals = ["Add changelog entries to improve durable signal quality."]

    write_text(
        AGENT_CONTEXT_PATH,
        render_agent_context(
            branch=branch,
            summary=product_summary(readme_text, governance_text),
            architecture=architecture_summary(arch_paths),
            governance=governance_summary(governance_text),
            recent_signals=recent_signals,
            primary_docs=primary_source_docs(governance_path, changelog_path, decision_path, arch_paths),
        ),
    )
    write_text(
        ACTIVE_WORK_PATH,
        render_active_work(
            branch=branch,
            focus=infer_focus(recent_sections),
            blocked=blocked_tasks(),
            next_action=next_authorized_action(),
        ),
    )
    write_text(
        DECISIONS_LOG_PATH,
        render_decisions_log(decision_path, extract_decisions(decision_text)),
    )


if __name__ == "__main__":
    main()
