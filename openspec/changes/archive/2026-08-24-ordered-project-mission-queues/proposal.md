## Why

The application stores `Queued` as a distinct mission state but currently merges it with `Backlog` in the interface, so users cannot distinguish near-term commitments from unprioritized work. Project-level ordered queues are needed to make the intended execution sequence visible and adjustable while preserving an explicit human decision before work starts.

## What Changes

- Separate project missions into distinct operational groups: `Active`, `Suspended`, ordered `Queued`, and `Backlog`.
- Introduce an explicit, persistent queue position for each `Queued` mission within its project.
- Allow users to reorder queued missions manually by drag and drop.
- Allow users to open queued missions from the queue in order to inspect their full detail before deciding whether to start or deprioritize them.
- Append missions to the end of their project queue when they enter `Queued`, including reopened missions.
- Remove queue position when a mission leaves `Queued`, without automatically promoting or starting another mission.
- Give queued missions a visually distinct pending treatment while keeping backlog missions in a compact secondary list.
- Show the mission lifecycle position clearly from mission detail and expose its project queue context.
- Keep a cross-project global queue out of scope; it remains an open product evolution.

## Capabilities

### New Capabilities

- `project-mission-queue`: Defines project-scoped queue ownership, persistent ordering, reordering, lifecycle integration, and queue presentation.

### Modified Capabilities

- `missions`: Clarifies state-specific presentation, queue entry and exit behavior, reopening placement, and lifecycle context on mission detail.
- `projects`: Adds a project workload view that distinguishes active, suspended, queued, and backlog missions.

## Impact

- Mission data stored in Dexie gains a nullable project-queue ordering field and requires a local database migration.
- Mission create, update, reopen, delete, project reassignment, import, and export flows must preserve queue invariants.
- Project detail, global mission list, project cards, mission detail, mission state actions, queued mission list, and condensed mission list components are affected.
- Queue reordering requires transactional persistence and focused Vitest coverage.
- No authentication, network service, collaboration feature, automatic state promotion, or global cross-project queue is introduced.
