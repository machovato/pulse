# Skill: /pulse-strategy [project-name]

**Mode:** EXECUTE
**Purpose:** Generate a strategy briefing deck as structured JSON from project source material.
**Output:** Save JSON to a `pulse-decks/` subfolder within the project's folder as `[project-name]-Pulse-Strategy-[TODAY].json`

---

## Design Principle

This skill fails loudly rather than fails convincingly. If the source material cannot support a conviction-level deck, say so and stop. A polished deck built on weak evidence is worse than no deck at all.

**No invention. Synthesis is expected.** Strategy decks interpret and frame — that's the skill's value. You may reframe data into arguments, combine evidence into themes, and construct narrative arcs from source material. You may not fabricate data points, invent metrics, or attribute quotes to people who didn't say them. If you synthesize, you must be able to point to the sources you synthesized from.

**SCQA is the backbone.** Every strategy deck follows the Situation → Complication → Question → Answer arc. The Punchline states the Answer upfront. The slides earn it through evidence.

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

### Step 2 — Identify the Strategy Source

Read the project files. Identify the primary strategy document — the one that contains the argument, evidence, and stakeholder context. This might be:
- A strategy brief or proposal
- A charter with strategic framing
- A project overview with goals, evidence, and asks
- Discovery findings or stakeholder interview synthesis

If multiple documents exist, use the one with the strongest combination of: quantified evidence, named stakeholders, and explicit tensions or recommendations.

### Step 3 — Minimum Viable Source Check

Before generating anything, verify all three conditions:

| Check | Required | What qualifies |
|---|---|---|
| **Quantified fact** | At least 1 | A number, date, metric, count, or measured outcome |
| **Identifiable tension** | At least 1 | Something broken, changing, at risk, or in conflict |
| **Named stakeholder** | At least 1 | A person with a specific decision to make |

**If any condition is missing — stop:**

```
SKILL STOPPED: Source document is not ready for a conviction-level deck.

Missing:
- [list what's absent]

What's needed before this skill can generate:
- [specific guidance on what to add to the source document]
```

### Step 4 — Run the SCQA Framework

Extract each component from the source material. Do not invent. If a component cannot be found, note it as absent before proceeding.

#### PUNCHLINE
One sentence. The conclusion stated upfront — what the stakeholder should believe or decide after seeing this deck. Sharp and specific. Not "we are well-positioned" — that proves nothing.

The Punchline is the billboard on slide 1. It is NOT the same as the Answer in SCQA — the Answer is earned through the arc. The Punchline is stated immediately.

Test: if the stakeholder saw only this sentence and nothing else, would they know what this deck is arguing? If no — rewrite it.

#### SITUATION
The stable truth everyone agrees on. No argument yet. Context and current state. The audience should nod.

#### COMPLICATION
What disrupts the situation. Something broken, at risk, or changing. Creates urgency.

This is the most dangerous extraction step. If the source does not contain an explicit tension, **flag it rather than inventing one.**

**So What Filter:** Before proceeding — "Why would the stakeholder care about this complication?" If the answer is "it's interesting" rather than "it blocks something they are accountable for" — the complication is wrong. Re-read and find the real one.

#### QUESTION
The question the complication raises. What must be decided or resolved.

#### ANSWER
Your recommendation. The conclusion the deck builds toward through evidence. The SCQA arc earns this — the Punchline stated it upfront.

#### CONVICTION EVIDENCE
Up to 3 evidence points that prove the Answer. Apply this standard:

- Quantified where the source supports it — numbers, metrics, dates, counts, measured outcomes
- Qualitative signals count when specific and attributable: "Justin Keller confirmed EU products were missing" is evidence. "Multiple stakeholders confirmed" is not.
- If fewer than 2 evidence points can be quantified, flag it: "Source document may not support a conviction-level deck. Recommend strengthening evidence base before presenting."
- Do not stretch soft data points to look quantified. Do not skip strong qualitative signals because they lack a number.

#### THE ASK
What explicit action, decision, or alignment does the stakeholder need to provide? Must be:
- Named — who specifically
- Specific — what exactly
- Consequential — what happens if they don't act

If no ask exists in the source, flag it: "A strategy deck with no ask is a report, not a presentation. Identify what you need from the stakeholder before generating."

### Step 5 — Encode Presentation Intent

Before generating JSON, determine how each slide communicates its content.

#### Context → "Settled ground"
The reader should feel oriented and assured. This is consensus, not argument.

