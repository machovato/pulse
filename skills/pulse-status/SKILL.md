# Skill: /pulse-status [project-name]

**Mode:** EXECUTE
**Purpose:** Generate a structured JSON status presentation for any project in the vault.
**Output:** Save JSON to the project's `pulse-decks/` folder as `[project-name]-Pulse-Status-[TODAY].json`

---

## Design Principle

This skill fails loudly rather than fails convincingly. If the project cannot support a credible status deck, say so and stop. A polished deck built on inference is worse than no deck at all.

**No invention. Synthesis is permitted.** You may reframe, combine, and interpret data from sources — that's the skill's value. You may not fabricate data points, invent metrics, or fill gaps with plausible guesses. If you can't find it, flag it as MISSING.

**Cite everything.** Every data point in the output must be traceable to a source. When extracting, mentally tag where each fact came from. If challenged, you should be able to point to the file and passage.

---

## Instructions

### Step 1 — Find the Project

Search the vault for a project matching `[project-name]`. Look for:
- A folder whose name matches or contains the project name
- A standalone file whose name matches the project name
- Any reasonable location the vault uses for projects

Do not assume a specific folder path. The vault may organize projects in any structure.

**If no match is found**, stop with:
```
SKILL STOPPED: No project found matching '[project-name]'.
I searched the vault and could not locate a matching project folder or file.
```

**If multiple matches are found**, stop with:
```
SKILL STOPPED: Multiple projects match '[project-name]': [list them].
Please specify the exact project name.
```

### Step 2 — Gather Project State

Read the project files. You are looking for these data points — not all will exist, and that's fine. Gather what's available.

| Data Point | What You're Looking For |
|---|---|
| **Project identity** | Name, one-sentence summary, current phase or sprint |
| **Timeline** | Phases, sprints, milestones with dates and status (done/current/upcoming) |
| **Accomplishments** | Completed work that materially changed delivery, scope, decisions, risk, or evidence |
| **Current work** | Active tasks, in-progress deliverables, current sprint focus |
| **Blockers & asks** | Anything blocked, any decisions needed, any dependencies on others |
| **Metrics / KPIs** | Hard numbers explicitly stated in project files — do not calculate or invent |
| **Team** | Named people with roles, especially owners of blockers |

**Source priority when data conflicts:**
- Dates and timeline → charter or sprint plan wins
- Project goals and context → root project file wins
- Current narrative → most recent status update wins
- Execution state → task list wins
- Meeting notes → supporting evidence only, never primary

### Step 3 — Determine RAG Status

RAG is determined by evidence, not vibes.

| RAG | Definition |
|---|---|
| **Green** | No active `action` or `approval` severity blockers. Progress is on track. |
| **Yellow** | Active blocker exists but work continues. Progress is slowed, not halted. |
| **Red** | Active blocker is stopping a committed deliverable or deadline. Critical path is halted. |

If RAG is yellow or red, the hero slide speaker notes **must** open with a one-sentence justification.

### Step 4 — Apply the Accomplishment Quality Filter

Do not pass raw completed tasks to the accomplishments slide. A completed item qualifies ONLY if it passes both tests:

**Test 1 — Completion:** The item is clearly finished, approved, validated, delivered, or resolved. Not in progress, not drafted, not under review.

**Test 2 — Significance:** The completed item materially changed at least one of: delivery progress, scope clarity, decision clarity, stakeholder alignment, evidence/confidence, risk level, dependency status, readiness for next phase, or measurable business value.

If it only reflects effort or activity, it fails.

**Maximum 4 accomplishment cards.** If more qualify, rank by: quantifiable outcomes first, then risks retired, then major decisions, then milestone completions.

**Wording rule:** Rewrite task language into executive framing — what changed, why it matters, what is now possible. Never invent impact that isn't in the source.

### Step 5 — Build Pipeline (if applicable)

The pipeline shows current-phase critical path. Strict rules:

1. **Maximum 4 steps.** Prioritize by downstream impact.
2. **Current phase only.** Do not project future-phase work.
3. **Exactly one step marked `current`.** The one with the most downstream dependencies.
4. **Labels must be Verb + Noun.** Specific enough that leadership knows exactly what is happening.

If pipeline data is ambiguous, follow this fallback:
1. Explicit current sprint deliverables → use those
2. Else: open tasks tied to current milestone → use those
3. Else: latest status narrative's active work → use those
4. Else: omit pipeline slide entirely

