## Context

Mission milestone creation uses `MilestoneForm`, which reads available types through `getMilestoneTypes()`. The form disables submission when no types are returned, so a fresh or migrated IndexedDB database with an empty `milestoneTypes` table prevents users from creating milestones.

The persistence layer already has `seedDefaultMilestoneTypes()`, and tests already rely on it, but the application startup path does not call it. The application is local-first, single-user, and backed by Dexie, so local reference-data initialization can be handled entirely in the client before React renders.

## Goals / Non-Goals

**Goals:**

- Ensure default milestone types are available in a fresh local database.
- Keep the initialization idempotent so startup can run it safely every time.
- Keep milestone forms as read-only consumers of milestone type data.
- Add focused Vitest coverage for empty and repeated initialization.

**Non-Goals:**

- Redesigning milestone creation, editing, or deletion workflows.
- Adding custom milestone type management.
- Changing milestone type names or data model structure.
- Rewriting import/export behavior for milestone types.

## Decisions

### Initialize reference data during app bootstrap

Add a small reference-data initialization function in the persistence layer, for example `initializeReferenceData()`, and call it before rendering the app from the startup path.

This keeps seeding as an application lifecycle concern rather than a form concern. It also means any future UI that depends on reference data benefits from the same bootstrap. Using `getMilestoneTypes()` to seed data was rejected because a getter that writes to IndexedDB would make read paths harder to reason about and test.

### Reuse the existing idempotent milestone-type seed

`seedDefaultMilestoneTypes()` already checks whether milestone types exist before inserting defaults. The new bootstrap function should delegate to it rather than duplicate the default list or insert logic.

This preserves one source of truth for default milestone types and keeps the implementation narrow.

### Test the persistence behavior, not Radix select internals

The primary regression is missing reference data. Focused database tests should prove that initialization populates default types for an empty database and does not duplicate them when called repeatedly.

Component-level tests for the select are not necessary for the fix unless implementation reveals the form is still unable to render options after types exist.

## Risks / Trade-offs

- **[Risk] Startup briefly waits for IndexedDB initialization.** → Keep initialization narrow and local; the operation is a small count plus optional inserts.
- **[Risk] Existing custom/imported milestone types suppress default insertion.** → Preserve this behavior for now because the current seed function treats any existing type set as intentional data. A future change can define merge semantics if users need missing defaults added alongside custom types.
- **[Risk] Initialization failure blocks the app render if awaited directly.** → Surface the failure in console and prefer a startup path that avoids silently rendering a broken milestone form when reference data cannot be prepared.

## Migration Plan

1. Add a reference-data initialization function that calls the existing default milestone type seed.
2. Call the initialization from app startup before rendering React.
3. Add focused tests for empty and repeated initialization.
4. Run the relevant DB tests and the full test suite.

Rollback consists of removing the startup call and helper. Existing milestone types inserted by the new version can remain in IndexedDB without breaking older code.

## Open Questions

- Whether future custom milestone type management should merge missing defaults into a non-empty type table remains part of the broader open milestone workflow question.
