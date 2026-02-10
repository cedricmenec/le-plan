# Track Specification: Fix MissionCard Estimation Display

## Overview
Currently, the `MissionCard` component in mission lists (e.g., in project details) always displays a value of `0` for the remaining time. This track aims to correctly display the estimation (either ROM or Tasks) based on the mission's `officialEstimationDisplay` setting, along with the appropriate icon for visual clarity.

## Functional Requirements
- **Dynamic Estimation Display:** The `MissionCard` must check the `officialEstimationDisplay` field of a mission.
- **ROM Display:**
    - If `officialEstimationDisplay` is 'ROM', display the full ROM value (converted from T-shirt size to days using `romToDays`).
    - Use the `Shirt` icon from Lucide.
- **Tasks Display:**
    - If `officialEstimationDisplay` is 'TASKS', display the sum of estimations for all non-completed tasks (using `calculateTaskRemainingLoad`).
    - Use the `ListTodo` icon from Lucide.
- **Unit Handling:** Display the value followed by "j" (e.g., "5j", "0.5j").

## Non-Functional Requirements
- **Consistency:** The icons and logic must match the `MissionHeaderHero` and existing utilities in `lib/load-utils.ts`.
- **Performance:** Calculations should be efficient, as they will occur within a list of cards.

## Acceptance Criteria
- [x] `MissionCard` displays the ROM estimate and `Shirt` icon when `officialEstimationDisplay` is 'ROM'.
- [x] `MissionCard` displays the sum of remaining task estimates and `ListTodo` icon when `officialEstimationDisplay` is 'TASKS'.
- [x] The value displayed is correctly formatted (e.g., "15j").
- [x] Unit tests verify the correct logic for both estimation types.

## Out of Scope
- Changing the estimation values themselves.
- Modifying the `MissionHeaderHero` component.
- Implementing any progress bars or complex visual indicators beyond the icon and value.
