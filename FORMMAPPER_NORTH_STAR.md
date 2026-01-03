### FormMapper — North Star Plan & Structure (MVP Blueprint v1)

This document is the **authoritative implementation blueprint** for FormMapper MVP.
If code, UX, or schema decisions conflict with this doc, **this doc wins** unless explicitly revised.

---

## 1) Product definition (MVP)

A browser-based canvas editor for mapping musical form as:

- **Gapless section timeline**: contiguous sections partition the full piece
- **Independent absolute-time energy curve** above the axis
- Optional **BPM + time signature** to compute measure labels and timecodes
- **File-based persistence** via import/export `.formmapper.json`
- **PNG export** of the current view

Primary use cases:
- Analyze tracks by segmenting form, tagging sections, writing notes, sketching energy.
- Compose by roughing out form arcs quickly.

---

## 2) Non-negotiable UX decisions (locked)

### Layout

- All-dark UI with dark-green surfaces + flat “silver” accents.
- Top minimal toolbar + center canvas + bottom fixed-height drawer.
- Bottom drawer: scrollable internally, tabs with contextual auto-focus:
  - “Project” always present
  - Selecting a section auto-switches to “Section”
  - Selecting a curve point/segment auto-switches to “Curve”

### Navigation

- Mouse wheel / trackpad scroll: **horizontal pan** on canvas.
- Trackpad pinch: **x-axis zoom only** (no vertical zoom).
- Snap: **always on** (UI may show a toggle, but default is on).

### Sections (gapless)

- Sections fully cover `[0, projectEndSec]` with no holes.
- No overlaps; **ripple/push editing** is default.
- Insertion is **boundary-only**: insert only between sections; elsewhere snaps to nearest boundary.
- Silence gaps are explicit sections.

### Energy curve

- Curve points are **absolute time**: do not move when sections ripple.
- Unlimited points.
- Add point via double-click.
- Segment transition types: **Linear**, **Step**, **Curve** with one parameter.
- **Step behavior**: segment-level; instantaneous change at the boundary between points.

### Timebase modes

- Canonical x-axis unit: **seconds** internally.
- View modes:
  - `time` (seconds / mm:ss labels)
  - `measuresComputed` (derived from fixed BPM + time signature)
  - `measuresAbstract` (measure numbers as arbitrary grid units; no conversion promise)
- BPM + time signature edited in Project tab; timebase switch in top toolbar.

### Toolbar (top)

- Import
- Export JSON
- Export PNG
- Timebase switch
- Snap toggle
- Zoom reset

### Colors

- Sections use a fixed curated palette inspired by “Finland” (slate, maroon, navy, forest, beige/sand).

Undo/redo: not required in MVP.

---

## 3) Canonical data model (JSON schema v1)

### 3.1 Canonical project model

```json
{
  "schemaVersion": 1,
  "title": "string",
  "composerOrArtist": "string",
  "projectNotes": "string",
  "timebaseView": "time | measuresComputed | measuresAbstract",

  "tempoModel": {
    "enabled": true,
    "bpm": 120,
    "timeSig": { "numerator": 4, "denominator": 4 }
  },

  "sections": [
    {
      "id": "uuid",
      "name": "Intro",
      "colorId": "navy_01",
      "startSec": 0,
      "endSec": 12.5,
      "notes": "string",
      "tags": ["drop", "breakdown"]
    }
  ],

  "energyCurve": {
    "yBands": ["Low", "Medium", "High"],
    "yMin": 0,
    "yMax": 1,
    "points": [
      {
        "id": "uuid",
        "sec": 0,
        "y": 0.2,
        "rightTransition": { "type": "linear", "param": 0 }
      }
    ]
  }
}
```

### 3.2 Curve model semantics (deterministic)

- Store transition on outgoing side: `points[i].rightTransition` defines interpolation from `i` to `i+1`.
- `type ∈ {"linear","step","curve"}`
- `param` meaning (MVP decision):
  - Range: `param ∈ [-1, +1]`
  - `0` behaves like linear
  - negative values bias easing one direction, positive the other (exact easing function defined in code and kept stable)

**Step semantics** (MVP decision):
- For segment `i → i+1`, y holds at `y_i` for `sec ∈ [sec_i, sec_{i+1})` then jumps to `y_{i+1}` at `sec_{i+1}`.

### 3.3 Palette

Fixed curated palette:

