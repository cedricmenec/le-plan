# Design — Unified Estimation & Confidence

## Context

The current estimation system uses three fields (`estimation`, `rom_size`, `load_source`) to express a single concept — "how long will this take?". This creates complexity, cognitive overhead, and a persistent bug where `rom_size=null` displays as `0j`. The confidence field stores a percentage (0-100) that maps poorly to intuitive understanding.

The change simplifies to a single `estimation` field (days) with 5-level qualitative confidence. T-shirt sizes become UX presets (not persisted). Task-based load becomes an indicator (not a source).

## Goals / Non-Goals

**Goals:**
- Replace 3 estimation artifacts with 1 unified field
- Introduce 5-level qualitative confidence (1-5) replacing percentage
- Keep T-shirt sizes as quick-entry presets (no persistence)
- Show task-based load as contextual indicator (tooltip card + detail)
- Capture real duration at mission completion
- Fix the `rom_size=null → 0j` display bug by eliminating the root cause

**Non-Goals:**
- No change to task estimation mechanism (0.5d increments, per-task)
- No change to mission state machine or lifecycle
- No change to timeline visualization logic (still uses `estimation`)
- No migration of existing `estimation` values — they remain valid

## Decisions

### D1: Remove `rom_size` and `load_source` from the data model

**Decision**: Delete `rom_size` (TEXT, nullable) and `load_source` (TEXT, 'rom'|'tasks') from the `Mission` type in IndexedDB schema. These fields become dead code.

**Rationale**: They create two sources of truth. The persistence of `rom_size` as a separate concept forces the UI to choose between them via `load_source`. By removing them, the `estimation` number IS the truth.

**Alternatives considered**: Keeping `rom_size` as metadata-only (not used for display). Rejected because it still adds cognitive complexity for no benefit — presets are purely an interaction pattern, not data.

### D2: Confidence as integer 1-5 instead of percentage 0-100

**Decision**: Store confidence as `TINYINT` (1, 2, 3, 4, 5) or `NULL` (unset). Default: 3 (Moyen).

**Rationale**: Percentages imply precision that doesn't exist. "70% confident" is harder to interpret than "Haute confiance" (level 4). Five levels map to natural language and are intuitive at a glance.

**Alternatives considered**: Keeping percentage (0-100). Rejected because it's less communicative. Using 3 levels (Low/Medium/High). Rejected because 5 gives a better gradient without overcomplicating.

### D3: T-shirt sizes as UX presets only

**Decision**: The T-shirt size buttons in the creation/edit form are plain click handlers that call `setEstimation(value)`. No `rom_size` field, no hidden state.

```
Preset mapping:
XS → 0.5 | S → 2 | M → 5 | L → 15 | XL → 45 | XXL → 100
```

**Rationale**: Presets speed up data entry. Not persisting them keeps the model clean. The user sees the numeric value after clicking, no magic.

### D4: Task-based load as indicator, not toggle

**Decision**: `calculateTaskRemainingLoad()` continues to work. It's displayed in:
- **Mission card**: Tooltip on hover (estimation+confidence, comparison, remaining/total tasks)
- **Mission detail**: Informational block with suggestion to align estimation

No toggle, no `load_source` field. The mission's `estimation` is always the displayed load.

**Rationale**: Users need visibility into task breakdown vs estimation, but shouldn't have to choose which one "counts". This gives both without ambiguity.

### D5: Dexie schema version bump

**Decision**: Bump IndexedDB schema version from 1 to 2. The new schema removes `rom_size` and `load_source` from the missions table index definition. Existing data is preserved (extraneous fields are ignored by Dexie).

**Rationale**: Dexie handles migration automatically. Since we're removing fields (not renaming), no data transformation is needed — Dexie ignores extra properties on stored objects.

### D6: Home page data loading fix

**Decision**: Add a `useEffect` in `MissionList` that calls `getMissions()` when `initialMissions` is not provided. This is a bug fix piggybacking on this change.

**Rationale**: The Home page (`<MissionList layout="split">`) doesn't pass `initialMissions`, leaving the component in perpetual loading state. The fix is minimal and essential.

## Component Design

### ConfidenceSelector (new component)

**Location**: `src/components/ui/confidence-select.tsx`

**Props**: `value: 1|2|3|4|5|null`, `onChange: (v) => void`, `showTooltip?: boolean`

**Behavior**:
- Renders 5 clickable dots/circles in a row
- Clicking a dot sets that level and fills all dots up to it
- Each dot has a label on hover: Très faible, Faible, Moyen, Haute, Très haute
- Show tooltip with explanatory text about confidence meaning per level

**Visual layout**:
```
Très faible  Faible  Moyen  Haute  Très haute
   ○           ○       ●       ●       ●
              ──── tooltip ────
        "Je commence à y voir clair"
```

### Modified: MissionForm (creation)

- Replace standalone estimation input with preset buttons + numeric input
- Replace confidence percentage input with ConfidenceSelector
- Defaults: estimation=3, confidence=3

### Modified: EditMissionModal

- Replace confidence percentage input with ConfidenceSelector
- Keep estimation input as-is (already numeric, already correct)
- Add preset buttons alongside estimation input for convenience

### Modified: MissionCard

- Replace `romDays`/`tasksDays` computation with direct `mission.estimation` display
- Show confidence badge next to estimation
- Add tooltip on hover showing:
  - "Estimation: Xj — Confiance: Y/5 (Label)"
  - "Charge par tâches: Xj (Y restantes / Z total)"

### Modified: CondensedMissionRow

- Same changes as MissionCard — direct estimation display
- Replace LoadIcon (Shirt/ListTodo) with a generic estimation icon
- Add tooltip with same detail as MissionCard

### Modified: MissionHeroBlock

- Remove "Estimation Settings" (ROM selector + load source toggle + comparison panels)
- Replace with suggestion card: "Charge par tâches: Xj. Ajuster l'estimation ?"
- Keep ConfidenceSelector in the relevant section
- Confidence display inline

### Modified: MissionTimeline (no functional change)

- Already uses `estimation` prop — no code change needed
- Will automatically use the unified estimation value

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Users who relied on the ROM/Task toggle lose that distinction | The toggle was rarely used and confusing. Task load remains visible as indicator. |
| Existing confidence percentages (0-100) need migration | Simple mapping: 0-20→1, 21-40→2, 41-60→3, 61-80→4, 81-100→5. Run once at first load. |
| Dexie schema migration could lose data | Dexie upgrades preserve existing records. Removing indexes doesn't delete data. |
| Home page still works if missions count is 0 | The loading fix handles empty state — `getMissions()` returns `[]`, not an error. |
| Users might miss the old "T-shirt" icon distinction | Estimation display will use a single generic icon. The confidence badge provides richer context. |

## Migration Plan

### Data migration (automatic, no user action):

1. Dexie version bump 1→2 handles schema index changes
2. On first load after update, existing `confidence` values are converted:
   - `0-20` → `1` (Très faible)
   - `21-40` → `2` (Faible)
   - `41-60` → `3` (Moyen)
   - `61-80` → `4` (Haute)
   - `81-100` → `5` (Très haute)
3. `rom_size` and `load_source` fields remain in IndexedDB objects (Dexie preserves extra data) but are ignored by the code

### UI migration (immediate):
- Removed: ROM selector, load source toggle, comparison panels in MissionHeroBlock
- Added: ConfidenceSelector component, preset buttons, suggestion cards
- Changed: Mission cards show direct estimation, tooltips added

## Open Questions

None — all decisions have been made during the explore phase.