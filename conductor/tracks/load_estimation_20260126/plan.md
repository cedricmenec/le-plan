# Plan: Load Estimation Evolution

## Phase 1: Database Schema & Types [checkpoint: 8304ee4]
- [x] Task: Create Supabase migration for `missions` and `subtasks` updates d5c5c7f
    - [x] Add `rom_size` and `load_source` to `missions`
    - [x] Add `estimation` and `status` to `subtasks`
    - [x] Migrate `is_completed` data to `status`
- [x] Task: Regenerate database types 6e43229
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database Schema & Types' (Protocol in workflow.md) 8304ee4

## Phase 2: Core Logic & Utilities (TDD)
- [ ] Task: Implement load calculation utility `lib/load-utils.ts`
    - [ ] Write tests for ROM size to days mapping
    - [ ] Write tests for Task Sum calculation (excluding 'done' status)
    - [ ] Implement calculation functions
- [ ] Task: Update Mission Server Actions `app/missions/actions.ts`
    - [ ] Write tests for updating `rom_size` and `load_source`
    - [ ] Implement updates in `updateMission`
- [ ] Task: Update Subtask Server Actions `app/missions/milestone-actions.ts` (or relevant subtask file)
    - [ ] Write tests for subtask creation/update with `estimation` and `status`
    - [ ] Implement `estimation` and `status` handling
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Logic & Utilities' (Protocol in workflow.md)

## Phase 3: Subtask UI Enhancements
- [ ] Task: Update `TaskItem` / `SubtaskForm` components
    - [ ] Add estimation input field (restricted to 0.5 increments)
    - [ ] Replace checkbox with status dropdown (Todo, In Progress, Done)
- [ ] Task: Verify subtask drag & drop still works with new fields
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Subtask UI Enhancements' (Protocol in workflow.md)

## Phase 4: Mission Detail UI (Estimation Controls)
- [ ] Task: Implement Estimation Settings Section in Mission Detail
    - [ ] Add ROM Size selector (XS to XXL)
    - [ ] Add Load Source toggle (ROM vs Tasks)
    - [ ] Display both "Current ROM" and "Current Task Sum" for comparison
- [ ] Task: Implement "Smart Suggestion" alert
    - [ ] Display suggestion to switch to 'Tasks' if tasks are estimated but source is 'ROM'
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Mission Detail UI' (Protocol in workflow.md)

## Phase 5: Dashboard & Project List Updates
- [ ] Task: Update `MissionCard` and `ProjectMissionList`
    - [ ] Replace static estimation display with "Official" source value
    - [ ] Add icon indicator (T-shirt icon for ROM, List icon for Task Sum)
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Dashboard & Project List Updates' (Protocol in workflow.md)
