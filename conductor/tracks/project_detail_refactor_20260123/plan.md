# Implementation Plan - Project Detail Refactor & Sidebar Navigation Fix

This plan covers the reuse of the `MissionCard` component in the Project Detail page and fixing the sidebar navigation highlighting bug.

## Phase 1: Sidebar Navigation Fix [checkpoint: 6a03297]

### Task: Fix Sidebar Active State Logic
- [x] Task: Write Tests for Sidebar Active State logic d091844
    - [x] Create `components/layout/sidebar.test.tsx` (if not exists) or update it to test active path highlighting for `/projects` and `/projects/[id]`.
- [x] Task: Implement Sidebar Active State Fix d091844
    - [x] Update `components/layout/sidebar.tsx` to use a robust path matching logic (e.g., checking if `pathname.startsWith(href)`).
- [x] Task: Verify Sidebar Tests Pass d091844
- [x] Task: Conductor - User Manual Verification 'Sidebar Navigation Fix' (Protocol in workflow.md)

## Phase 2: MissionCard Integration [checkpoint: a24117a]

### Task: Refactor Project Detail Mission List
- [x] Task: Write Tests for Project Detail Mission List 2b32f35
    - [x] Update `app/projects/[id]/page.test.tsx` to verify that `MissionCard` components are rendered.
- [x] Task: Implement MissionCard in Project Detail 2b32f35
    - [x] Modify `app/projects/[id]/page.tsx` (and potentially `components/projects/project-mission-list.tsx`) to use the standard `MissionCard`.
- [x] Task: Verify Project Detail Tests Pass 2b32f35
- [x] Task: Conductor - User Manual Verification 'MissionCard Integration' (Protocol in workflow.md)

## Phase 3: Final Verification & Cleanup

### Task: Global Verification
- [ ] Task: Run all project tests to ensure no regressions
- [ ] Task: Final Linting and Type Checking
- [ ] Task: Conductor - User Manual Verification 'Global Integration' (Protocol in workflow.md)
