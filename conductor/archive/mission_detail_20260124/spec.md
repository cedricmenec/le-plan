# Specification - Mission Detail Page

## Overview
Implement a dedicated detail page for Missions. This page provides a comprehensive view of a single mission's information and its associated subtasks. It serves as the primary workspace for refining a mission and managing its granular progress.

## Functional Requirements

### 1. Navigation & Routing
- **URL Structure:** `/missions/[id]` (App Router).
- **Access Points:**
    - "Détails" button on `MissionCard` (anywhere it appears).
    - Direct URL access.
- **Breadcrumbs:** Implement breadcrumbs for easy navigation (e.g., `Dashboard > Projects > [Project Name] > [Mission Name]` or `Dashboard > Missions > [Mission Name]`).

### 2. Page Layout (Desktop)
- **Two-Column Split:**
    - **Left Column:** Mission Identity & Metadata (Title, Goal, Notes, Project, Type, Status, Estimation, Confidence).
    - **Right Column:** Subtask Management (`SubtaskList` component).
- **Mobile:** Stacks into a single column.

### 3. Mission Editing (Inline)
- Fields should be editable inline to provide a fluid experience.
- **Editable Fields:**
    - Title (Text input)
    - Goal (Textarea)
    - Notes (Large Textarea)
    - Project (Select dropdown)
    - Status (Select dropdown)
    - Type (Select dropdown)
    - Estimation (Number input)
    - Confidence (Slider or Number input)
- Changes should be saved automatically on blur or via a "Save" action to ensure data persistence.

### 4. Subtask Management
- Reuse and enhance the existing `SubtaskList` component.
- Users can add, toggle (complete/incomplete), edit title, and delete subtasks directly on the page.

## Non-Functional Requirements
- **Responsiveness:** Layout must adapt gracefully to different screen sizes.
- **Feedback:** Provide visual feedback (e.g., loading states, toast notifications) during saving operations.
- **Security:** Ensure users can only access and edit missions they are authorized to see.

## Acceptance Criteria
- [ ] Navigating to `/missions/[id]` loads the correct mission data.
- [ ] The page layout matches the Two-Column split on desktop.
- [ ] Clicking on mission fields (Title, Goal, etc.) allows inline editing.
- [ ] Inline edits are successfully persisted to Supabase.
- [ ] The `SubtaskList` is fully functional and synchronized with the database.
- [ ] Breadcrumbs correctly reflect the navigation path.
- [ ] The "Détails" button on `MissionCard` correctly redirects to the new page.

## Out of Scope
- Mission History/Timeline log.
- Complex attachments or file uploads.
