# Track Specification - Mission Card UI Polish

## Overview
This track focuses on refining the `MissionCard` component by removing redundant sections and applying a "polish" inspired by a provided design reference. The goal is to improve visual clarity and align the UI with a more professional and modern aesthetic.

## Functional Requirements
- **Remove Progress Section:** Completely remove the "Avancement" label, progress bar, and the associated mock progress calculation logic.
- **Update Mission Type & Project Display:**
    - Remove the colored badge for the mission type.
    - Display mission type and project name as subtle, uppercase gray text (e.g., `FEATURE • PROJECT NAME`).
- **Top Row Status Badge:**
    - Add a status badge (e.g., "ACTIVE", "TODO", "DONE") in the top row next to the type icon, using a style similar to the "ACTIVE" badge in the reference image.
- **Footer Updates:**
    - Change "Statut: {status}" to uppercase `STATUT: {STATUS}` with subtle gray styling.
    - Change "DÉTAILS" to uppercase `DETAILS` (no accent) and apply a clear blue color (e.g., `text-blue-600`).
- **Goal/Description Styling:**
    - Increase the line clamp for the mission goal/description from 2 to 3 lines.
- **Title Styling:** Ensure the mission title uses a bold, dark styling as shown in the reference.

## Non-Functional Requirements
- Maintain accessibility standards for color contrast.
- Ensure the card remains responsive and handles truncated titles/goals gracefully.
- Follow existing Tailwind CSS patterns in the project.

## Acceptance Criteria
- [ ] The progress bar and "Avancement" text are gone.
- [ ] Mission type and project are displayed in uppercase gray text with a separator.
- [ ] A status badge is present in the top row.
- [ ] Footer text ("STATUT", "DÉTAILS") is uppercase and correctly styled.
- [ ] The overall card aesthetic matches the reference image (spacing, typography, subtle borders).

## Out of Scope
- Adding new mission fields or database schema changes.
- Modifying the `MissionActions` dialog or functionality.
