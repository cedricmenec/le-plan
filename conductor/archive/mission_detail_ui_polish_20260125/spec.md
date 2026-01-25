# Specification: Mission Detail UI Polishing

## Overview
Improve the visual hierarchy and layout of the Mission Detail page to make it more compact, readable, and aligned with the project's minimalist aesthetic (removing shadows, reducing title size).

## Functional Requirements

### 1. Header Refactoring
- **Title Size:** Reduce the mission title font size from `text-5xl` to `text-3xl`.
- **Metadata Row:** Group the Project Name, Mission Type, and Mission Status on a single row located *above* the title.
- **Shadow Removal:** Remove all shadow classes (e.g., `shadow-sm`, `shadow-md`) from the header containers.

### 2. Layout Reorganization
- **Section Inversion:** Move the "Objectif Principal" section to appear immediately after the header title.
- **Timeline Placement:** Move the "Timeline & Scheduling" visual block (currently inside the Hero block) to appear *below* the "Objectif Principal" section.
- **Notes & Context:** Remains below the Timeline section.

### 3. Content Cleanup
- **Remove Metadata Grid:** Delete the bottom grid section that displays "Estimation", "Confiance", "Livraison Estimée/Souhaitée", and "Projet" at the bottom of the main column (this information is largely redundant or already editable elsewhere).

### 4. General Styling
- **Shadowless Design:** Remove shadows from all cards and containers on the page (Main content area, Sidebar, etc.). Use borders or subtle background color changes for separation instead.

## Acceptance Criteria
- [ ] Mission title is `text-3xl`.
- [ ] Project, Type, and Status are on one line above the title.
- [ ] "Objectif Principal" is positioned before "Timeline & Scheduling".
- [ ] The metadata grid at the bottom of the main column is gone.
- [ ] No `shadow-*` utility classes are used on the page containers.

## Out of Scope
- Modifying the Sidebar content (Milestones/Tasks) beyond removing their shadows.
- Changing the logic of how fields are edited (InlineEditableField).
