# Implementation Plan - Mission Card UI Polish

Refining the `MissionCard` component to match the reference design, removing the progress bar, and updating typography and badges for a cleaner look.

## Phase 1: Cleanup & Test Preparation
Prepare the codebase by removing legacy UI elements and updating tests to reflect the new requirements.

- [x] Task: Update `components/missions/mission-card.test.tsx` 1b9c947
- [x] Task: Modify `components/missions/mission-card.tsx` to remove progress section 1b9c947
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Cleanup & Test Preparation' (Protocol in workflow.md)

## Phase 2: UI Polish & New Elements
Implement the new visual elements and styling according to the reference image.

- [x] Task: Implement New Top-Row Status Badge 1b9c947
- [x] Task: Update Mission Type & Project styling 1b9c947
- [x] Task: Update Footer & Typography 1b9c947
- [x] Task: Update `components/missions/mission-card.test.tsx` for new UI 1b9c947
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Polish & New Elements' (Protocol in workflow.md)

## Phase 3: Final Verification
Ensure consistency and quality across the component.

- [x] Task: Final Styling Refinement b3a102e
    - [x] Update `MissionCard` to show goal on 3 lines (`line-clamp-3`). b3a102e
    - [x] Change `DETAILS` to `DETAILS` and ensure it is blue (`text-blue-600`). b3a102e
    - [x] Review spacing, padding, and shadows against the reference image. b3a102e
    - [x] Ensure dark mode compatibility. b3a102e
- [x] Task: Full Test Execution b3a102e
- [x] Task: Conductor - User Manual Verification 'Phase 3: Final Verification' (Protocol in workflow.md) [checkpoint: b3a102e]
