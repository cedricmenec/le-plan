# Specification: Project Card Enhancement & Alphabetical Sorting

## Overview
This track aims to improve the project discovery and visibility experience by sorting projects alphabetically and significantly enhancing the `ProjectCard` UI. The new card will feature a hero image, a list of up to three active missions with their deadlines, and a summary of upcoming missions.

## Functional Requirements

### 1. Alphabetical Sorting
- The list of projects on the projects page must be sorted alphabetically by name by default.

### 2. Data Model Update
- Add an `image_url` column (TEXT, nullable) to the `projects` table in PostgreSQL to store the path or URL of the project's hero image.

### 3. Project Card Enhancements
- **Hero Section:**
    - Display an image at the top of the card (fixed aspect ratio, e.g., 16:9).
    - Use a default placeholder image if `image_url` is null.
- **Active Missions List:**
    - Display up to 3 missions with the status `in_progress`.
    - Missions should be sorted by their **Estimated Delivery Date** (soonest first).
    - For each mission, show the **Title** and the **Relative Delivery Duration** (e.g., "Dans 3 jours").
- **Upcoming Missions Summary:**
    - Display the total count of missions with the status `todo` at the bottom of the card.

## User Interface & Layout
- **Structure:**
    - Top: Hero Image.
    - Middle: Project Name and Description.
    - Bottom Section (Subtle background/border): List of 3 active missions.
    - Footer: "X missions à venir" indicator.
- **Style:** Modern, clean layout inspired by the provided reference image, using existing design tokens (Tailwind, Shadcn).

## Technical Tasks
- Create a Supabase migration to add `image_url` to the `projects` table.
- Update `types/database.types.ts`.
- Modify the `getProjects` server action to handle alphabetical sorting.
- Update `ProjectCard` and `ProjectGrid` components to fetch/display the new data.

## Acceptance Criteria
- [ ] Projects are sorted alphabetically on the main projects page.
- [ ] Each project card displays a hero image (custom or placeholder).
- [ ] Up to 3 active missions are listed on the card with their relative deadlines.
- [ ] the count of upcoming missions is visible on the card.
- [ ] The UI is responsive and looks polished.
