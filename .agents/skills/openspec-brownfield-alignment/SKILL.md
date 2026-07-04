---
name: openspec-brownfield-alignment
description: Bootstraps, audits, migrates, or realigns OpenSpec artifacts for an existing project while preserving uncertainty and avoiding unauthorized codebase scans. Use when the user asks to initialize OpenSpec in a brownfield project, reconstruct current-state specs, migrate existing requirements to OpenSpec, repair stale OpenSpec files, generate openspec/config.yaml, or organize unresolved specification questions.
---

# OpenSpec Brownfield Alignment

Build a trustworthy OpenSpec baseline for an existing project. Describe current, evidenced behavior in main specs; keep proposed behavior in changes; and record uncertainty instead of turning it into fact.

## Scope

This skill may:

- Bootstrap, audit, migrate, enrich, or realign `openspec/` artifacts.
- Create or update `openspec/config.yaml` and `openspec/specs/<domain>/spec.md`.
- Ensure `openspec/changes/` exists without creating an active change unnecessarily.
- Create `openspec/alignment-report.md` and `openspec/open-points.md`.
- Recommend optional supporting documents.

Do not implement application code, modify business source code without an explicit request, archive changes without explicit approval, or invent undocumented behavior.

## Repository access policy

Treat an OpenSpec alignment request as permission to inspect supplied documents and the existing `openspec/` subtree. It is not permission to scan the application codebase.

Without explicit code-analysis authorization, use only:

- Documents, excerpts, trees, and files supplied in the conversation.
- Existing OpenSpec artifacts.
- A README or other file explicitly supplied or named by the user.
- The repository name and already-provided directory tree.

Do not recursively enumerate or search source files to infer system behavior. If code analysis would materially improve the result, explain its scope, cost, and purpose, then ask for permission. Code analysis is authorized when the user explicitly requests it, confirms it, or asks to derive specs from existing code.

When authorized, scan narrowly: inspect likely entry points and relevant domains first, expand only as needed, and report what was analyzed.

## Inputs

Accept project specifications, product briefs, architecture documents, user stories, backlogs, diagrams, README files, ADRs, API or deployment documentation, security documentation, legacy specs, agent rules, repository references, or explicit OpenSpec instructions.

## Operating modes

Choose one mode and record it in the alignment report:

- `bootstrap`: no usable `openspec/` baseline exists.
- `realign`: OpenSpec exists but is incomplete, stale, or contradictory.
- `migration`: source material comes from another specification framework.
- `enrichment`: the baseline is usable and only selected context or specs need improvement.

If intent is ambiguous, choose the narrowest safe mode, state the assumption, and continue with a first useful draft.

## Hard gates

Evaluate these gates before writing artifacts. Do not turn the gates into a long mandatory interview.

1. **Intent**: identify the mode and requested deliverables.
2. **Evidence**: list available source material and its relevance.
3. **Code access**: set `not_available`, `available_not_authorized`, `authorized`, or `partial_context_only`.
4. **Confidence**: classify findings as `confirmed`, `inferred`, `assumed`, or `unknown`.
5. **Artifacts**: identify files to create, update, recommend, or defer.
6. **Overspecification**: reject unsupported domains, requirements, implementation decisions, and premature tasks.
7. **User decisions**: isolate choices that materially affect scope or domain boundaries.

Confidence handling:

- Write `confirmed` behavior as a firm requirement.
- Write `inferred` behavior only when multiple sources converge; disclose it in the report.
- Keep `assumed` and `unknown` items out of firm requirements and place them in open points or assumptions.

## Workflow

### 1. Establish the baseline

Read the supplied sources and inspect the existing `openspec/` subtree. Determine the mode, complete the hard gates, and preserve user-authored content unless evidence shows it is stale or contradictory.

If the OpenSpec CLI is available, use its native setup, status, instruction, template, and validation commands where appropriate. Inspect command help or installed-version documentation before relying on flags. Do not replace a required native lifecycle action with an improvised equivalent. Never archive a change as part of alignment without explicit approval.

### 2. Audit existing OpenSpec artifacts

Check targeted paths for:

- `openspec/config.yaml`, `openspec/specs/`, and `openspec/changes/`.
- Existing domains, active changes, and archived history.
- Structural validity, contradictions, duplication, and apparent staleness.
- Current behavior incorrectly stored as a proposed change, or future behavior incorrectly stored as current truth.

An OpenSpec project may treat `config.yaml` as optional; this skill creates or updates it as the recommended brownfield baseline.

### 3. Extract and propose domains

Extract actors, user capabilities, business rules, main flows, integrations, business objects, cross-cutting constraints, and structurally important technical components.

Choose domain boundaries in this order:

1. Explicit business domains.
2. Bounded contexts.
3. Major user capabilities.
4. Application components.
5. Technical layers, only for primarily technical systems.
6. A single `core` domain when evidence is too limited.

Avoid one oversized spec when clear domains exist, many artificial micro-domains, and technical boundaries for a business-oriented system. If a boundary decision has high impact and weak evidence, record it as an open point; do not block the whole draft.

### 4. Produce the mandatory baseline

Create or update:

