# Implementation Plan - Mission Status History & Audit Trail

This plan covers the implementation of a tracking system for mission status changes, including database schema updates, backend logic for automated logging, and UI enhancements for visualization.

## Phase 1: Database & Schema [checkpoint: ea12c9d]
- [x] Task: Update Prisma schema to include `MissionStatusHistory` table e9dd87a
    - [x] Define model with `id`, `missionId`, `status`, `reason`, and `createdAt`
    - [x] Set up relationship with `Mission` model
- [x] Task: Create and apply database migration 87c444e
    - [x] Run `npx prisma migrate dev`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database & Schema' (Protocol in workflow.md) ea12c9d

## Phase 2: Backend Logic & Data Capture [checkpoint: a588d43]
- [x] Task: Implement automated logging in status transition actions 1ad6fd5
    - [x] Update mission status update actions to create a `MissionStatusHistory` record
    - [x] Ensure the transition reason is captured when available
- [x] Task: Implement duration calculation utilities 1112320
    - [x] Create utility functions in `lib/missions/` to calculate total lead time
    - [x] Create utility functions to calculate segmented durations (Active, Paused, Blocked)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Backend Logic & Data Capture' (Protocol in workflow.md) a588d43

## Phase 3: UI Implementation - Indicators & List
- [ ] Task: Update Mission Card to display current duration
    - [ ] Add duration indicator for missions in "In Progress" or "Next Up"
- [ ] Task: Update Recently Completed list to show total lead time
    - [ ] Fetch and display duration from the status history
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Implementation - Indicators & List' (Protocol in workflow.md)

## Phase 4: UI Implementation - Detail & Visualization
- [ ] Task: Create `StatusTimeline` component
    - [ ] Implement the horizontal multi-colored bar (Active/Black, Paused/Grey, Blocked/Red)
- [ ] Task: Add History/Activity section to Mission Detail page
    - [ ] Display a chronological list of status changes with reasons
- [ ] Task: Integrate history and metrics into Mission Archive view
- [ ] Task: Conductor - User Manual Verification 'Phase 4: UI Implementation - Detail & Visualization' (Protocol in workflow.md)
