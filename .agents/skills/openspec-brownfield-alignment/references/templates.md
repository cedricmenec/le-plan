# OpenSpec Brownfield Alignment Templates

Use these templates as starting points. Remove empty or irrelevant sections and preserve compatible project-specific conventions.

## `openspec/config.yaml`

```yaml
schema: spec-driven

context: |
  Project purpose: <concise purpose>
  Primary actors: <known users or systems>
  Business domain: <known domain>
  Technical stack: <known stack or "Not established">
  Architecture: <known high-level architecture or "Not established">
  Compatibility constraints: <known constraints or "None documented">
  Security constraints: <known constraints or "Not established">
  Code and test conventions: <durable known conventions>
  Deployment constraints: <known constraints or "Not established">
  Known boundaries: <explicit non-goals or limits>

rules:
  proposal:
    - Separate current behavior from the proposed change.
    - State scope, non-goals, risks, and unresolved decisions.
  specs:
    - Describe observable behavior with normative requirements and scenarios.
    - Do not promote assumptions to requirements.
  design:
    - Link technical decisions to requirements and documented constraints.
  tasks:
    - Make tasks independently verifiable and traceable to requirements.
```

Only use artifact IDs supported by the selected schema. For the standard `spec-driven` schema, the usual IDs are `proposal`, `specs`, `design`, and `tasks`.

## `openspec/specs/<domain>/spec.md`

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

Every requirement needs at least one scenario. Prefer a small number of meaningful scenarios over exhaustive permutations unsupported by the evidence.

### Complete example

This example is illustrative. Replace its domain and behavior with evidence from the project being aligned.

```markdown
# Notification Preferences Specification

## Purpose

Define how users view and update their notification preferences and how the system applies those preferences.

## Requirements

### Requirement: View Notification Preferences

The system SHALL allow an authenticated user to view their current notification preferences.

#### Scenario: User opens notification settings

- GIVEN an authenticated user with stored notification preferences
- WHEN the user opens notification settings
- THEN the system displays the user's current preferences

### Requirement: Update Notification Preferences

The system SHALL persist valid notification preference changes submitted by an authenticated user.

#### Scenario: User saves valid preferences

- GIVEN an authenticated user viewing notification settings
- WHEN the user submits valid preference changes
- THEN the system stores the updated preferences
- AND the system displays the updated preferences to the user

#### Scenario: User submits invalid preferences

- GIVEN an authenticated user viewing notification settings
- WHEN the user submits an unsupported preference value
- THEN the system rejects the update
- AND the system preserves the previously stored preferences

### Requirement: Apply Notification Preferences

The system SHALL honor a user's stored notification preferences when deciding whether to send an optional notification.

#### Scenario: Optional notification is disabled

- GIVEN a user has disabled an optional notification category
- WHEN an event in that category occurs
- THEN the system does not send the optional notification to that user
```

## `openspec/alignment-report.md`

```markdown
# OpenSpec Alignment Report

## Summary

- Mode: `<bootstrap|realign|migration|enrichment>`
- Code access: `<not_available|available_not_authorized|authorized|partial_context_only>`
- Alignment date: `<YYYY-MM-DD>`

## Sources Analyzed

| Source | Scope used | Confidence contribution |
| --- | --- | --- |
| `<source>` | `<relevant content>` | `<high|medium|low>` |

## Artifacts

### Created

- `<path>`

### Updated

- `<path>`

### Preserved

- `<path and reason>`

## Domains

| Domain | Rationale | Confidence |
| --- | --- | --- |
| `<domain>` | `<why this boundary is useful>` | `<high|medium|low>` |

## Evidence and Uncertainty

### Confirmed

- `<fact and source>`

### Inferred

- `<inference, converging evidence, and impact>`

### Assumed or Unknown

- See `open-points.md`.

## Conflicts and Resolutions

- `<conflict, decision or open status, and affected artifacts>`

## Optional Artifacts Recommended

- `<artifact>: <reason>`

## Validation

- CLI: `<command and result, or not available>`
- Manual: `<checks and result>`

## Next Actions

1. `<highest-value action>`
```

Do not claim that a source was analyzed when it was merely detected.

## `openspec/open-points.md`

```markdown
# Open Points

## Functional Questions

- [ ] <question>
  - Context: <why it arose>
  - Impact: <what depends on the answer>
  - Suggested default: <safe default or "None">
  - Evidence status: `<assumed|unknown>`
  - Status: `open`

## Technical Questions

- [ ] <question>
  - Context: <why it arose>
  - Impact: <what depends on the answer>
  - Suggested default: <safe default or "None">
  - Evidence status: `<assumed|unknown>`
  - Status: `open`

## Architecture Questions

- [ ] <question>
  - Context: <why it arose>
  - Impact: <what depends on the answer>
  - Suggested default: <safe default or "None">
  - Evidence status: `<assumed|unknown>`
  - Status: `open`

## Product Scope Questions

- [ ] <question>
  - Context: <why it arose>
  - Impact: <what depends on the answer>
  - Suggested default: <safe default or "None">
  - Evidence status: `<assumed|unknown>`
  - Status: `open`
```

Omit empty categories or write `No open points identified from the available evidence.` Do not invent questions merely to populate the file.

## Active change delta (only when justified)

```text
openspec/changes/<change-name>/
├── proposal.md
├── design.md
├── tasks.md
└── specs/
    └── <domain>/
        └── spec.md
```

Use delta sections in the change spec:

```markdown
# Delta for <Domain>

## ADDED Requirements

### Requirement: <New behavior>

The system SHALL <new observable behavior>.

#### Scenario: <Scenario name>

- GIVEN <context>
- WHEN <event>
- THEN <result>

## MODIFIED Requirements

### Requirement: <Existing requirement name>

<Complete updated requirement and scenarios, not a partial patch.>

## REMOVED Requirements

### Requirement: <Removed requirement name>

<Reason for removal and relevant migration or compatibility impact.>
```

Include only applicable delta sections. Proposed behavior belongs here; already implemented and evidenced behavior belongs in the main spec.
