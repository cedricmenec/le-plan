# Plan: Project Detail UI Refinement & Grid Placeholders

## Phase 1: Foundation & Header Refactoring
- [x] Task: Create `GridPlaceholder` component in `components/ui/grid-placeholder.tsx` fa6385d
    - [x] Implement a card-sized container with a dashed border
    - [x] Add a customizable centered text label
    - [x] Ensure responsive sizing to match `MissionCard`
- [~] Task: Refactor section headers in `components/missions/mission-list.tsx`
    - [ ] Replace existing bullet icons with small rounded rectangles
    - [ ] Apply Blue for "Active Missions" and Gray for "Planned Missions"
    - [ ] Add mission counts aligned to the far right of the header line
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Header Refactoring' (Protocol in workflow.md)

## Phase 2: Active Missions Grid Enhancement
- [ ] Task: Implement dynamic `GridPlaceholder` logic in `MissionList`
    - [ ] Update `renderGrid` to accept a `minItems` parameter or calculate needed placeholders
    - [ ] Logic: Fill the remainder of the 3-column row if total items < 3 or (items % 3 != 0)
    - [ ] Apply this logic specifically for the "Active Missions" section
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Active Missions Grid Enhancement' (Protocol in workflow.md)

## Phase 3: Planned Missions List Refactor
- [ ] Task: Refactor `CondensedMissionList` structure in `components/missions/condensed-mission-list.tsx`
    - [ ] Create a container with rounded corners and a subtle border
    - [ ] Add table-like headers: Mission, Type, Charge Estimée, Priorité
- [ ] Task: Refactor `CondensedMissionRow` in `components/missions/condensed-mission-row.tsx`
    - [ ] Implement a 4-column layout matching the headers
    - [ ] Mission column: ID/Title and description
    - [ ] Type column: Use existing badge logic
    - [ ] Charge Estimée column: Display estimation
    - [ ] Priorité column: Display "n/a" in very light gray
    - [ ] Implement row-wide click for navigation to mission detail
    - [ ] Add subtle background hover effect
    - [ ] Implement "three dots" (ellipsis) menu appearing on hover for Edit/Delete actions
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Planned Missions List Refactor' (Protocol in workflow.md)

## Phase 4: Final Polish & Verification
- [ ] Task: Verify overall visual consistency and responsiveness
    - [ ] Check alignment of mission counts in headers
    - [ ] Ensure `GridPlaceholder` matches `MissionCard` dimensions exactly
    - [ ] Test Edit/Delete actions from the new planned missions list
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish & Verification' (Protocol in workflow.md)
