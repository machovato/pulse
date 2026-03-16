# Skill: /pulse-standup [project-name]

**Mode:** EXECUTE
**Purpose:** Generate a daily standup deck as structured JSON from current project state.
**Output:** Save JSON to a `pulse-decks/` subfolder within the project's folder as `[project-name]-Pulse-Standup-[TODAY].json`

---

## Design Principle

This is a daily tool, not a presentation. Speed over polish. The deck should take under 60 seconds to generate and under 5 minutes to walk through with a team.

**No rhetorical framework.** No SCQA, no punchline, no conviction evidence. Standups answer three questions: what got done, what's happening today, what's stuck.

**Sprint-scoped.** Only current sprint content. No project-level themes, no strategic framing, no historical accomplishments. Yesterday and today — that's the window.

**No quality filter on completions.** Unlike the status skill's accomplishment filter, standup completions include everything finished since the last standup — small tasks, admin work, whatever got done. The team needs to see the full picture, not an executive summary.

---

## Instructions

### Step 1 — Find the Project

Search the vault for a project matching `[project-name]`. Look for:
- A folder whose name matches or contains the project name
- A standalone file whose name matches the project name
- Any reasonable location the vault uses for projects

Do not assume a specific folder path.

**If no match is found**, stop with:
```
SKILL STOPPED: No project found matching '[project-name]'.
```

### Step 2 — Determine Sprint Context

Read the project files and identify:
- **Current sprint or phase** — name, number, dates if available
- **Sprint goal** — what this sprint is trying to achieve (if stated)
- **Days remaining** — if sprint dates exist, calculate how many working days are left

If no sprint structure exists, use "Current Work" as the phase label. The skill still works without sprints — it just loses the countdown context.

### Step 3 — Gather Yesterday's Completions

Find tasks, items, or work completed since the last working day. Sources:
- Task lists (completed items with recent dates or checkmarks)
- Daily notes or journal entries
- Status updates or changelogs
- Commit messages or activity logs

**Include everything.** No significance filter. If it got done, it goes on the slide. The team needs full visibility, not curated highlights.

**Per-person attribution when available.** If the vault tracks who completed what, include the person's name. Standups are person-aware — "Alex finished the API review" is more useful than "API review completed."

**Maximum 6 items.** If more than 6 were completed, group related items (e.g., "3 articles converted" instead of listing each one).

### Step 4 — Gather Today's Focus

Find tasks, items, or work planned for today. Sources:
- Open tasks tagged as current sprint
- Items marked as in-progress or next
- Today's calendar or daily plan if available

**Maximum 4 items.** The pipeline slide enforces this. Prioritize by downstream impact — what, if delayed today, would slow someone else tomorrow?

**Exactly one item marked `current`.** The single most important thing for today. Everything else is `next`.

**Labels must be Verb + Noun.** Same rule as status pipeline — specific enough that the team knows exactly what's happening. "Review PR" not "Code stuff."

### Step 5 — Gather Blockers

Find anything stuck, waiting, or at risk. Sources:
- Explicitly flagged blockers in task lists
- Items with no progress over multiple days
- Dependencies on other people or teams
- Decisions needed before work can continue

**Include even minor blockers.** Standups surface problems early — a "small" blocker mentioned Monday prevents a "big" blocker on Thursday.

### Step 6 — Gather Parking Lot Items

Check for topics that need deeper discussion outside standup. Sources:
- Blocker items that are too complex for a 15-word card
- Decisions that require more than the people in the room
- Technical discussions flagged in task comments or notes
- Carryover items from previous standups that haven't been scheduled

**These are not blockers.** Blockers stop work. Parking lot items need conversation but aren't stopping anyone today. If something is both — it's a blocker first, parking lot second.

If no parking lot items exist, include the slide with zero cards. The facilitator still asks the question.

### Step 7 — Determine Sprint Confidence

Assess overall sprint health based on what you've gathered:
- **Green:** On track. No blockers stopping committed work.
- **Yellow:** Minor risks. Blockers exist but workarounds are available or help is coming.
- **Red:** Sprint goal at risk. Committed work is blocked with no clear resolution.

This is a quick pulse, not a deep RAG analysis. If in doubt, go yellow — it surfaces the conversation without sounding an alarm.

### Step 8 — Generate the JSON

**Slide sequence — always 5 slides:**

| Slide | Type | Eyebrow | Title | Always? |
|---|---|---|---|---|
| 1 | `hero` | _(from meta.eyebrow)_ "Daily Standup" | [Project Name] | Yes |
| 2 | `grid` | "Completed" | Yesterday | Yes (may have 0 items) |
| 3 | `pipeline` | "Pipeline" | Today | Yes |
| 4 | `blockers` | "Blockers" | Asks & Blockers | Yes (may be empty) |
| 5 | `grid` | "Discussion Items" | Parking Lot | Yes (may be empty) |

All five slides are always included. Even an empty parking lot is spoken to — the facilitator asks "Anything that needs a separate conversation?" before closing. This is a best practice from the Scrum Guide: topics too deep for 15 minutes get captured, not lost.