- Each item gets a `status` field: `confirmed` (stakeholder-validated), `in-progress` (active, on track), or `pending` (acknowledged but not started).
- Status must be determinable from the source. If an item's status cannot be determined, use `confirmed` only if the source explicitly states agreement. Otherwise omit the item — do not guess.
- Order by status: confirmed first, in-progress second, pending last.

#### Problem → "Tension with hierarchy"
The reader should feel urgency, with one dominant threat and supporting pressures.

- Identify the **primary** complication — the one the stakeholder is most directly accountable for, or the one with the nearest forcing function. This becomes `primary`.
- Remaining complications become `secondary` items.
- Each gets a `severity` field: `critical`, `high`, or `moderate`.
- **Do not make everything critical.** Reserve `critical` for items with a date or an active failure state in the source.
- Ask: "If the stakeholder could only hear one problem, which one?" That's primary.

#### Evidence → "Proof with authority"
The reader should feel convinced. Numbers lead, narrative supports.

- Each point gets `metric` (the number), `label` (what it measures), `source` (who produced it).
- `type`: `quantified` or `qualitative`.
- For transformation metrics (before → after), encode as single string: `"85.5 hrs → 3.5 hrs"`.
- **The metric is the headline.** If you're writing a long body and a weak metric, the evidence point isn't strong enough.
- Order by proof strength: quantified first, qualitative second.

#### Framework → "Relationships, not a list"
Only include if the source contains a structured model with relationships between components.

- Each lane gets `type`: `control` (directly owned), `influence` (can shape), `concern` (monitor only).
- `rank`: 1 = most foundational, ascending outward.
- **Do not use framework for simple lists.** If components don't have relationships, use `context` instead.

#### Roadmap → "Sequenced phases"
Milestones with `state` (done/current/upcoming) carry presentation intent natively.

#### Blockers → "Named asks"
Items with `severity`, `owner`, and optional `badges` carry presentation intent natively.

### Step 6 — Generate the JSON

Only after completing Steps 1-5, generate the deck JSON. Every slide must earn its place by advancing the argument toward the Punchline.

**Slide selection logic:**

| Slide Type | Purpose | Include when |
|---|---|---|
| `hero` | Punchline + context | Always — slide 1 |
| `context` | Situation from SCQA | Always — sets stable ground |
| `problem` | Complication from SCQA | Always — creates urgency |
| `evidence` | Conviction evidence | Always — proves the answer |
| `framework` | Architecture or model | Source contains a model with component relationships |
| `roadmap` | Phased plan | Source contains phases |
| `pipeline` | Active workstreams | Source contains current initiatives |
| `blockers` | The Ask | Always — makes the ask explicit |

