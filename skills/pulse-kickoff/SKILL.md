# Skill: /pulse-kickoff [project-name]

**Mode:** EXECUTE
**Purpose:** Generate a kickoff briefing deck as structured JSON from a project charter
**Output:** Save JSON to the project's `pulse-decks/` folder as `[project-name]-Pulse-Kickoff-[TODAY].json`

---

## Design Principle

This skill fails loudly rather than fails convincingly. If the charter cannot support a credible operational briefing, say so and stop. A polished deck built on vague plans is worse than no deck at all.

**Presentation Intent Principle:** Every slide type has an operational job. The JSON must encode not just *what* to show, but *how* the renderer should communicate it. A context slide anchors shared reality. A deliverables slide sets expectations. A timeline slide creates accountability. A blockers slide assigns commitments. The data structure for each type is shaped by its operational function.

**Audience Distinction:** This is not a strategy deck. The argument has already been won — the sponsor endorsed the charter. This deck briefs the people who will *execute or support* the work. They need to leave the room knowing: what's being built, why it matters to their team, what lands when, and what you need from them specifically.

---

## Instructions

### Step 1 — Read the Charter (Primary Source)

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

Once the project folder is located, read all files present. Identify the **charter document** — the one that contains scope, deliverables, timeline, roles, dependencies, and success criteria.

**Source hierarchy — this is binding:**

