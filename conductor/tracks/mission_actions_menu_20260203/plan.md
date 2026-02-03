# Implementation Plan - Mission Actions Menu

## Phase 1: Preparation & Component Analysis
- [x] Task: Conductor - Analyze `MissionHeaderHero` and `EditMissionModal` integration 1a349ba
    - [ ] Read `components/missions/mission-header-hero.tsx` to identify the insertion point for the menu.
    - [ ] Read `components/missions/edit-mission-modal.tsx` to understand prop requirements.
    - [ ] Read `components/missions/delete-mission-dialog.tsx` to understand prop requirements.
    - [ ] Identify necessary imports (`DropdownMenu` components, icons, etc.).

## Phase 2: Implementation (TDD)
- [x] Task: Conductor - Create Test for Mission Header Actions bc76e34
    - [ ] Create `components/missions/mission-header-actions.test.tsx`.
    - [ ] Write tests to verify:
        - The menu trigger (ellipsis icon) renders.
        - The dropdown opens when clicked.
        - "Modifier" and "Supprimer" options are present.
        - Clicking "Modifier" triggers the edit callback/modal.
        - Clicking "Supprimer" triggers the delete callback/dialog.
    - [ ] Run tests (Red phase).
- [x] Task: Conductor - Implement Mission Header Actions 92d35e1
    - [ ] Modify `components/missions/mission-header-hero.tsx` (or create a sub-component if cleaner) to include the `DropdownMenu`.
    - [ ] Integrate `EditMissionModal` state and handlers.
    - [ ] Integrate `DeleteMissionDialog` state and handlers.
    - [ ] Implement the redirect logic after deletion (using `useRouter`).
    - [ ] Run tests (Green phase).
- [ ] Task: Conductor - User Manual Verification 'Implementation' (Protocol in workflow.md)

## Phase 3: Integration & Polish
- [ ] Task: Conductor - Verify Styling and Responsive Behavior
    - [ ] Ensure the menu fits the design system (Tailwind classes).
    - [ ] Check alignment in the header on both desktop and mobile.
- [ ] Task: Conductor - Final Code Review & Cleanup
    - [ ] Remove any unused imports.
    - [ ] Ensure all types are strictly defined.
- [ ] Task: Conductor - User Manual Verification 'Integration & Polish' (Protocol in workflow.md)
