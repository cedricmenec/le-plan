# Specification: Mission Detail Header & Timeline Visualization

## Overview
This track aims to improve the visual hierarchy and data density of the mission detail page. By moving key metrics (dates, effort, project context) to a prominent "hero" block under the title, we make the mission's health and schedule immediately apparent to stakeholders. A minimalist horizontal timeline will visually bridge the gap between "today", "estimated delivery", and "desired delivery".

## Functional Requirements
- **Header Restructuring**:
    - Move the **Project Name** above the mission title (as a clickable breadcrumb-like link if possible).
    - Keep **Mission Type** and **Status** badges near the title.
- **Visual Metrics Block**:
    - Implement a horizontal timeline starting from the **current date**.
    - **Timeline Segments**:
        - A colored "effort" segment representing the remaining estimation starting from today.
        - Markers for **Estimated Delivery Date** and **Desired Delivery Date**.
    - **Status Indicators**:
        - **Danger Alert**: Visual warning (e.g., red highlight or icon) if the Estimated Delivery Date is after the Desired Delivery Date.
        - **Confidence Score**: Display the percentage discreetly within the block.
        - **Work Effort**: Explicitly display the remaining days of work.
- **Handling Incomplete Data**:
    - Use "n/a" or placeholders if dates are missing to maintain the block's layout.
- **Responsiveness**: The timeline should adapt to different screen widths.

## Non-Functional Requirements
- **Visual Style**: Clean, modern, and high-contrast (following Shadcn/ui and Tailwind patterns).
- **Performance**: Ensure date calculations and timeline rendering are efficient on the client side.

## Acceptance Criteria
- [ ] The Project Name is displayed above the mission title.
- [ ] A horizontal timeline is visible under the mission title.
- [ ] The timeline correctly starts at "Today".
- [ ] Remaining work effort is visualized as a fill/segment on the timeline.
- [ ] Estimated and Desired delivery dates are clearly marked on the timeline.
- [ ] A warning is displayed if Estimated Delivery > Desired Delivery.
- [ ] Confidence score and total estimation are visible in the new block.
- [ ] The old metrics grid at the bottom of the page is removed (avoiding redundancy).

## Out of Scope
- Modification of the Milestones or Task List logic.
- Adding complex "drag and drop" date adjustment on the timeline (edit via fields remains).
