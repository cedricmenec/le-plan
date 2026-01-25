# Plan: Project Detail UI Refinement & Grid Placeholders

## Phase 1: Foundation & Header Refactoring [checkpoint: 8c7e34a]
- [x] Task: Create `GridPlaceholder` component in `components/ui/grid-placeholder.tsx` fa6385d
    - [x] Implement a card-sized container with a dashed border
    - [x] Add a customizable centered text label
    - [x] Ensure responsive sizing to match `MissionCard`
- [x] Task: Refactor section headers in `components/missions/mission-list.tsx` d3b3bbb
    - [x] Replace existing bullet icons with small rounded rectangles
    - [x] Apply Blue for "Active Missions" and Gray for "Planned Missions"
    - [x] Add mission counts aligned to the far right of the header line
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Header Refactoring' (Protocol in workflow.md)

## Phase 2: Active Missions Grid Enhancement [checkpoint: c41d44f]
- [x] Task: Implement dynamic `GridPlaceholder` logic in `MissionList` f60c517
    - [x] Update `renderGrid` to accept a `minItems` parameter or calculate needed placeholders
    - [x] Logic: Fill the remainder of the 3-column row if total items < 3 or (items % 3 != 0)
    - [x] Apply this logic specifically for the "Active Missions" section
- [x] Task: Conductor - User Manual Verification 'Phase 2: Active Missions Grid Enhancement' (Protocol in workflow.md)

## Phase 3: Planned Missions List Refactor [checkpoint: 2fb903d]
- [x] Task: Refactor `CondensedMissionList` structure in `components/missions/condensed-mission-list.tsx` 6f88d6b
    - [x] Create a container with rounded corners and a subtle border
    - [x] Add table-like headers: Mission, Type, Charge Estimée, Priorité
- [x] Task: Refactor `CondensedMissionRow` in `components/missions/condensed-mission-row.tsx` 2fb7bbd
    - [x] Implement a 4-column layout matching the headers
    - [x] Mission column: ID/Title and description
    - [x] Type column: Use existing badge logic
    - [x] Charge Estimée column: Display estimation
    - [x] Priorité column: Display "n/a" in very light gray
    - [x] Implement row-wide click for navigation to mission detail
    - [x] Add subtle background hover effect
    - [x] Implement "three dots" (ellipsis) menu appearing on hover for Edit/Delete actions
- [x] Task: Conductor - User Manual Verification 'Phase 3: Planned Missions List Refactor' (Protocol in workflow.md)

## Phase 4: Final Polish & Verification [checkpoint: 9917bcf]
- [x] Task: Verify overall visual consistency and responsiveness
    - [x] Check alignment of mission counts in headers
    - [x] Ensure `GridPlaceholder` matches `MissionCard` dimensions exactly
    - [x] Test Edit/Delete actions from the new planned missions list
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final Polish & Verification' (Protocol in workflow.md)
