# Implementation Plan: Mission Milestones (Jalons)

This plan covers the addition of milestones to missions, including database schema changes, backend actions, and UI components on the mission detail page.

## Phase 1: Database Schema & Seed
**Goal:** Set up the relational structure for milestones and types.

- [x] Task: Create migration for `milestone_types` table and `milestones` table. (7225783)
    - [x] Create `milestone_types` (id, name, description).
    - [x] Create `milestones` (id, mission_id, type_id, date, title, note, created_at).
    - [x] Add foreign key constraints and indexes on `mission_id` and `date`.
- [x] Task: Seed initial milestone types (Cadrage / Kick-off, Réunion / Review, Livraison intermédiaire, Documentation).
- [x] Task: Update database types (Run `supabase gen types`). (e342337)
- [~] Task: Conductor - User Manual Verification 'Phase 1: Database Schema & Seed' (Protocol in workflow.md)

## Phase 2: Backend Actions & API
**Goal:** Implement CRUD operations for milestones.

- [x] Task: Create Server Actions for Milestones in `app/missions/actions.ts`. (23b487c)
    - [x] `createMilestone(data)`
    - [x] `updateMilestone(id, data)`
    - [x] `deleteMilestone(id)`
    - [x] `getMilestonesByMissionId(missionId)`
- [x] Task: Write unit tests for milestone actions. (23b487c)
- [~] Task: Conductor - User Manual Verification 'Phase 2: Backend Actions & API' (Protocol in workflow.md)

## Phase 3: UI Components (List & Item)
**Goal:** Create the components to display milestones.

- [x] Task: Create `MissionMilestoneItem` component. (afb0cb0)
    - [x] Implement conditional styling for "Past" vs "Active" milestones.
    - [x] Display type (icon/label), date, title, and optional note.
- [x] Task: Create `MissionMilestoneList` component. (afb0cb0)
    - [x] Implement "Default View" (Upcoming only).
    - [x] Implement "View All" inline expansion logic.
- [x] Task: Write unit tests for `MissionMilestoneList` and `MissionMilestoneItem`. (afb0cb0)
- [~] Task: Conductor - User Manual Verification 'Phase 3: UI Components (List & Item)' (Protocol in workflow.md)

## Phase 4: Creation & Edition Dialog
**Goal:** Allow users to manage milestones from the UI.

- [x] Task: Create `MilestoneForm` component (using standard state for consistency). (5f552f0)
- [x] Task: Create `AddMilestoneDialog` and `EditMilestoneDialog` components. (5f552f0)
- [x] Task: Integrate components into the Mission Detail page (`app/missions/[id]/page.tsx`). (5f552f0)
- [x] Task: Write unit tests for the milestone form and dialogs. (5f552f0)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Creation & Edition Dialog' (Protocol in workflow.md) (Checkpoint below)
