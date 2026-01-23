# Specification: Mission Goal and Notes Fields

## 1. Overview
This track aims to enhance the "Mission" entity by adding two new fields: **Main Goal** and **Notes**. These fields will provide users with better context and a place to store auxiliary information for each mission, helping to reduce cognitive load and improve clarity during prioritization discussions.

## 2. Functional Requirements

### 2.1 Database Schema Updates
- Add a `goal` column to the `missions` table (Text, nullable).
- Add a `notes` column to the `missions` table (Text, nullable).

### 2.2 Mission Management (Add/Edit)
- **Add Mission Dialog:**
    - Include a "Main Goal" field (Multi-line Textarea, UI Label: "Main Goal").
    - Include a "Notes" field (Multi-line Textarea, UI Label: "Notes").
- **Edit Mission Modal:**
    - Include the "Main Goal" field for editing.
    - Include the "Notes" field for editing.

### 2.3 User Interface (Mission Card)
- **Main Goal Display:**
    - Display the "Main Goal" prominently on the Mission Card, positioned directly below the mission title.
    - If no goal is set, the space should be collapsed or show a subtle placeholder/indicator.
- **Notes Access:**
    - Display a "Notes" icon (e.g., a "FileText" or "StickyNote" icon from Lucide) on the Mission Card (likely in the actions or metadata area).
    - Hovering over the icon should reveal the content of the "Notes" field in a tooltip.
    - If no notes exist, the icon should be hidden or disabled.

## 3. Non-Functional Requirements
- **Performance:** Tooltip rendering should be snappy and not cause layout shifts.
- **UI Consistency:** Use existing `shadcn/ui` components (`Textarea`, `Tooltip`, `Label`) to match the project's aesthetic.

## 4. Acceptance Criteria
- [ ] Users can set a "Main Goal" and "Notes" when creating a mission.
- [ ] Users can update the "Main Goal" and "Notes" of an existing mission.
- [ ] The "Main Goal" is clearly visible on the Mission Card below the title.
- [ ] The "Notes" are accessible via a tooltip on the Mission Card.
- [ ] Data persists correctly in the Supabase database.

## 5. Out of Scope
- Rich text or Markdown support for notes (Plain text only for now).
- Searching or filtering missions based on the content of the Goal or Notes fields.