1. **Charter** — primary source. Every slide must be traceable to charter content. If the charter doesn't say it, the slide doesn't show it.
2. **Vault files** (project page, Tasks.md, person pages) — supplement only. Used to determine current state (what's done vs. upcoming) and to fill in operational detail the charter references but doesn't elaborate on.
3. **Nothing else.** Do not pull in facts, quotes, or metrics that aren't stated or referenced in the charter, even if they exist elsewhere in the vault.

The charter is the deck. The vault tells you where you are on the charter's plan. If the charter mentions "416 articles audited" and the project page has the detail, use it. If the project page has a great quote that the charter never references, leave it out.

**This skill produces the same deck every time it runs against the same charter.** If output varies between runs, the skill is pulling from non-charter sources — that's a bug.

### Step 2 — Minimum Viable Charter Check

Before generating anything, verify all four conditions:

| Check | Required | What qualifies |
|---|---|---|
| **Defined deliverables** | At least 2 | Named outputs with owners or success criteria |
| **Timeline with dates** | At least 3 milestones | Phases, sprints, or deadlines — not just "8 weeks" |
| **Named roles** | At least 2 people | Specific individuals with defined responsibilities |
| **Identifiable tension** | At least 1 | The problem or opportunity that justifies the project's existence |

**If any condition is missing — stop. Output this message and nothing else:**

```
SKILL STOPPED: Charter is not ready for a kickoff briefing.

Missing:
- [list what's absent]

What's needed before this skill can generate:
- [specific guidance on what to add to the charter]
```

Do not attempt to generate a deck with incomplete charter material.

---

### Step 3 — Run the Kickoff Framework

If all four conditions are met, extract the following in order. Do not skip steps.

#### MISSION STATEMENT
One sentence. What this project delivers and why it matters — stated as accomplished fact, not aspiration. This is the billboard on slide 1. Not "we plan to build a knowledge base" — instead "This project produces the content your teams need for Zendesk — and the template that makes Energy and AG follow without reinventing the process."

Ask yourself: if someone walked into the room 5 minutes late and only saw this sentence, would they know what the project is and why it exists? If no — rewrite it.

#### SHARED REALITY
Extract the facts the room already agrees on. These are not arguments — they are settled ground. The audience should nod, not debate.

Sources: charter's Strategic Context section, stakeholder interview findings, organizational decisions already announced.

**Selection test for each item:** "If I removed this from the slide, would the audience lose necessary context for what follows?" If no — cut it. Shared reality is a foundation, not a summary of everything that's true.

#### ANCHOR TENSION
The problem or opportunity that justifies the project. This is NOT the full strategic argument — the sponsor already made that case. This is a reminder: "Here's why we're in this room."

Extract:
- **Primary tension** — the one forcing function or failure state that makes this project non-optional. The thing that breaks if the project doesn't happen.
- **Supporting tensions** (up to 3) — additional pressures that amplify urgency or widen impact.

**Source rule:** Primary and secondary tensions must trace to the charter's problem statement, strategic context, or risk sections — not to operational findings, audit results, or deliverable benefits. Audit data belongs on the evidence slide. Deliverable advantages belong on the grid slide. If a tension doesn't appear in the charter's "why" framing, it doesn't belong here.

**Weight rule:** Spend 20% of the deck's energy here, not 40%. Anchor, don't relitigate. The audience bought the ticket — you don't need to resell the movie.

#### CREDIBILITY EVIDENCE
Up to 4 proof points that establish trust in the project and its lead. The audience is asking: "Why should I believe this will actually work?" Answer with results already achieved, relevant precedents, or quantified baselines.

**Charter-first rule:** Extract evidence points from the charter document first. Only include a proof point if the charter states it, references it, or implies it as completed work. The vault can provide detail (e.g., the charter says "Phase 0 complete" and the project page explains what that included), but the vault cannot *introduce* evidence the charter doesn't mention.

Apply this standard:
- Quantified where the charter supports it — numbers, metrics, dates, completed milestones.
- Qualitative signals count when specific and attributable: "Alex Bassermann, Utrecht — documentation discipline drove this improvement" is evidence. "We've seen good results elsewhere" is not.
- Completed work (e.g., "416 articles audited in 1 day") is stronger than projected outcomes.
- Order by proof strength: done > measured > attributed > projected.

**Stability test:** If you ran this skill again tomorrow against the same charter, would you select the same 4 evidence points? If not, your selection criteria are too loose. Tighten them — prefer explicit charter statements over inferred vault content.

#### DELIVERABLES
Extract every named deliverable from the charter. Each must have:
- A clear name (what it is)
- A description (what it contains or does — ≤25 words)
- An icon suggestion (what visual metaphor fits)

**Do not editorialize deliverables.** Use the charter's language. The audience needs to know what they're getting, not why it's clever.

#### OPERATIONAL TIMELINE
Extract sprints, phases, or milestones from the charter. Each must have:
- Label (phase/sprint name)
- Target date
- Key output or focus
- Current state (done, in-progress, upcoming)

**Progress indicators matter.** If work is already underway, show it. A timeline that starts at 0% feels theoretical. One that shows Phase 0 complete feels real.

#### SUCCESS CRITERIA
Extract the charter's success criteria — the conditions that must all be true for the project to be considered done. These are parallel outcomes, not sequential gates.

For each criterion, extract:
- A clear name (what's being measured — rewrite for scannability if needed)
- A body (≤20 words — the measurable target or definition of done)
- An icon suggestion (visual metaphor that fits the criterion's domain — e.g., `archive` for inventory, `flask-conical` for testing, `layout-template` for structure, `file-check` for portability, `cpu` for AI readiness, `copy` for repeatability)

**Do not impose sequence or gate numbering.** These are parallel outcomes unless the charter explicitly orders them.

**Include failure definition if the charter provides one.** This renders as a single statement at the bottom of the slide — it sharpens the stakes.

#### TEAM COMMITMENTS
This is the most important extraction. The audience needs to leave knowing what *their team* specifically needs to do.

For each dependency or role assignment in the charter, extract:
- What's needed (specific action, not vague support)
- Who owns it (named person or team)
- Severity: `action` (you need to do something), `approval` (you need to sign off), or `fyi` (you need to know this)
- Priority: `high` or `standard`
- Any timing context (when it's needed by)

**Framing rule:** These are requests, not complaints. "Justin's team: 1–2 hrs/wk for SME content review during conversion" — not "We can't proceed without Justin's team making time."

Also extract items that are explicitly **out of scope** — things the audience might assume are included but aren't. These prevent scope creep conversations during Q&A.

---

### Step 3.5 — Slide Source Mapping

Each slide type draws from specific charter sections. This prevents data from drifting to the wrong slide.

| Slide | Primary Source | Secondary Source | Never Source |
|---|---|---|---|
| **Context** | Charter: strategic context, org decisions | Stakeholder interviews | Audit findings, operational data |
| **Problem** | Charter: problem statement, risks, strategic context | — | Audit results, deliverable benefits |
| **Evidence** | Project file: completed work, metrics, audit findings | Charter: referenced precedents | Charter problem statement |
| **Grid** | Charter: deliverables table | — | Audit data, operational findings |
| **Timeline** | Charter: sprint plan | Project file: status updates | — |
| **Success** | Charter: success criteria | — | — |
| **Blockers** | Charter: asks, dependencies, out-of-scope | Tasks.md: active blockers | — |

**Rerouting rule:** If data extracted in one step doesn't match that slide's source constraint, check whether it fits another slide's source pool before discarding. Examples:
- Credentials found during problem extraction → reroute to evidence (operational finding, not strategic tension)
- Deliverable benefits found during problem extraction → reroute to grid (selling point, not forcing function)
- Audit metrics found during context extraction → reroute to evidence (proof, not settled ground)

Data that fits no slide gets discarded. Never force data onto a slide to avoid losing it.

---

### Step 4 — Encode Presentation Intent

Before generating JSON, determine how each slide communicates its content.

#### Context → "Shared reality"
The audience should nod. This is consensus, not argument.

**Encoding rules:**
- Each item gets an `icon` (visual metaphor), a `body` (≤20 words, factual), and `status` set to `"confirmed"`. The renderer requires this field — hardcode it since everything on this slide is settled ground.
- Order by narrative flow: start with the broadest organizational context, narrow to project-specific facts.

#### Problem → "Anchor tension"
The audience should remember why this matters. Not persuasion — reinforcement.

**Encoding rules:**
- Same primary/secondary structure as strategy skill.
- Each item gets a `severity` field: `critical`, `high`, or `moderate`.
- **Reserve `critical` for items with a date or active failure state.** Not everything is critical.
- The primary tension should connect directly to something the audience is accountable for.

#### Evidence → "Credibility proof"
The audience should trust the project lead and the approach.

**Encoding rules:**
- Same structure as strategy skill: `metric`, `label`, `source`, `type`, `body`.
- For transformation metrics (before → after), encode as single string: `"85.5 hrs → 3.5 hrs"`.
- Order by proof strength: completed work first, measured baselines second, attributed signals third.
- **The metric is the headline.** If you're writing a long body and a weak metric, the evidence point isn't strong enough.

#### Grid → "What you're getting"
The audience should see concrete outputs, not abstract goals.

**Encoding rules:**
- Each deliverable gets `title`, `body` (≤25 words), and `icon`.
- Center-aligned text works for short descriptions. If any description exceeds 20 words, flag for left-alignment.
- Up to 6 cards per page before paginating.
- Order by delivery sequence — what arrives first is shown first.

#### Timeline → "When it lands"
The audience should see a credible schedule with visible progress.

**Encoding rules:**
- Each milestone gets `label`, `date`, `state` (done/current/upcoming), and `detail` (≤20 words).
- The `current` milestone gets emphasis — progress bar, badge, visual weight.
- Include overall progress indicator if calculable (e.g., "1/6 milestones complete, 17%").
- Future milestones should feel concrete (specific dates, specific outputs) not vague.

#### Success Criteria → "How we measure done"
The audience should know what success looks like — and what failure looks like.

**Encoding rules:**
- Uses the `context` slide type with title `"How We Measure Success"`.
- Each criterion gets `title`, `body` (≤20 words), `icon` (domain-relevant — not generic checkmarks), and `status` set to `"confirmed"` (renderer requires it).
- **No gate numbering, no sequencing.** These are parallel outcomes.
- Choose icons that visually distinguish each criterion's domain. Variety helps the audience scan: `archive` for inventory, `flask-conical` for testing, `layout-template` for structure, `file-check` for portability, `cpu` for AI readiness, `copy` for repeatability.
- If the charter defines a failure condition, include it in the slide's `notes` field so the presenter can state it verbally.

#### Blockers → "What I need from you"
The audience should leave with a clear personal commitment or awareness.

**Encoding rules:**
- Each item gets `text` (≤20 words), `severity` (action/approval/fyi), `owner` (named person or team), `priority` (high/standard), and optional `badges` for timing.
- Include out-of-scope items as `fyi` severity — these prevent scope creep in Q&A.
- **Order by severity:** actions first, approvals second, FYIs last.
- **Every action item must have a named owner.** "The team" is not an owner.

---

### Step 5 — Generate the JSON

Only after completing Steps 1-4, generate the deck JSON. Every slide must earn its place by moving the audience from "I understand" to "I know what to do."

**Slide sequence for `kickoff` type:**

| Slide | Type | Eyebrow | Purpose | Include when |
|---|---|---|---|---|
| 1 | `hero` | _(from meta)_ "Leadership Briefing" | Mission statement + key facts | Always |
| 2 | `context` | "Shared Reality" | Shared reality | Always |
| 3 | `problem` | "Anchor Tension" | Why this matters | Always |
| 4 | `evidence` | "Credibility" | Why trust this approach | Source has ≥2 quantified proof points |
| 5 | `grid` | "Deliverables" | Deliverables | Always |
| 6 | `timeline` | "Milestones" | Sprint/phase schedule | Always |
| 7 | `context` | "Success Criteria" | How we measure done | Charter has defined success criteria |
| 8 | `blockers` | "Commitments" | Team commitments + scope boundaries | Always |

Optional additions:
| Slide | Type | Purpose | Include when |
|---|---|---|---|
| — | `pipeline` | Active workstreams in flight | Project has parallel streams worth showing |
| — | `callout` | Closing statement or rallying quote | Source contains a strong closer |
| — | `decision-log` | Decisions already made | Multiple decisions the audience should know about |

Do not include a slide type if the charter does not support it. Omit rather than fabricate.

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
    "eyebrow": "Leadership Briefing",
    "subtitle": "[Mission Statement — one sentence]",
    "date": "YYYY-MM-DD",
    "audience": "team",
    "template": "kickoff",
    "theme": "ember",
    "rag": "green | yellow | red",
    "headline": "[Mission Statement]"
  },
  "slides": []
}
```

### Slide Type: `hero`

Always slide 1. Mission statement on arrival.

```json
{
  "type": "hero",
  "title": "[Project Name]",
  "notes": "GENERATE NOTE ANSWERING: 'What's the one insight that frames everything else, and why am I the one telling them?' State (a) the forcing function or timing trigger that makes this briefing necessary now, and (b) what specific accountability or pain point in the audience's world this project addresses. Name the recent event, decision, or deadline that created urgency. Example: 'This project exists because Zendesk goes live July 29 and there's no structured KB to load into Guide. The CX team will be fielding tickets with no self-serve fallback for base-tier customers. I'm briefing now because I need team commitments today to hit the conversion timeline.'",
  "data": {
    "subtitle": "[Mission Statement]",
    "rag": "green | yellow | red",
    "headline": "[Mission Statement]",
    "kpis": [
      { "label": "string", "value": "string", "icon": "lucide icon name" }
    ]
  }
}
```

**KPI selection for kickoff:** Choose facts that orient the room — scope size, deadline, duration, what follows. Not metrics that argue. "416 articles audited" orients. "85.5 hrs → 3.5 hrs" argues (save that for evidence).

### Slide Type: `context`

Rhetorical job: **Anchor the room.** The audience nods. No debate.

```json
{
  "type": "context",
  "title": "What Everyone Agrees On",
  "notes": "GENERATE NOTE ANSWERING: 'What's the one piece of context that, if misunderstood, would derail the rest of this deck?' Identify which context item is most likely to be misunderstood or forgotten by this audience, and what assumption or decision it protects. If one item is a newer or less-familiar decision, call it out. Example: 'The tiered support model making the KB load-bearing is firm — I'm stating it here because some teams still think base-tier customers will have agent fallback. Everything in this deck assumes they won't.'",
  "data": {
    "eyebrow": "Shared Reality",
    "items": [
      {
        "title": "string",
        "body": "≤20 words. Factual, uncontested. Include attribution when it strengthens credibility (e.g., 'Dan: one place, not 15.').",
        "icon": "lucide icon name",
        "status": "confirmed"
      }
    ]
  }
}
```

**Renderer intent:** Vertical card list with icons. All items use `"confirmed"` status — everything here is settled ground. Clean, scannable, no visual hierarchy beyond reading order.

### Slide Type: `problem`

Rhetorical job: **Remind why this matters.** Anchor, don't argue.

```json
{
  "type": "problem",
  "title": "Why This Is Urgent",
  "notes": "GENERATE NOTE ANSWERING: 'Why is this problem worth solving for this specific audience, and what happens if we don't?' Connect the primary problem to a specific metric, workflow, or accountability this audience owns. State the consequence of inaction in concrete terms — not abstract risk. If the problem has been discussed before but not solved, explain what's different now. Example: 'Today the answer to what goes in the KB is we don't know — 416 articles with no taxonomy, no metadata, no migration plan. If we don't solve this before July 29, the implementation team either gets nothing or invents something under deadline pressure.'",
  "data": {
    "eyebrow": "Anchor Tension",
    "primary": {
      "title": "string",
      "body": "≤30 words. The forcing function or failure state.",
      "icon": "lucide icon name",
      "severity": "critical | high | moderate"
    },
    "secondary": [
      {
        "title": "string",
        "body": "≤20 words. Supporting tension.",
        "icon": "lucide icon name",
        "severity": "critical | high | moderate"
      }
    ]
  }
}
```

### Slide Type: `evidence`

Rhetorical job: **Establish credibility.** The audience should trust the lead and the approach.

```json
{
  "type": "evidence",
  "title": "What We Already Know",
  "notes": "GENERATE NOTE ANSWERING per evidence card: 'How does this proof point demonstrate progress toward the mission, and why should this audience trust it?' For each card, (a) connect the proof back to a specific deliverable, problem, or success criterion from the charter, and (b) explain why this source or data point is credible. If the evidence shows velocity or momentum, state that explicitly. Example for audit card: 'The 416-article audit gives us actual scope for the conversion workstream. The credentials and broken links surfaced are problems that would have migrated silently into Guide. This is done — we're working from real data, which is why the timeline is credible.'",
  "data": {
    "eyebrow": "Credibility",
    "points": [
      {
        "metric": "string — the number or outcome. E.g. '416 articles in 1 day' or '85.5 hrs → 3.5 hrs'",
        "label": "string — what it measures. E.g. 'AI-Powered Content Audit'",
        "source": "string — who produced or validated this.",
        "type": "quantified | qualitative",
        "body": "≤20 words. What this proves about the project's credibility."
      }
    ]
  }
}
```

### Slide Type: `grid`

Rhetorical job: **Set expectations.** Concrete outputs, not abstract goals.

```json
{
  "type": "grid",
  "title": "What You're Getting",
  "notes": "GENERATE NOTE ANSWERING: 'Which deliverable is the linchpin, and what dependency or risk isn't obvious from the card titles?' Identify the one deliverable that unlocks the others or carries the highest risk, and explain why. If there's a sequencing dependency not obvious from the visual order, call it out. If one deliverable has a hard external dependency, name it. This prepares the audience for the timeline and blockers slides. Example: 'The conversion template is the linchpin — it's what makes Energy and AG follow without reinventing the process. If that template isn't documented and tested during Weather, we lose the scalability promise.'",
  "data": {
    "eyebrow": "Deliverables",
    "cards": [
      {
        "title": "string — deliverable name",
        "body": "≤25 words. What it contains or does.",
        "icon": "lucide icon name"
      }
    ]
  }
}
```

**Renderer intent:** 2x2 or 2x3 card grid. Centered icons and text. Top border accent per card. Up to 6 per page.

### Slide Type: `timeline`

Rhetorical job: **Create accountability.** Dates, outputs, visible progress.

```json
{
  "type": "timeline",
  "title": "The Timeline",
  "notes": "GENERATE NOTE ANSWERING: 'What's already done that builds confidence, and what's the one date that can't move?' Highlight completed milestones to establish credibility, then identify the immovable date and why it's immovable (external dependency, business event, contractual obligation). If the active phase has a progress indicator, explain what that percentage represents. Example: 'Phase 0 is done — that's the evidence from two slides ago, proving we're not starting from zero. The immovable date is April 24. Sprint 5 is where we'll need the most from Justin's team — that's the likely bottleneck if SME time gets pulled.'",
  "data": {
    "eyebrow": "Milestones",
    "milestones": [
      {
        "label": "string — phase or sprint name",
        "date": "YYYY-MM-DD",
        "state": "done | current | upcoming",
        "detail": "≤20 words. Key output or focus for this phase."
      }
    ],
    "progress": {
      "completed": "number — milestones done",
      "total": "number — total milestones",
      "percent": "number — overall progress percentage"
    }
  }
}
```

**Renderer intent:** Vertical spine with alternating left/right milestone cards. Done milestones get checkmarks. Current milestone gets emphasis (progress bar, badge). Upcoming milestones are visually lighter. Footer shows overall progress bar.

### Slide Type: `context` (Success Criteria variant)

Rhetorical job: **Define done.** The audience knows what success looks like.

```json
{
  "type": "context",
  "title": "How We Measure Success",
  "notes": "GENERATE NOTE ANSWERING: 'Which success criterion is hardest to measure or most likely to be disputed, and how will we know we're done?' Identify the criterion with the most ambiguity and explain how it will be validated. If one criterion represents the primary stakeholder's definition of done, call that out. If the charter defines a failure state, restate it as the boundary condition. Example: 'The repeatability criterion is the hardest — it's easy to convert Weather content, but proving the template works for Energy and AG requires documentation discipline. The failure state is clear: if content isn't ready when Zendesk goes live, base-tier customers get nothing.'",
  "data": {
    "eyebrow": "Success Criteria",
    "items": [
      {
        "title": "string — criterion name, scannable",
        "body": "≤20 words. The measurable target or definition of done.",
        "icon": "lucide icon name — domain-relevant, varied across criteria",
        "status": "confirmed"
      }
    ]
  }
}
```

**Icon selection guidance:** Use icons that visually distinguish each criterion's domain. Avoid repeating the same icon. Examples: `archive` (inventory), `flask-conical` (testing/validation), `layout-template` (structure/architecture), `file-check` (portability/standards), `cpu` (AI readiness), `copy` (repeatability/templates). The visual variety helps the audience scan and remember individual criteria.

**Renderer intent:** Same vertical card list as the shared reality context slide but with green icons. Each row has a domain-specific icon, criterion title, and target description. No gate numbers, no sequencing — these are parallel outcomes.

### Slide Type: `blockers`

Rhetorical job: **Assign commitments.** Every person leaves knowing their part.

```json
{
  "type": "blockers",
  "title": "What I Need — And What's Not In Scope",
  "notes": "GENERATE NOTE ANSWERING: 'What's the smallest ask that unblocks the biggest risk, and what do I need someone to commit to before leaving this room?' Identify the highest-priority action item and which blocker it resolves. State the specific commitment needed (decision, resource, time, access). For out-of-scope FYIs, explain why you're surfacing them — what scope creep they prevent. Example: 'Justin's 3-4 hrs/wk is the critical ask — without SME review, converted articles can't be validated and the timeline stalls at Sprint 5. The out-of-scope items are here because in past projects, teams tried to expand into Academy sites and DaaS docs. That's not this project.'",
  "data": {
    "eyebrow": "Commitments",
    "summary": {
      "actions": "number",
      "approvals": "number",
      "fyis": "number"
    },
    "items": [
      {
        "text": "≤20 words. Specific ask or boundary.",
        "severity": "action | approval | fyi",
        "owner": "named person or team",
        "priority": "high | standard",
        "badges": ["optional timing context"]
      }
    ]
  }
}
```

**Renderer intent:** Left panel shows summary counts (tinted glass pills). Right panel shows cards sorted by severity. Action cards get red left border + filled badge. Approval cards get amber. FYI cards get blue/neutral. Each card shows owner with avatar initials.

---

## Rules

- Output raw JSON only. No text before or after.
- Save to the project's `pulse-decks/` subfolder as `[Project-Name]-Pulse-Kickoff-[TODAY].json`. Create the `pulse-decks/` folder if it doesn't exist.
- Every body field: **20 words maximum.** Cut ruthlessly. Exceptions: `problem.primary.body` allows 30 words. `grid.cards.body` allows 25 words.
- **Speaker notes:** The presenter's internal monologue — what you're thinking while the audience reads the slide. They answer "Why does this matter to this room?" or "What should I emphasize that isn't written here?" Written in first person, 2-3 sentences max. NEVER describe the layout of the slide, how it was generated, or simply list what is visible. For every metric or point shown, state the underlying business implication, the hidden win, or the specific risk it exposes. Connect every point back to why this project exists or what the audience needs to do.
- **Speaker notes quality test:** "Would a presenter who knows this project still find this note useful 30 seconds before going on stage?" If no, the note is too generic or too obvious. Rewrite.
- **RAG status:** `green` = project on track, no blockers. `yellow` = active risks or pending decisions. `red` = blocked, needs resolution before continuing.
- **Slide selection:** Omit any slide type the charter cannot support. Never fabricate content to fill a slide.
- **JSON hygiene:** Omit empty arrays and optional fields entirely. An absent key is cleaner than an empty value.
- **Schema version:** Always `2`.
- **Deck Title:** Format: `[Project Name] — Sprint N of N` when sprint structure exists. Just `[Project Name]` when it doesn't. No date in the title — `meta.date` handles that. No template type in the title — the Pulse UI already shows template type under the deck icon.
- **Eyebrow:** `meta.eyebrow` is always `"Leadership Briefing"`. Hero inherits from meta.
- All other slides set `slide.data.eyebrow` explicitly per the slide sequence table above.
- The eyebrow describes the slide's role, not the meeting type.
- **Do not invent facts.** If a field cannot be determined from the charter, omit it or flag it.
- **Source fidelity:** Every data point in the JSON must be traceable to the charter. The vault provides current state (done/current/upcoming) — it does not introduce new content. If you find yourself pulling a metric, quote, or fact from the project page that the charter doesn't mention, stop and cut it.
- **If unclear, stop and ask.** Do not improvise.
- **Post-save delivery:** After saving, provide a `computer://` link so Tony can view/download directly.

---

## Renderer Intent Reference

This section exists for the skill operator's awareness. It does not affect JSON output.

| Slide Type | Layout Model | Visual Metaphor | Key Data Signal |
|---|---|---|---|
| `hero` | Full-width dark surface | Title card | KPIs orient, mission statement leads |
| `context` | Vertical card list | Shared checklist | `status` field required; all `confirmed` for kickoff |
| `context` (success) | Vertical card list, green icons | Success scorecard | Same schema, green icon treatment, eyebrow reads "SUCCESS CRITERIA" |
| `problem` | Primary + subordinate cluster | Spotlight + supporting cast | `severity` drives visual weight |
| `evidence` | Stat-forward horizontal row | KPI dashboard | `metric` renders large, `source` builds trust |
| `grid` | 2x2 or 2x3 card grid | Deliverable catalog | Icon + title are the anchor |
| `timeline` | Vertical spine, alternating cards | Progress tracker | `state` drives completion indicators |
| `blockers` | Summary panel + action cards | Commitment board | `severity` drives color, `owner` drives assignment |

---

## Strategy vs. Kickoff — When to Use Which

| Dimension | `/pulse-strategy` | `/pulse-kickoff` |
|---|---|---|
| **Audience** | Decision-maker (sponsor, ELT) | Execution team (directors, leads) |
| **Purpose** | Persuade — build conviction | Brief — create alignment and commitment |
| **Core question** | "What should I believe?" | "What do I need to do?" |
| **Source document** | Strategy doc, discovery findings | Project charter |
| **Problem slide weight** | 30-40% of deck energy | ≤20% — anchor, don't argue |
| **Evidence purpose** | Proves the recommendation | Establishes credibility of the lead/approach |
| **Key slide** | `blockers` (the ask upward) | `blockers` (the ask laterally) |
| **Framework slide** | Common — shows the model | Rare — replaced by `grid` (deliverables) |
| **Timeline type** | `roadmap` (phases) | `timeline` (sprints with progress) |
| **Tone** | Commanding, authoritative | Organized, decisive, collaborative |