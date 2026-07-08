## 1. Queue Data Model and Migration

- [x] 1.1 Add nullable `queue_position` to mission types, Dexie schema, import/export payloads, and mission fixtures.
- [x] 1.2 Add a Dexie version migration that groups existing queued missions by project or standalone scope and backfills deterministic contiguous positions using the previous visible sort.
- [ ] 1.3 Add migration tests proving queued data is ordered deterministically, non-queued positions are cleared, and mission states and content are preserved.

## 2. Queue Domain Operations

- [x] 2.1 Implement queue-scope and normalization utilities for project and standalone missions.
- [x] 2.2 Implement transactional append, removal, compaction, and complete-scope reorder helpers with validation against missing, duplicate, or foreign-scope mission IDs.
- [x] 2.3 Route mission creation and state transitions through queue helpers so entering `Queued` appends and leaving it clears and compacts positions.
- [x] 2.4 Route project reassignment, reopening, and deletion through queue helpers so old and destination scopes remain contiguous.
- [x] 2.5 Normalize legacy or invalid queue positions during import while preserving explicit valid queue order.
- [ ] 2.6 Add domain and database tests for entry, exit, metadata stability, reassignment, reopen, delete, reorder, standalone scope, import normalization, and absence of automatic activation.

## 3. Queue Application Interface

- [x] 3.1 Expose ordered queue reads and an application action that persists one complete reordered queue scope atomically.
- [x] 3.2 Add action-level validation and tests preventing cross-project reorder requests and preserving the previous order after a rejected request.

## 4. Lifecycle-grouped Mission Views

- [x] 4.1 Refactor mission-list selectors to produce separate `Active`, `Suspended`, `Queued`, and `Backlog` collections, using persisted position only for queued missions.
- [x] 4.2 Render active missions as prominent cards and suspended missions in a separate attention area showing `Blocked` or `Deprioritized` reasons.
- [x] 4.3 Build ranked queued-mission cards with muted styling, dashed borders, project context, and visible drag handles.
- [x] 4.4 Render backlog missions as a compact secondary section that can be collapsed without hiding active or queued work.
- [x] 4.5 Group queues by project and standalone scope in the global mission view without implying or enabling a cross-project order.
- [ ] 4.6 Add component tests confirming state separation, visual labels, rank display, empty-category behavior, and project grouping.

## 5. Accessible Queue Reordering

- [x] 5.1 Add same-scope drag-and-drop reordering with an optimistic local update and persistence through the reorder action.
- [x] 5.2 Add keyboard-operable move controls and accessible rank feedback for queued missions.
- [x] 5.3 Restore the last persisted order and display an error notification when reorder persistence fails.
- [ ] 5.4 Add interaction tests for pointer reorder, keyboard reorder, cross-project prevention, successful persistence, and rollback on failure.

## 6. Project and Mission Context

- [x] 6.1 Update project cards to report active, queued, and backlog counts separately and remove the combined upcoming count.
- [x] 6.2 Add a read-only lifecycle indicator to mission detail that highlights the current state and represents suspension as a branch from active work.
- [x] 6.3 Show queue rank and scope for queued mission details, with navigation to the owning project queue when applicable.
- [ ] 6.4 Add project-card and mission-detail tests for separate counts, lifecycle states, suspended reasons, queued rank, and project navigation.

## 7. Documentation and Verification

- [x] 7.1 Update `docs/cycle-de-vie-mission.md` to document explicit queue ordering, standalone scope, entry and exit rules, manual starts, and the distinction between priority and queue position.
- [x] 7.2 Run focused queue, lifecycle, project, mission-detail, import/export, and migration tests and resolve regressions.
- [ ] 7.3 Run the full test suite, production build, OpenSpec validation, and a final manual check of project and global queue behavior.
