# Specification: Project Card UI Polish & Bug Fix

## Overview
This track addresses a visibility issue where project hero images are not appearing despite correct URLs, and introduces a color overlay to the project cards to unify the visual style and improve text readability.

## Functional Requirements

### 1. Bug Fix: Image Visibility
- Investigate and resolve why `<img>` tags in `ProjectCard` are not displaying images when a valid `image_url` is provided.
- Ensure the `getProjects` server action correctly fetches and passes the `image_url` field to the component.
- Check for potential CSS issues (e.g., `pointer-events-none` on parent containers or overflow hidden) that might be obscuring the image.

### 2. UI Enhancement: Color Overlay
- Apply a gradient overlay to the hero image section of the `ProjectCard`.
- The gradient should transition from the project's specific color (`project.color`) at the bottom to transparent at the top.
- This overlay aims to "tint" the image and provide a consistent high-contrast background for the project label.

### 3. Visual Refinements
- Ensure the project label/type (e.g., "BIN PACKING SERVICE") remains highly legible over the new overlay.
- Maintain the 16:9 aspect ratio for the hero section.

## Technical Tasks
- Verify `image_url` data flow from Supabase to `ProjectCard`.
- Update `components/projects/project-card.tsx` to include the dynamic gradient overlay.
- Test with various project colors to ensure the gradient looks good in both light and dark modes.

## Acceptance Criteria
- [ ] Project hero images are visible in the dashboard cards.
- [ ] A color-coded gradient overlay is present on each project card's image.
- [ ] Project labels are clearly legible over the image and overlay.
- [ ] The fallback placeholder image still works correctly if no URL is provided.
