# Pulse JSON Schema

The contract between skills and renderers. Skills produce this JSON. Pulse renders it. If the JSON is valid, the deck renders. If it's not, the renderer rejects it.

---

## Envelope

Every Pulse deck is a single JSON object with two top-level keys: `meta` and `slides`.

```json
{
  "schemaVersion": 2,
  "meta": { },
  "slides": [ ]
}
```

> **Note:** Schema version 1 is deprecated. All new decks use version 2.

### `meta` — Deck Metadata

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Deck title. Format: `"Project Name — Phase/Sprint"` |
| `project` | string | No | Project name. Rendered in deck list subtitle. If omitted, parsed from title |
| `subtitle` | string | No | Punchline (strategy) or mission statement (kickoff) |
| `date` | string | Yes | ISO date: `YYYY-MM-DD` |
| `audience` | string | Yes | `"exec"` / `"team"` / `"customer"` / `"mixed"` |
| `template` | string | Yes | `"status"` / `"strategy"` / `"kickoff"` / `"allHands"` / `"requirements"` / `"custom"` |
| `theme` | string | No | Theme name. Loads `public/themes/{theme}.css`. Omit for default neutral theme |
| `rag` | string | No | `"green"` / `"yellow"` / `"red"` |
| `headline` | string | No | One sentence. Strategic momentum, not operational detail |

**Note on `eyebrow`:** The eyebrow label (e.g., "Project Update", "Strategy Briefing") is a renderer-level convention, not a Zod-validated field. Skills should include it in the JSON for clarity, but it is not enforced by schema validation.

### `slides` — Slide Array

Each slide is an object with `type`, `title`, `notes`, and `data`. The `data` shape varies by type.

