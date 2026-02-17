# Plan: Add Mission from Project Page

## Phase 1: Preparation & Component Refactoring [checkpoint: 77b218c]
- [x] Task: Update `AddMissionDialog` to support a pre-selected and locked `projectId`. (766e74b)
    - [x] Create/Update tests for `AddMissionDialog` to verify it can receive a `defaultProjectId` and that it disables/hides the selection in that case.
    - [x] Modify `AddMissionDialog` and `MissionForm` to accept `defaultProjectId` and `isProjectLocked` props.
- [x] Task: Enhance `useToast` or the toast implementation to support actionable links. (766e74b)
    - [x] Verify if current toast supports a `link` or `action` prop. If not, add support.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Preparation' (Protocol in workflow.md) (77b218c)

## Phase 2: Project Page Integration [checkpoint: 5529bdf]
- [x] Task: Add "Add Mission" button to the Project Detail page header. (0222837)
    - [x] Write tests for the Project Page header to ensure the new button exists and is only visible when the user has appropriate permissions (if applicable).
    - [x] Implement the `AddMissionDialog` trigger in `app/projects/[id]/page.tsx`.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Project Page Integration' (Protocol in workflow.md) (5529bdf)

## Phase 3: Polish & Success Flow
- [x] Task: Implement the success toast with "View Mission" link. (66562ee)
    - [x] Update the `addMission` action or the form submission handler to return the new mission ID.
    - [x] Update the UI to show the toast with the dynamic link after successful creation.
    - [x] Refactor list refresh to use `router.refresh()` instead of `window.location.reload()` to preserve toasts.
    - [x] Style success toast with a green background and set auto-dismiss to 5 seconds.
- [x] Task: Verify list refresh on the Project Page. (66562ee)
    - [x] Ensure `revalidatePath` is called for the project page after mission creation.
    - [x] Ensure client-side state is updated when props change after refresh.
- [~] Task: Conductor - User Manual Verification 'Phase 3: Polish & Success Flow' (Protocol in workflow.md)
