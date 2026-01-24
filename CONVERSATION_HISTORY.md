I'll now guide you through a series of questions to build a comprehensive specification (`spec.md`) for this track.

**Question 1/4 (Exclusive Choice):**

How should the URL structure for the Mission Detail page be defined?
Given that missions can exist independently or be part of a project, a top-level route seems most flexible.

A. `/missions/[id]` - Accessible at the root level (e.g., `app/missions/[id]/page.tsx`).
B. `/projects/[projectId]/missions/[id]` - Strictly nested under projects (might complicate standalone missions).
C. Type your own answer.