```json
{
  "type": "hero",
  "id": "optional-unique-id",
  "title": "Slide Title",
  "notes": "Speaker notes — the insight behind the slide.",
  "data": { }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | Yes | Slide type identifier (see Slide Types below) |
| `id` | string | No | Unique slide identifier. Auto-generated if omitted |
| `title` | string | Yes | Slide heading |
| `notes` | string | No | Speaker notes. The "so what" — never a summary of visible content |
| `data` | object | Yes | Type-specific payload |

---

## Slide Types

### `hero`

Title card with KPIs and RAG status. Always slide 1.

**Used by:** Status, Strategy, Kickoff

```json
{
  "type": "hero",
  "title": "Project Name",
  "notes": "string",
  "data": {
    "subtitle": "Sprint 2 of 8 | Phase Name",
    "rag": "green | yellow | red",
    "headline": "One sentence. Same as meta.headline.",
    "kpis": [
      {
        "label": "string",
        "value": "string",
        "icon": "lucide icon name",
        "trend": "up | down | flat | null"
      }
    ]
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `subtitle` | string | No | Sprint/phase indicator |
| `rag` | string | No | Same as `meta.rag` |
| `headline` | string | No | Same as `meta.headline` |
| `kpis` | array | No | Max 4. Only use metrics explicitly stated in source files |
| `kpis[].trend` | string | No | Status template only. Omit for strategy/kickoff |

---

### `context`

Settled ground or shared reality. The audience nods — no debate.

**Used by:** Strategy, Kickoff

```json
{
  "type": "context",
  "title": "Where We Are | What Everyone Agrees On",
  "notes": "string",
  "data": {
    "items": [
      {
        "title": "string",
        "body": "≤20 words",
        "icon": "lucide icon name",
        "status": "confirmed | in-progress | pending"
      }
    ]
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `items[].status` | string | No | Drives visual indicator (checkmark/spinner/clock). Kickoff convention: always `"confirmed"` |

**Also used for Success Criteria** — a second `context` slide with title `"How We Measure Success"`. Same schema, different content. Icons should be domain-specific (not generic checkmarks).

---

### `problem`

Tension with hierarchy. One dominant threat, supporting pressures.

**Used by:** Strategy, Kickoff

```json
{
  "type": "problem",
  "title": "The Complication | Why This Is Urgent",
  "notes": "string",
  "data": {
    "primary": {
      "title": "string",
      "body": "≤30 words",
      "icon": "lucide icon name",
      "severity": "critical | high | moderate"
    },
    "secondary": [
      {
        "title": "string",
        "body": "≤20 words",
        "icon": "lucide icon name",
        "severity": "critical | high | moderate"
      }
    ]
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `primary` | object | Yes | The one tension that matters most |
| `secondary` | array | No | Supporting pressures. Max 3 |
| `severity` | string | No | Reserve `"critical"` for items with a date or active failure state |

---

### `evidence`

Proof points with metrics and attribution.

**Used by:** Strategy, Kickoff

```json
{
  "type": "evidence",
  "title": "What the Evidence Shows | What We Already Know",
  "notes": "string",
  "data": {
    "points": [
      {
        "metric": "string — the number. E.g. '416 articles' or '85.5 hrs → 3.5 hrs'",
        "label": "string — what it measures",
        "source": "string — who produced or validated this",
        "type": "quantified | qualitative",
        "body": "≤20 words"
      }
    ]
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `metric` | string | No | Renders large — this is the visual anchor |
| `source` | string | No | Attribution builds trust |
| `type` | string | No | Quantified points get bolder treatment |

For transformation metrics (before → after), encode as a single string: `"85.5 hrs → 3.5 hrs"`. The renderer parses and emphasizes the delta.

---

### `framework`

Architecture or model with layered relationships. Components are not equal — they're layered by ownership.

**Used by:** Strategy

```json
{
  "type": "framework",
  "title": "The Architecture",
  "notes": "string",
  "data": {
    "lanes": [
      {
        "title": "string",
        "body": "≤20 words",
        "icon": "lucide icon name",
        "type": "control | influence | concern",
        "rank": 1
      }
    ]
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | string | No | `control` = directly owned. `influence` = can shape. `concern` = monitor only |
| `rank` | number | No | 1 = most foundational. Ascending outward |

Do not use framework for simple lists. If no relationships exist between components, use `context` instead.

---

### `grid`

Card grid for accomplishments (status) or deliverables (kickoff).

**Used by:** Status (as Accomplishments), Kickoff (as Deliverables)

```json
{
  "type": "grid",
  "title": "Accomplishments | What You're Getting",
  "notes": "string",
  "data": {
    "cards": [
      {
        "title": "string",
        "body": "≤20 words (accomplishments) | ≤25 words (deliverables)",
        "icon": "lucide icon name"
      }
    ]
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `cards` | array | Yes | **Not `items`** — the renderer expects `cards` |
| Max cards | — | — | Status: 4. Kickoff: 6 per page (auto-paginates) |

---

### `timeline`

Sprint/phase milestones with progress indicators.

**Used by:** Status, Kickoff

```json
{
  "type": "timeline",
  "title": "Roadmap | The Timeline",
  "notes": "string",
  "data": {
    "milestones": [
      {
        "label": "string — phase or sprint name",
        "date": "YYYY-MM-DD | null",
        "state": "done | current | upcoming",
        "detail": "≤20 words"
      }
    ],
    "progress": {
      "completed": 2,
      "total": 8,
      "percent": 25
    }
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `state` | string | No | Drives visual: checkmark (done), progress ring (current), empty circle (upcoming) |
| `progress` | object | No | Overall progress bar. Include when calculable |
| `date` | string | No | Use `null` if dates unknown. Timeline can show sequence without dates |

---

### `roadmap`

Higher-level phased plan. Same structure as timeline but used for strategy decks.

**Used by:** Strategy

Schema is identical to `timeline`. The difference is rhetorical: roadmap shows strategic phases, timeline shows sprint-level milestones.

---

### `pipeline`

Current sprint critical path. Strict rules apply.

**Used by:** Status

```json
{
  "type": "pipeline",
  "title": "In Progress",
  "notes": "string",
  "data": {
    "steps": [
      {
        "label": "Verb + Noun — e.g. 'Validate Triage Decisions'",
        "status": "done | current | next",
        "icon": "lucide icon name",
        "badges": ["optional context strings"],
        "blockers": ["optional blocker strings"]
      }
    ]
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `steps` | array | Yes | **Maximum 4.** No pagination — single slide view |
| `status` | string | No | `done`, `current`, or `next`. **Exactly one** step should be `"current"` |
| `icon` | string | No | Lucide icon for the step |
| `badges` | array | No | Omit key entirely if no badges |
| `blockers` | array | No | Blocker descriptions for this step |
| `label` | string | Yes | Must be Verb + Noun format |

---

### `blockers`

Named asks with severity and ownership. Always included — may have empty `items`.

**Used by:** Status, Strategy, Kickoff

```json
{
  "type": "blockers",
  "title": "Blockers & Asks | What We Need | What I Need — And What's Not In Scope",
  "notes": "string",
  "data": {
    "summary": {
      "actions": 1,
      "approvals": 1,
      "fyis": 1
    },
    "items": [
      {
        "text": "≤20 words",
        "severity": "action | approval | fyi",
        "owner": "named person or team",
        "due": "YYYY-MM-DD or descriptive string",
        "priority": "high | standard",
        "badges": ["optional timing context"]
      }
    ]
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `summary` | object | No | Left-panel counts. Typically used in kickoff decks |
| `items` | array | Yes | May be empty. **Never omit the blockers slide** |
| `severity` | string | Yes | `action` / `approval` / `fyi` |
| `owner` | string | No | Every action item should have a named owner. "The team" is not an owner |
| `due` | string | No | Due date or descriptive timing |
| `priority` | string | No | `"high"` / `"standard"` |
| `badges` | array | No | Timing context, escalation notes |

---

### `kpis`

Standalone KPI dashboard slide. Full-width metric cards with trends.

**Used by:** allHands, optionally others

```json
{
  "type": "kpis",
  "title": "Q1 CX Snapshot",
  "notes": "string",
  "data": {
    "items": [
      {
        "label": "NPS Score",
        "value": "61",
        "icon": "Heart",
        "trend": "up",
        "note": "Up 6 pts from Q4"
      }
    ]
  }
}
```

---

### `callout`

Quote, testimonial, or closing statement.

**Used by:** Kickoff (optional), allHands

```json
{
  "type": "callout",
  "title": "Voice of the Customer",
  "notes": "string",
  "data": {
    "text": "The quote or statement text",
    "kind": "decision | risk | quote | highlight",
    "attribution": "Named source"
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `kind` | string | No | `"decision"` / `"risk"` / `"quote"` / `"highlight"` |

---

### `agenda`

Meeting agenda with timed items.

**Used by:** allHands

```json
{
  "type": "agenda",
  "title": "Today's Agenda",
  "notes": "string",
  "data": {
    "items": [
      {
        "topic": "string",
        "time": "10 min",
        "owner": "string"
      }
    ]
  }
}
```

---

### `decision_log`

Decisions already made. Prevents relitigating.

**Used by:** Kickoff (optional)

```json
{
  "type": "decision_log",
  "title": "Decisions Made",
  "notes": "string",
  "data": {
    "items": [
      {
        "decision": "string",
        "date": "YYYY-MM-DD",
        "owner": "string",
        "status": "proposed | approved | blocked | done"
      }
    ]
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `status` | string | No | `"proposed"` / `"approved"` / `"blocked"` / `"done"` |

---

## Template Slide Matrix

Which slide types are used by which template, and when.

| Slide Type | Status | Strategy | Kickoff | allHands |
|---|---|---|---|---|
| `hero` | Always | Always | Always | Always |
| `context` | — | Always | Always | — |
| `problem` | — | Always | Always (≤20% energy) | — |
| `evidence` | — | Always | When ≥2 proof points | — |
| `framework` | — | When model exists | — | — |
| `grid` | When accomplishments qualify | — | Always (deliverables) | — |
| `timeline` | When dates/phases exist | — | Always | — |
| `roadmap` | — | When phases exist | — | — |
| `pipeline` | When current work distills to ≤4 steps | — | — | — |
| `blockers` | Always | Always | Always | — |
| `kpis` | — | — | — | When metrics exist |
| `callout` | — | — | Optional | Optional |
| `agenda` | — | — | — | When meeting has agenda |
| `decision_log` | — | — | Optional | — |

---

## Global Rules

- **Body fields:** 20 words max. Exceptions: `problem.primary.body` (30), `grid.cards.body` for deliverables (25)
- **Speaker notes:** Insight the presenter says that isn't on screen. Never a summary of visible content
- **JSON hygiene:** Omit empty arrays (except `blockers.items`). Omit keys with no value
- **No invention:** Every data point traceable to a source. Synthesis permitted. Fabrication is not
- **Slide inclusion:** Omit any slide type the source data can't support. An absent slide is better than a hollow one
- **Schema version:** Always `2`. Version 1 is deprecated

---

## Validation

The Pulse renderer validates incoming JSON against Zod schemas in `schema.ts`. Invalid JSON is rejected with specific error messages in the Editor's validation panel. Common validation failures:

- `meta.audience` must be one of: `exec`, `team`, `customer`, `mixed` (not `"operational"`)
- `meta.template` must be one of: `status`, `strategy`, `kickoff`, `allHands`, `requirements`, `custom`
- `grid.data` must use `cards` key (not `items`)
- `pipeline.data.steps` maximum 4 items
- `callout.data.kind` must be one of: `decision`, `risk`, `quote`, `highlight` (not `stat` or `insight`)
- `decision_log.data.items[].status` must be one of: `proposed`, `approved`, `blocked`, `done`

---

## Eyebrow Convention

The eyebrow label is not validated by Zod but is a strong skill convention. Skills should include `meta.eyebrow` in output JSON. The renderer reads it if present and falls back to template defaults if absent.

| Template | Eyebrow |
|---|---|
| Status | `"Project Update"` |
| Strategy | `"Strategy Briefing"` |
| Kickoff | `"Leadership Briefing"` |
| allHands | Template-specific |