```text
openspec/
├── config.yaml
├── specs/
│   └── <domain>/
│       └── spec.md
├── changes/
├── alignment-report.md
└── open-points.md
```

Use `references/templates.md` for file structures and field requirements.

**Every current-state `openspec/specs/<domain>/spec.md` SHALL follow the Requirements + Scenarios template exactly:**

```markdown
# <Domain> Specification

## Purpose

<What this domain covers and, when useful, what it excludes.>

## Requirements

### Requirement: <Behavior name>

The system SHALL <observable current behavior>.

#### Scenario: <Concrete outcome>

- GIVEN <relevant initial state or actor context>
- WHEN <event or action>
- THEN <observable result>
- AND <additional result, if needed>
```

Mandatory format rules:

- Every requirement MUST contain at least one scenario.
- Every scenario MUST contain `- GIVEN`, `- WHEN`, and `- THEN` steps in that order; `- AND` steps are optional.
- Every normative requirement MUST use `SHALL` or `MUST` consistently.
- Do not use bullet lists, tables, prose paragraphs, or custom headings as substitutes for requirements and scenarios.
- Treat a spec that does not follow this template as incomplete and restructure it before finalizing.

Change delta specs use the native `ADDED`, `MODIFIED`, and `REMOVED` section structure instead. Every `ADDED` or `MODIFIED` requirement MUST still use `### Requirement:`, normative language, and at least one GIVEN/WHEN/THEN scenario. A `REMOVED` requirement may document the removal without a scenario.

Main specs describe only current behavior. Create an active change only when the user requests a distinct future evolution or when future behavior is clearly separate from the current baseline. Use delta specs under that change for proposed additions, modifications, or removals.

When updating files:

- Make the smallest coherent edit.
- Preserve reliable content and manual refinements.
- Do not overwrite conflicts silently; document their resolution or leave an open point.
- Keep `config.yaml` context concise and durable. Put per-artifact rules under valid artifact IDs for the selected schema.
- Keep implementation detail out of main specs.

### 5. Formulate behavioral specs

Each requirement must describe observable behavior, identify the relevant actor or context when useful, and contain at least one scenario. Use normative `SHALL` or `MUST` language consistently.

Do not place development tasks, pseudocode, speculative features, or unnecessary implementation detail in main specs. Put change-specific technical decisions in `design.md`; put durable project conventions in `config.yaml`.

### 6. Organize uncertainty

Produce a useful first version even when sources are incomplete. Record unresolved functional, technical, architecture, and product-scope questions in `open-points.md`, with context, impact, a safe suggested default when one exists, and status.

After producing the baseline, offer two paths:

- Persist the questions for later.
- Resolve them through an interview, one question at a time, explaining why each answer matters.

Do not force a long interview before creating the initial baseline unless a missing answer makes any artifact actively misleading.

### 7. Recommend optional artifacts

Recommend only artifacts justified by the evidence. Do not create them without explicit user approval:

- `domain-map.md`
- `legacy-mapping.md`
- `assumptions.md`
- `glossary.md`
- `architecture-context.md`
- `spec-coverage.md`
- `repository-scan-report.md` (only after authorized code analysis)
- `migration-plan.md`

### 8. Validate and report

Use the installed OpenSpec CLI validation commands when available and relevant. Also perform a manual review because structural validation cannot prove factual accuracy.

Summarize created and updated files, mode, evidence, code-access status, identified domains, assumptions, open points, optional recommendations, validation results, and next actions in `alignment-report.md` and the user-facing response.

## Validation checklist

Before finalizing, verify:

- [ ] The selected mode and source material are recorded.
- [ ] Code was not scanned without authorization.
- [ ] Current behavior is in main specs and proposed behavior is in changes.
- [ ] Every firm requirement is supported by `confirmed` or disclosed `inferred` evidence.
- [ ] Every current-state spec conforms exactly to the mandatory Requirements + Scenarios format defined in step 4.
- [ ] Every `ADDED` or `MODIFIED` delta requirement follows the delta-spec rules defined in step 4.
- [ ] `assumed` and `unknown` items remain visible as uncertainty.
- [ ] Domain boundaries are coherent and proportionate.
- [ ] Reliable existing content was preserved.
- [ ] `config.yaml` uses valid schema and artifact IDs.
- [ ] Required baseline files exist.
- [ ] Optional files were not created without approval.
- [ ] No application code or change archive was modified outside the request.
- [ ] CLI and manual validation results are reported.

## Gotchas

- OpenSpec evolves. Prefer the installed CLI's help and templates over remembered command flags or obsolete formats.
- `config.yaml` is optional in native OpenSpec but required by this skill's recommended brownfield baseline; state this distinction accurately.
- Do not mistake active change deltas for the current source of truth.
- Do not hide low-confidence claims behind confident normative language.
- Do not use an empty `core` spec to imply that undocumented behavior is understood.
- Do not create an active change merely to document behavior that already exists.
- **Template adherence is mandatory.** A spec that describes behavior through prose, tables, or nested lists without GIVEN/WHEN/THEN scenarios violates the format. If headings such as `Confirmed behavior` or labels such as `Rule:` appear instead of `### Requirement:` and `#### Scenario:`, stop and restructure the spec.
