# Implementation Plan - Mission Status History & Audit Trail

This plan covers the implementation of a tracking system for mission status changes, including database schema updates, backend logic for automated logging, and UI enhancements for visualization.

## Phase 1: Database & Schema
- [x] Task: Update Prisma schema to include `MissionStatusHistory` table e9dd87a
    - [ ] Define model with `id`, `missionId`, `status`, `reason`, and `createdAt`
    - [ ] Set up relationship with `Mission` model
- [x] Task: Create and apply database migration 87c444e
    - [ ] Run `npx prisma migrate dev`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Database & Schema' (Protocol in workflow.md)

## Phase 2: Backend Logic & Data Capture
- [ ] Task: Implement automated logging in status transition actions
    - [ ] Update mission status update actions to create a `MissionStatusHistory` record
    - [ ] Ensure the transition reason is captured when available
- [ ] Task: Implement duration calculation utilities
    - [ ] Create utility functions in `lib/missions/` to calculate total lead time
    - [ ] Create utility functions to calculate segmented durations (Active, Paused, Blocked)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Backend Logic & Data Capture' (Protocol in workflow.md)

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
