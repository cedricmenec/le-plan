# Specification: Track updated_at_20260217

## Overview
This track adds an `updated_at` timestamp field to the core entities of the application (`Project`, `Mission`, and `Subtask`) to track the last modification time of each record. This is a technical improvement to support future features like sorting by recent activity or data synchronization.

## Functional Requirements
- Add an `updated_at` field of type `DateTime` to the following tables:
    - `Project`
    - `Mission`
    - `Subtask`
- The `updated_at` field must be automatically updated by Prisma whenever a record is modified.
- Existing records in the database must have their `updated_at` field initialized to the current timestamp during the migration.

## Non-Functional Requirements
- **Consistency:** Use the standard Prisma `@updatedAt` attribute across all specified models.
- **Performance:** Database migrations should be executed efficiently without data loss.

## Acceptance Criteria
- [ ] Prisma schema updated with `updated_at` fields using `@updatedAt`.
- [ ] Database migration generated and applied successfully.
- [ ] Creating a new Project/Mission/Subtask populates `updated_at`.
- [ ] Updating any field of a Project/Mission/Subtask automatically updates its `updated_at` timestamp.
- [ ] Automated tests verify the automatic update behavior.

## Out of Scope
- Adding `updated_at` to other tables (e.g., `Milestone`).
- Any UI changes to display the "Last updated" time.
- Manual logic in application code to update the timestamp.
