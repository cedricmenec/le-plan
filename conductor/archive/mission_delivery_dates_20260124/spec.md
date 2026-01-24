# Track Specification: Delivery Dates for Missions

## Overview
This track adds two optional date fields to the Mission entity: **Estimated Delivery Date** (when the user thinks they will deliver) and **Desired Delivery Date** (the stakeholder's deadline). These dates help in communicating timelines and managing expectations.

## Functional Requirements

### 1. Data Model Updates
- Add `estimated_delivery_date` (Date, optional) to the `missions` table.
- Add `desired_delivery_date` (Date, optional) to the `missions` table.

### 2. UI Components
#### MissionCard (Dashboard & Project Detail)
- Display the remaining time based on `estimated_delivery_date`.
- **Logic:**
    - If `< 2 weeks`: Show "X jours" (e.g., "2 jours", "9 jours").
    - If `>= 2 weeks`: Show approximate duration rounded to the nearest week or 0.5 month (e.g., "~ 3 semaines", "~ 1 mois", "~ 2,5 mois").
- If no date is set, do not show delivery info.

#### Mission Detail View
- Display both "Date de Livraison Estimée" and "Date de Livraison Souhaitée".
- Format: `[Date réelle] ([Durée restante approximative])`.
- If a date is not set, display "n/a".

#### Mission Edit/Add Dialog
- Manual text entry for both dates.
- **Validation:**
    - Must be a valid date format.
    - **Warning (not blocking):** If "Estimated Delivery Date" is in the past.

### 3. Sorting Logic
- By default, missions in lists (Dashboard, Project View) are sorted by `estimated_delivery_date` (ascending). Missions without a date appear after those with a date.

## Non-Functional Requirements
- **Validation:** Server-side and client-side validation for date strings.
- **I18n:** Labels and durations should be in French as per the project language.

## Acceptance Criteria
- [ ] Users can add/edit estimated and desired delivery dates for any mission.
- [ ] MissionCards correctly display remaining time using the specified approximation logic.
- [ ] Mission Detail view shows both dates or "n/a".
- [ ] Lists are sorted by `estimated_delivery_date` by default.
- [ ] A warning appears if the estimated date is in the past, but saving is still possible.

## Out of Scope
- Interactive Date Picker (standard text input for now).
- Automatic rescheduling logic.