Better no pipeline than a fabricated one.

### Step 6 — Encode the JSON

Generate the deck JSON. Every slide must earn its place by improving executive understanding of the project.

**Slide sequence:**

| Slide | Type | Eyebrow | Title | Always? |
|---|---|---|---|---|
| 1 | `hero` | _(from meta.eyebrow)_ "Project Update" | [Project Name] | Yes |
| 2 | `grid` | "Completed" | Accomplishments | No — only if ≥1 item passes quality filter |
| 3 | `pipeline` | "Pipeline" | In Progress | No — only if active work distills into ≤4 valid steps |
| 4 | `timeline` | "Progress" | Roadmap | No — only if dated milestones or phases exist |
| 5 | `blockers` | "Blockers" | Asks & Blockers | Yes — may have empty `items` array |

**Eyebrow logic:** The hero slide inherits from `meta.eyebrow` ("Project Update") to set meeting context once. All other slides set `slide.data.eyebrow` explicitly to describe the slide's role — not repeat the meeting type.

**Slide inclusion rules:**

| Slide | Always? | Include When | Omit When |
|---|---|---|---|
| **Hero** | Yes | Always | Never |
| **Timeline** | No | Dated milestones or sequential phases exist | No dates AND no phase structure |
| **Grid (Accomplishments)** | No | ≥1 item passes the quality filter | No qualifying accomplishments |
| **Pipeline** | No | Active work distills into ≤4 valid steps | Insufficient data or ambiguous |
| **Blockers** | Yes | Always — may have empty `items` array | Never omit |

### Final Step — Deliver to Pulse

Create a `pulse-decks/` subfolder in the project folder if it doesn't exist, and write the JSON file there. Then:

1. If the `pulse_create_deck` tool is available, call it with the full JSON string.
   Report the returned deck URL to the user.

2. If the tool is not available or fails, the JSON file is already saved.
   Tell the user: "Open http://localhost:3000, click New Deck, and paste the JSON."

The MCP delivery is best-effort. The saved file is the guarantee.

---

## Output Schema

```json
{
  "schemaVersion": 2,
  "meta": {
    "title": "[Project Name] — Sprint N of N",
    "eyebrow": "Project Update",
    "date": "YYYY-MM-DD",
    "audience": "exec",
    "template": "status",
    "theme": "blue",
    "rag": "green | yellow | red",
    "headline": "One sentence. Strategic momentum, not operational detail."
  },
  "slides": []
}
```

### Slide Type: `hero`

Always slide 1.

```json
{
  "type": "hero",
  "title": "[Project Name]",
  "notes": "GENERATE NOTE ANSWERING: 'What is the single most important thing leadership should take away from this update, and has anything changed since the last one?' If RAG is yellow or red, the first sentence MUST justify the status with a specific blocker or risk. If green, state what momentum looks like right now — not 'on track' but what concretely moved. Example: 'We closed Sprint 3 with all committed items delivered. The pipeline conversion is ahead of schedule, which gives us buffer for the SME review bottleneck we expect in Sprint 5.'",
  "data": {
    "subtitle": "Sprint X of Y | Phase Name",
    "rag": "green | yellow | red",
    "headline": "Same as meta.headline.",
    "kpis": [
      { "label": "string", "value": "string", "icon": "lucide icon name", "trend": "up | down | flat | null" }
    ]
  }
}
```

**KPI rule:** Only use metrics explicitly stated in project files. Do not calculate percentages from raw task counts. Weak KPIs are worse than no KPIs. If no hard metrics exist, use fewer KPIs or omit the array.

**Trend:** Use `"up"` when the metric has improved since last update, `"down"` when it's declined, `"flat"` when unchanged, or omit entirely if trend data isn't available.

### Slide Type: `timeline`

```json
{
  "type": "timeline",
  "title": "Roadmap",
  "notes": "GENERATE NOTE ANSWERING: 'Are we where we expected to be at this point, and what's the next date that matters?' Call out whether the current phase is on schedule, ahead, or behind. Identify the next milestone with a hard date and explain what makes that date firm (external dependency, business event, or commitment). If a completed milestone retired a risk, say so. Example: 'Phase 1 closed on time — that's the audit and taxonomy work. We're midway through Phase 2 with 60% of conversions done. March 28 is the next gate — if SME reviews aren't complete by then, Sprint 5 slips.'",
  "data": {
    "eyebrow": "Progress",
    "milestones": [
      { "label": "string", "date": "YYYY-MM-DD | null", "state": "done | current | upcoming", "detail": "≤20 words" }
    ]
  }
}
```

