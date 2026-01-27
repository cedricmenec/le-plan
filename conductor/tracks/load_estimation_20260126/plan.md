# Plan: Load Estimation Evolution

## Phase 1: Database Schema & Types [checkpoint: 8304ee4]
- [x] Task: Create Supabase migration for `missions` and `subtasks` updates d5c5c7f
    - [x] Add `rom_size` and `load_source` to `missions`
    - [x] Add `estimation` and `status` to `subtasks`
    - [x] Migrate `is_completed` data to `status`
- [x] Task: Regenerate database types 6e43229
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database Schema & Types' (Protocol in workflow.md) 8304ee4

## Phase 2: Core Logic & Utilities (TDD) [checkpoint: 6115bea]
- [x] Task: Implement load calculation utility `lib/load-utils.ts` c9b8e75
    - [x] Write tests for ROM size to days mapping
    - [x] Write tests for Task Sum calculation (excluding 'done' status)
    - [x] Implement calculation functions
- [x] Task: Update Mission Server Actions `app/missions/actions.ts` 0655ddf
    - [x] Write tests for updating `rom_size` and `load_source`
    - [x] Implement updates in `updateMission`
- [x] Task: Update Subtask Server Actions `app/missions/actions.ts` 0655ddf
    - [x] Write tests for subtask creation/update/deletion with `estimation` and `status`
    - [x] Implement `createTask`, `updateTask`, `deleteTask` as server actions
    - [x] Implement `estimation` and `status` handling in these actions
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core Logic & Utilities' (Protocol in workflow.md) 6115bea

## Phase 3: Subtask UI Enhancements [checkpoint: eb28fe2]
- [x] Task: Update `TaskItem` / `SubtaskForm` components 051d99d
    - [x] Add estimation input field (restricted to 0.5 increments)
    - [x] Replace checkbox with status dropdown (Todo, In Progress, Done)
- [x] Task: Verify subtask drag & drop still works with new fields 051d99d
- [x] Task: Conductor - User Manual Verification 'Phase 3: Subtask UI Enhancements' (Protocol in workflow.md) eb28fe2

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
