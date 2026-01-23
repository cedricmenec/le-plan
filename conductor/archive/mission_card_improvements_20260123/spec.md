# Specification: Mission Card Improvements (Notes & Goals)

## 1. Overview
This track aims to improve the visual representation and interactivity of mission cards within the `MissionList`. It involves refactoring the mission card into a standalone component and enhancing the "notes" and "goals" fields with tooltips and hover effects.

## 2. Functional Requirements
- **Refactoring:** Extract the mission card rendering logic from `MissionList.tsx` into a new component `MissionCard.tsx` located in `components/missions/`.
- **Notes Field:**
    - Display a `StickyNote` icon (Lucide) when a mission has notes.
    - On hover of the icon, display the full content of the notes in a `Tooltip`.
- **Goals Field:**
    - The goal text remains clamped to 2 lines by default.
    - If the goal text is truncated, a `Tooltip` must display the full goal content upon hovering over the text.
    - On hover, the goal text color should change slightly to indicate interactivity.

## 3. Non-Functional Requirements
- **Performance:** Tooltips should be lightweight and not impact list scrolling performance.
- **Maintainability:** The new `MissionCard` component should be reusable and easy to test.
- **Consistency:** Use existing `shadcn/ui` Tooltip components and Lucide icons.

## 4. Acceptance Criteria
- [ ] `MissionCard` component is created and used within `MissionList`.
- [ ] `StickyNote` icon appears ONLY when `notes` are present.
- [ ] Goal tooltip appears ONLY when the text exceeds 2 lines.
- [ ] Goal text color changes on hover.
- [ ] Tooltip content for notes and goals is correctly displayed and readable.

## 5. Out of Scope
- Editing missions directly from the tooltip.
- Changing the mission card layout beyond these two fields.