**State determination:**
- Past end date + evidence of completion → `done`
- Past end date but work still active → `current` (flag as overdue in detail)
- Between start and end → `current`
- Future → `upcoming`

If dates exist only as quarters or ranges, normalize to the best specific date. If not possible, use `null`.

### Slide Type: `grid` (Accomplishments)

```json
{
  "type": "grid",
  "title": "Accomplishments",
  "notes": "GENERATE NOTE ANSWERING: 'Which of these accomplishments changed the project's risk profile or unlocked the next phase, and why should leadership care?' Don't repeat what the cards say — explain the strategic consequence. If an accomplishment retired a blocker from a previous update, connect them. If one accomplishment is clearly more important than the others, lead with it. Example: 'The taxonomy approval is the big one — it means the conversion pipeline has a validated target structure, not a guess. Without that, every article we converted would have needed re-categorization later.'",
  "data": {
    "eyebrow": "Completed",
    "cards": [
      { "title": "string", "body": "≤20 words. What was done and why it matters.", "icon": "lucide icon name" }
    ]
  }
}
```

### Slide Type: `pipeline`

```json
{
  "type": "pipeline",
  "title": "In Progress",
  "notes": "GENERATE NOTE ANSWERING: 'Which step on this pipeline has the highest risk of slipping, and what would that delay?' Identify the step with the most dependencies or the tightest timeline. If work is ahead of schedule, say what created the buffer. If a step depends on an external team, name them. Example: 'Validate Triage Decisions is current and on track, but Convert Priority Articles is where the bottleneck lives — it requires SME time from Justin's team, and that's the resource we don't fully control.'",
  "data": {
    "eyebrow": "Pipeline",
    "steps": [
      { "label": "Verb + Noun", "status": "current | next", "badges": ["optional context"] }
    ]
  }
}
```

### Slide Type: `blockers`

```json
{
  "type": "blockers",
  "title": "Asks & Blockers",
  "notes": "GENERATE NOTE ANSWERING: 'What is the one ask that, if resolved this week, would have the biggest impact on the project timeline?' Frame blockers as requests, not complaints. For each action item, state what it unblocks — the audience needs to understand the consequence of inaction, not just the existence of the problem. If there are no blockers, say what that means for momentum. Example: 'The API access approval is the critical ask — without it by Friday, the integration testing in Sprint 4 can't start on schedule and we lose the buffer we built in Sprint 3.'",
  "data": {
    "eyebrow": "Blockers",
    "items": [
      { "text": "≤20 words.", "severity": "action | approval | fyi", "owner": "named person or team", "badges": ["optional timing context"] }
    ]
  }
}
```

---

## Rules

### Output
- Write raw JSON to the `pulse-decks/` subfolder as `[project-name]-Pulse-Status-[TODAY].json`. Create the `pulse-decks/` folder if it doesn't exist. Valid JSON only — no preamble, no markdown fences.
- Your conversational response is **only** a save confirmation and file link. Do not output JSON in chat.

### Content Quality
- Every body field: **20 words maximum.** Cut ruthlessly.
- **No invention.** If a field cannot be determined from vault sources, omit it or use `null`.
- **Speaker notes** provide the "so what" behind the data. Not a summary of what's on the slide. The insight that makes the presenter sound fluent.

### Pagination
- No data array has a hard limit EXCEPT pipeline (max 4 steps). The app paginates automatically.

### JSON Hygiene
- Omit empty arrays (except blockers `items`, which may be empty).
- Omit keys with no value.
- If a pipeline step has no badges, omit `badges` entirely.

### Deck Title
- Format: `[Project Name] — Sprint N of N` when sprint structure exists. Just `[Project Name]` when it doesn't.
- No date in the title — `meta.date` handles that.
- No template type in the title — the Pulse UI already shows template type under the deck icon.

### Eyebrow
- `meta.eyebrow` is always `"Project Update"`. Hero inherits from meta.
- Slides 2–5 set `slide.data.eyebrow` explicitly per the slide sequence table above.
- The eyebrow describes the slide's role, not the meeting type.

### Stale Data
- If the most recent project update is older than 14 days, note staleness in hero `notes`.

### Post-Save
- After saving, provide a direct link so the user can view/download.