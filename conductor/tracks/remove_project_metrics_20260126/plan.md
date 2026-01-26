# Plan: Remove Project Dashboard Metrics

This plan outlines the steps to remove the `ProjectDashboard` component from the Project detail page and clean up the codebase.

## Phase 1: Preparation and Verification [checkpoint: fd74560]
- [x] Task: Verify current state and tests (05582ee)
    - [ ] Run existing tests to ensure a stable baseline: `npm test components/projects/project-mission-list.test.tsx`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Preparation and Verification' (Protocol in workflow.md)

## Phase 2: Implementation (Removal) [checkpoint: 01fbc25]
- [x] Task: Remove ProjectDashboard from ProjectMissionList (9e22648)
    - [ ] Modify `components/projects/project-mission-list.tsx` to remove the import and usage of `ProjectDashboard`.
- [x] Task: Implement to Pass Tests (77f1f8f) (Green Phase)
    - [ ] Run `npm test components/projects/project-mission-list.test.tsx` and ensure it passes (it might need updates if it was asserting on the dashboard's presence).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Implementation (Removal)' (Protocol in workflow.md)

## Phase 3: Cleanup
- [ ] Task: Delete ProjectDashboard files
    - [ ] Delete `components/projects/project-dashboard.tsx`.
    - [ ] Delete `components/projects/project-dashboard.test.tsx`.
- [ ] Task: Final Verification
    - [ ] Run all project tests to ensure no regressions: `npm test`
    - [ ] Run build to ensure no broken imports remain: `npm run build`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Cleanup' (Protocol in workflow.md)
