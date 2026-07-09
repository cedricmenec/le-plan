## Context

`Queued` already exists in the mission state machine, but list views merge it with `Backlog`; similarly, `Suspended` is merged with `Active`. Missions are currently sorted by estimated delivery date and creation date, so no persisted execution order exists. The application is a single-user, local-first React application backed by Dexie, which permits queue mutations to be handled transactionally without distributed-concurrency concerns.

The change crosses the mission data model, lifecycle actions, import/export, project and global list views, project summaries, and mission detail. Existing `Queued` records need a deterministic initial position.

## Goals / Non-Goals

**Goals:**

- Make `Active`, `Suspended`, `Queued`, and `Backlog` visually and semantically distinct.
- Persist a user-controlled order for `Queued` missions within each project.
- Preserve queue invariants across every lifecycle and project-assignment mutation.
- Provide consistent queue context in project, global, and mission-detail views.
- Migrate existing local data deterministically without data loss.

**Non-Goals:**

- A single total queue spanning all projects.
- Automatic promotion from `Queued` to `Active`.
- Capacity-based scheduling or automatic queue optimization.
- Changing the allowed mission-state transitions or priority semantics.
- Collaboration, synchronization, or conflict resolution between users.

## Decisions

### Store a nullable queue position on each mission

Add `queue_position: number | null` to the mission record. Only `Queued` missions carry a non-null, zero-based integer position. Positions are contiguous within a queue scope.

The queue scope is the mission's `project_id`. Missions without a project use a dedicated standalone scope so existing standalone missions can still use `Queued` without creating a global interproject queue.

This denormalized field fits Dexie's local entity model and makes ordered reads, export, and inspection straightforward. A separate queue-entry table was rejected because it would add lifecycle synchronization and cascading-delete complexity without providing value for a single ordered membership per mission.

### Centralize queue mutations in transactional database helpers

Database helpers will own append, remove, move, compact, and reorder operations. State transitions and project reassignment will invoke these helpers in one Dexie transaction covering `missions` and `statusHistory` where applicable.

- Entering `Queued` appends the mission after the current maximum position in the destination scope.
- Leaving `Queued` clears its position and compacts the previous scope.
- Moving a queued mission to another project removes it from the old scope and appends it to the destination scope.
- Reopening a terminated mission uses the normal transition path and appends it.
- Deleting a queued mission compacts its former scope.
- Reordering accepts the complete ordered set of queued mission IDs for one scope and rewrites contiguous positions atomically.

Keeping these invariants below the UI avoids inconsistent behavior among edit forms, quick state actions, reopen actions, imports, and future callers. Component-local index updates were rejected because they would not protect persisted data.

### Keep queue order independent from mission priority and delivery dates

Queue position represents the user's intended execution sequence. Priority expresses importance, while delivery dates express scheduling constraints. Neither silently reorders the queue. Both remain visible as decision inputs.

This avoids surprising movement after editing metadata. Automatic sorting by priority or date was rejected because it would make manual ordering unstable and conflate separate planning concepts.

### Migrate existing queued missions using the current visible sort

The Dexie schema version will increase. During migration, existing `Queued` missions will be grouped by project scope and assigned contiguous positions using the current ordering: estimated delivery date ascending, dated missions first, then creation date descending. Non-queued missions receive `null`.

This preserves the closest available approximation of the order users saw before explicit ordering existed. Import normalization will apply the same invariant when older exports omit `queue_position` or imported positions are invalid or duplicated.

### Present four lifecycle groups with state-specific hierarchy

Project detail and the global mission view will render:

1. `Active` as prominent solid cards;
2. `Suspended` as a compact attention area, retaining `Blocked` versus `Deprioritized` treatment;
3. `Queued` as ordered pending cards with a visible rank, muted surface, and dashed border;
4. `Backlog` as a compact secondary list.

Queued cards retain the mission information needed for arbitration, expose a drag handle, and provide a clear way to open the mission detail. Drag and drop is restricted to a single queue scope. The global view groups queue sections by project and standalone scope; it does not permit cross-project ordering.

Project cards report active, queued, and backlog counts separately instead of combining queued and backlog as "upcoming".

### Show lifecycle and queue context on mission detail

Mission detail will add a compact lifecycle indicator that highlights the current macro-state and represents `Suspended` as a branch from active work. For queued missions, it also shows the one-based queue rank and project scope. A project-context summary links to the project queue without embedding a second reorder surface in mission detail.

The existing state action remains the mechanism for changing lifecycle state. The indicator is explanatory, preventing two competing transition controls.

### Open queued missions for decision-making

Queued missions are pending commitments, not read-only queue entries. A queued row or card should let the user open the mission detail without interfering with drag handles, keyboard reorder controls, or action buttons.

The mission detail remains the primary surface for lifecycle decisions. From there, the existing state action exposes the valid `Queued` transitions: move back to `Backlog` when the mission is deprioritized or no longer committed at short term, or move to `Active` when planning allows the work to start. Keeping state changes on the detail view avoids adding competing lifecycle controls to the queue reorder surface while still supporting the natural "inspect, then decide" workflow.

### Require explicit starts

Completing, suspending, deleting, or moving an active mission does not change another mission's state. Queue rank 1 means "intended next," not "automatically active." This maintains deliberate workload control and matches the existing explicit state machine.

## Risks / Trade-offs

- **[Risk] Queue positions become sparse, duplicated, or stale after a mutation.** → Route all mutations through transactional helpers, normalize imported data, and test every entry/exit/reassignment path.
- **[Risk] Drag-and-drop interaction is inaccessible or unclear.** → Provide a visible handle, keyboard-operable reorder controls, rank labels, and an optimistic update that rolls back on persistence failure.
- **[Risk] Opening a queued mission conflicts with drag-and-drop gestures.** → Scope drag listeners to the explicit handle and make the title or a dedicated detail affordance responsible for navigation.
- **[Risk] A project with many backlog missions creates excessive visual length.** → Keep backlog compact and allow its section to be collapsed without hiding active or queued work.
- **[Risk] Grouped global queues are mistaken for a global total order.** → Label every queue with its project and disallow cross-project dragging.
- **[Trade-off] Rewriting all positions on reorder is O(n).** → Acceptable for personal project queues; transactional simplicity is preferred over fractional ranking complexity.
- **[Trade-off] Standalone missions form a dedicated queue scope.** → Preserves existing standalone lifecycle behavior but is explicitly not a cross-project global queue.

## Migration Plan

1. Add the nullable field and Dexie schema version upgrade.
2. Backfill existing queued missions per scope using the current visible sort; set all other positions to `null`.
3. Add transactional queue helpers and route lifecycle, reassignment, reopen, deletion, import, and export through them.
4. Update selectors and UI sections, then enable reordering.
5. Update lifecycle documentation and automated tests.

Rollback consists of deploying the previous application version. Older code ignores the additional mission property, but queue order would no longer be visible or maintained. Export compatibility therefore requires the new importer to tolerate missing positions and the old importer to tolerate additional properties.

## Open Questions

- A global cross-project queue remains intentionally open in `openspec/open-points.md`; this design must not choose a future synchronization model between local and global order.

