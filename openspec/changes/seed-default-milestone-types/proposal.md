## Why

Mission milestone creation currently depends on milestone types stored in IndexedDB, but a fresh or migrated local database can contain no milestone types. When that happens, the milestone type selector has no options and the user cannot create a new milestone from mission detail.

## What Changes

- Ensure default milestone types exist during application startup before users attempt milestone creation.
- Keep the milestone type lookup read-only from the form's perspective; forms continue to read available types rather than seed data themselves.
- Add focused Vitest coverage proving default milestone types are populated for an empty local database and that repeated initialization does not duplicate them.
- Preserve existing milestone records, existing custom/imported milestone types, and the current mission detail workflow.

## Capabilities

### New Capabilities

- `mission-milestones`: Defines mission milestone creation prerequisites, including availability of default milestone types in local IndexedDB.

### Modified Capabilities

- None.

## Impact

- Affects the IndexedDB reference-data initialization path, likely `src/lib/db.ts` and application startup in `src/main.tsx` or the nearest existing bootstrap surface.
- Affects milestone creation UX indirectly by ensuring `MilestoneForm` receives selectable types.
- Adds focused Vitest coverage around reference-data initialization.
- No data model migration, authentication, network service, or change to milestone form fields is introduced.