**Eyebrow logic:** The hero slide inherits from `meta.eyebrow` ("Daily Standup") to set meeting context once. Slides 2–5 set `slide.data.eyebrow` explicitly to describe the slide's role — not repeat the meeting type. The eyebrow frames the content; the title names it.

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
    "eyebrow": "Daily Standup",
    "date": "YYYY-MM-DD",
    "audience": "team",
    "template": "standup",
    "theme": "blue",
    "rag": "green | yellow | red",
    "headline": "The Sprint Goal — what the team is trying to achieve this sprint."
  },
  "slides": []
}
```



### Slide 1: `hero`

Sprint context and confidence. The headline is the Sprint Goal — connecting daily work to what the sprint is trying to achieve.

```json
{
  "type": "hero",
  "title": "[Project Name]",
  "notes": "State the sprint goal. This deck is a mirror for the team, not a report to the boss — the facilitator surfaces progress and blockers, the team owns the conversation. If yellow/red, say why in one sentence.",
  "data": {
    "subtitle": "Sprint 2 of 8 | Day 4 of 10",
    "rag": "green | yellow | red",
    "headline": "Sprint Goal — e.g. 'Complete pilot conversion of 40 articles to Zendesk staging'",
    "kpis": [
      { "label": "Sprint", "value": "2 of 8", "icon": "calendar" },
      { "label": "Days Left", "value": "6", "icon": "clock" }
    ]
  }
}
```

**Eyebrow:** Not set at slide level — inherits `meta.eyebrow` ("Daily Standup") via the cascade.

**KPI guidance:** Sprint number + days remaining are the core KPIs. Add a third only if there's a hard metric (e.g., "Articles Remaining: 28"). Don't invent metrics — two strong KPIs beat four weak ones.

### Slide 2: `grid` (Yesterday)

What got done since last standup.

```json
{
  "type": "grid",
  "title": "Yesterday",
  "notes": "What the team completed. No filter — full visibility.",
  "data": {
    "eyebrow": "Completed",
    "cards": [
      {
        "title": "Task or accomplishment",
        "body": "≤15 words. What was done. Include person name if known.",
        "icon": "lucide icon name"
      }
    ]
  }
}
```

**Body limit: 15 words** (tighter than status's 20 — standup cards should be scannable in 2 seconds).

If nothing was completed, include the slide with zero cards. The renderer handles empty grids gracefully.

### Slide 3: `pipeline` (Today)

What's in focus today.

```json
{
  "type": "pipeline",
  "title": "Today",
  "notes": "The focus for today. One item is current — the rest are next.",
  "data": {
    "eyebrow": "Pipeline",
    "steps": [
      {
        "label": "Verb + Noun",
        "status": "current | next",
        "badges": ["optional — person name, time estimate, dependency"]
      }
    ]
  }
}
```

**Same pipeline rules as status:** Max 4 steps. Exactly one `current`. Verb + Noun labels. No pagination.

### Slide 4: `blockers`

What's stuck or needs routing.

```json
{
  "type": "blockers",
  "title": "Asks & Blockers",
  "notes": "Surface early. Not everything here is a full stop — some are asks that need routing to the right person.",
  "data": {
    "eyebrow": "Blockers",
    "items": [
      {
        "text": "≤15 words. What's stuck and what's needed.",
        "severity": "action | approval | fyi",
        "owner": "named person or team"
      }
    ]
  }
}
```

**Body limit: 15 words.** Standups are fast — if the blocker needs more than 15 words to explain, it needs its own meeting, not a standup card.

May be empty. An empty blockers slide is a good sign.

### Slide 5: `grid` (Parking Lot)

Topics that surfaced during standup needing a deeper conversation outside the 15-minute timebox.

```json
{
  "type": "grid",
  "title": "Parking Lot",
  "notes": "Always spoken to, even when empty. Ask: 'Anything that needs a separate conversation?' Capture topics here — they get their own meeting, not standup airtime.",
  "data": {
    "eyebrow": "Discussion Items",
    "cards": [
      {
        "title": "Topic needing discussion",
        "body": "≤15 words. Who's involved and why it can't be resolved in standup.",
        "icon": "lucide icon name"
      }
    ]
  }
}
```

**Always included, even with zero cards.** The facilitator speaks to this slide every standup — it's the prompt that prevents meetings from running over. If topics exist from previous standups that haven't been scheduled yet, carry them forward.

---

## Rules

### Output
- Write raw JSON to the `pulse-decks/` subfolder as `[project-name]-Pulse-Standup-[TODAY].json`
- Your conversational response is **only** a save confirmation and file link

### Content
- **15-word body limit** for all fields (tighter than other skills)
- **No invention.** If yesterday's completions can't be determined from vault sources, say so — don't guess
- **Person names when available.** Standups are person-aware
- **Sprint-scoped only.** No project-level history, no accomplishments from previous sprints
- **No speaker notes philosophy.** Notes can be brief — "Walk the board" is fine

### Deck Title
- Format: `[Project Name] — Sprint N of N` when sprint structure exists. Just `[Project Name]` when it doesn't.
- No date in the title — `meta.date` handles that.
- No template type in the title — the Pulse UI already shows template type under the deck icon.

### JSON Hygiene
- Omit empty arrays except `blockers.items`
- Schema version: Always `2`
- Eyebrow: `meta.eyebrow` is always `"Daily Standup"`. Slides 2–5 set `slide.data.eyebrow` explicitly
- Hero slide does NOT set `slide.data.eyebrow` — it inherits from meta

### Cadence
- This skill is designed to run daily. The output file includes today's date in the filename, so yesterday's standup is preserved but not overwritten
- If run twice in one day, the second run overwrites the first (same filename)

### Post-Save
- After saving, provide a direct link so the user can view/download