```json
{
  "palette": [
    { "id": "slate_01", "hex": "#..." },
    { "id": "navy_01", "hex": "#..." },
    { "id": "maroon_01", "hex": "#..." },
    { "id": "forest_01", "hex": "#..." },
    { "id": "beige_01", "hex": "#..." }
  ]
}
```

---

## 4) Core computations & invariants

### 4.1 Project length (computed)

- `projectEndSec = max( lastSection.endSec, max(curvePoint.sec) )`
- In practice sections usually determine length, but curve may extend beyond and must extend length if needed.

### 4.2 Measures computed mode

Only when `tempoModel.enabled` and view mode is `measuresComputed`:

- `beatSec = 60 / bpm`
- `beatsPerMeasure = numerator`
- `measureSec = beatsPerMeasure * beatSec`
- `measureIndex = floor(sec / measureSec) + 1`
- `secAtMeasureStart(m) = (m - 1) * measureSec`

### 4.3 Snapping (always on)

Snap step depends on view:

- `time`: dynamic step (chosen from a small set based on zoom; must feel good)
- `measuresComputed`: snap to measure boundaries (beats optional later)
- `measuresAbstract`: snap to integer measure units

### 4.4 Canonical invariants (enforced after every edit and on import)

Sections:

- Sorted by time
- `sections[0].startSec === 0`
- For all i: `sections[i].endSec > sections[i].startSec`
- For all i>0: `sections[i].startSec === sections[i-1].endSec`
- No gaps, no overlaps

Energy points:

- Sorted by `sec`
- For all i: `points[i+1].sec > points[i].sec` (ties resolved deterministically on import)

---

## 5) Interaction semantics (source of truth)

### 5.1 Selection model

- Click section bar selects section
- Click curve point selects point
- Click curve segment selects segment (distinct from points)
- Clicking empty canvas clears selection and focuses Project tab

### 5.2 Section editing (gapless ripple)

Boundary resize:

- Drag right edge of section i:
  - `newEnd = snappedTime`
  - Set `sections[i].endSec = newEnd`
  - Set `sections[i+1].startSec = newEnd`
  - Ripple: shift all later sections by delta so ordering and gaplessness remain valid

Insertion (MVP decision; boundary-only):

- Insert at boundary between `i` and `i+1`
- Default duration: `DEFAULT_INSERT_SEC` (time) or `1 measure` (computed)
- Steal time from the right neighbor first; if insufficient, continue stealing from subsequent sections
- Never allow any section to go below `MIN_SECTION_SEC`

### 5.3 Energy curve editing

- Double-click: add point at snapped `sec`, `y` based on click height (clamped [0..1])
- Drag point: updates `sec` (snapped) and `y` (clamped)
- Select segment: edit transition type and curve param
- Step rendering: vertical jump at the right boundary time

---

## 6) Import/Export + PNG

### 6.1 Import `.formmapper.json`

- Validate `schemaVersion`
- Validate required fields/types
- Repair safe issues (sort sections, enforce gapless if possible, sort points)
- Surface warnings in UI (non-blocking list)

### 6.2 Export `.formmapper.json`

- Serialize exactly to schema
- File name: `${title || "Untitled"}.formmapper.json`

### 6.3 Export PNG

- Export the editor view to PNG:
  - sections, curve, axes labels, and optional title header
- PNG must be readable at typical screen sizes

---

## 7) Recommended code structure (web app)

Suggested structure (separate responsibilities so timebase, snapping, selection, rendering, and IO stay stable):

- `src/model/`: schema types, validators, repairs, invariant enforcement
- `src/engine/`: snapping + timebase adapters, coordinate transforms (sec↔px), hit-testing
- `src/render/`: canvas renderer (sections, curve, axes, labels)
- `src/state/`: app state (project model, selection, viewport)
- `src/ui/`: toolbar, drawer tabs, inputs, palette picker, tags UI
- `src/io/`: import/export JSON, export PNG, file dialogs

---

## 8) Milestone plan (implementation order)

- Milestone A: scaffold app shell (toolbar/canvas/drawer), theme, basic state
- Milestone B: project model + invariants + import/export JSON (round-trip)
- Milestone C: sections render + selection + boundary resize with ripple
- Milestone D: curve render + add/move points + segment selection + transitions
- Milestone E: timebase switching + snapping behaviors + axis labels
- Milestone F: PNG export + final polish for acceptance criteria

---

## 9) Out of scope (MVP)

- Undo/redo
- Multi-track lanes, automation, audio sync, playback
- Complex tempo maps (variable tempo)
- Vertical zoom