Do not include a slide type if the source does not support it. Omit rather than fabricate.

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
    "title": "[Project Name] — Strategy Briefing",
    "eyebrow": "Strategy Briefing",
    "subtitle": "[Punchline — one sentence]",
    "date": "YYYY-MM-DD",
    "audience": "exec",
    "template": "strategy",
    "theme": "obsidian",
    "rag": "green | yellow | red",
    "headline": "Same as subtitle — the punchline."
  },
  "slides": []
}
```

### Slide Type: `hero`

Always slide 1. Punchline on arrival.

```json
{
  "type": "hero",
  "title": "[Project Name]",
  "notes": "State the punchline and why it matters now. What is the forcing function?",
  "data": {
    "subtitle": "[Punchline]",
    "rag": "green | yellow | red",
    "headline": "[Punchline]",
    "kpis": [
      { "label": "string", "value": "string", "icon": "lucide icon name" }
    ]
  }
}
```

### Slide Type: `context`

Rhetorical job: **Settle the reader.** Stable ground. Consensus.

```json
{
  "type": "context",
  "title": "Where We Are",
  "notes": "The Situation from SCQA. What does everyone agree on?",
  "data": {
    "items": [
      {
        "title": "string",
        "body": "≤20 words. Factual, uncontested.",
        "icon": "lucide icon name",
        "status": "confirmed | in-progress | pending"
      }
    ]
  }
}
```

### Slide Type: `problem`

Rhetorical job: **Create urgency.** One dominant tension, supporting pressures.

```json
{
  "type": "problem",
  "title": "The Complication",
  "notes": "What disrupts the stable ground? This is the emotional engine of the deck.",
  "data": {
    "primary": {
      "title": "string",
      "body": "≤30 words. The main tension.",
      "icon": "lucide icon name",
      "severity": "critical | high | moderate"
    },
    "secondary": [
      {
        "title": "string",
        "body": "≤20 words.",
        "icon": "lucide icon name",
        "severity": "critical | high | moderate"
      }
    ]
  }
}
```

### Slide Type: `evidence`

Rhetorical job: **Build conviction.** Numbers are the headline.

```json
{
  "type": "evidence",
  "title": "What the Evidence Shows",
  "notes": "Lead with the strongest quantified evidence. Attribution separates evidence from assertion.",
  "data": {
    "points": [
      {
        "metric": "string — the number or outcome",
        "label": "string — what it measures",
        "source": "string — who produced or validated this",
        "type": "quantified | qualitative",
        "body": "≤20 words. What this evidence proves."
      }
    ]
  }
}
```

### Slide Type: `framework`

Rhetorical job: **Show relationships.** Components layered by ownership.

```json
{
  "type": "framework",
  "title": "The Architecture",
  "notes": "Only include if source contains a structured model with relationships.",
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

### Slide Type: `roadmap`

Rhetorical job: **Show sequenced time.**

```json
{
  "type": "roadmap",
  "title": "The Path",
  "notes": "Phased plan. What sequencing logic determines the order?",
  "data": {
    "milestones": [
      {
        "label": "string",
        "date": "YYYY-MM-DD or null",
        "state": "done | current | upcoming",
        "detail": "≤20 words"
      }
    ]
  }
}
```

### Slide Type: `blockers`

Rhetorical job: **Make the ask explicit.**

```json
{
  "type": "blockers",
  "title": "What We Need",
  "notes": "The Ask made explicit. Every item is an action, approval, or awareness.",
  "data": {
    "items": [
      {
        "text": "≤20 words. Specific ask.",
        "severity": "action | approval | fyi",
        "owner": "named person",
        "badges": ["optional timing context"]
      }
    ]
  }
}
```

---

## Rules

### Output
- Write raw JSON to the `pulse-decks/` subfolder as `[project-name]-Pulse-Strategy-[TODAY].json`. Valid JSON only — no preamble, no markdown fences.
- Your conversational response is **only** a save confirmation and file link. Do not output JSON in chat.

### Content Quality
- Every body field: **20 words maximum.** Exception: `problem.primary.body` allows 30 words.
- **No invention.** Synthesis from sources is the skill's value. Fabrication is not. If you synthesize a claim, you must be able to point to the sources you drew from.
- **Speaker notes** provide the "so what" behind the data. The insight that makes the presenter sound fluent. Not a summary of visible content.

### Slide Selection
- Omit any slide type the source cannot support. Never fabricate content to fill a slide.
- A strategy deck with no ask is a report, not a presentation.

### JSON Hygiene
- Omit empty arrays and optional fields entirely. An absent key is cleaner than an empty value.
- Schema version: Always `2`.

### Eyebrow
- Always `"Strategy Briefing"`. Hardcoded — do not vary.

### RAG Status
- `green` = no active blockers requiring stakeholder action
- `yellow` = action items pending or risks identified
- `red` = decision required before work can continue

### Stale Data
- If the most recent project update is older than 14 days, note staleness in hero `notes`.

### Post-Save
- After saving, provide a direct link so the user can view/download.

---

## Strategy vs. Status vs. Kickoff — When to Use Which

| Dimension | `/pulse-strategy` | `/pulse-status` | `/pulse-kickoff` |
|---|---|---|---|
| **Audience** | Decision-maker (sponsor, ELT) | Stakeholders (recurring update) | Execution team (directors, leads) |
| **Purpose** | Persuade — build conviction | Inform — show progress | Brief — create alignment |
| **Core question** | "What should I believe?" | "Are we on track?" | "What do I need to do?" |
| **SCQA** | Full arc — the backbone | Not used | Compressed — anchor only |
| **Problem slide weight** | 30-40% of deck energy | Not included | ≤20% — anchor, don't argue |
| **Evidence purpose** | Proves the recommendation | Not included (accomplishments instead) | Establishes credibility |
| **Key slide** | `blockers` (ask upward) | `pipeline` (what's active) | `blockers` (ask laterally) |
| **Leash length** | Longest — synthesis expected | Medium — cite everything | Shortest — charter-bound |
| **Tone** | Commanding, authoritative | Factual, momentum-forward | Organized, decisive, collaborative |