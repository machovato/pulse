---
name: pulse-linkedin
description: Generates a LinkedIn post from a project in your vault. Reads project files, extracts content themes, applies your voice profile, and outputs structured JSON to Pulse. Run as /pulse-linkedin [project-name]. Optional flags: --series (propose a multi-post arc), --format [type] (force a specific angle).
---

# Skill: /pulse-linkedin $ARGUMENTS

**Mode:** CHECK
**Purpose:** Surface insights from real project work, in your voice, structured for LinkedIn's reading behavior.
**Output:** `linkedin_post` JSON pushed to Pulse via MCP. Fallback: JSON saved to project folder.

---

## Design Principle

This skill does not "generate LinkedIn posts faster." It surfaces insights from real work, removes enough friction that posting becomes part of the workflow, and protects your voice from AI regression to the mean.

If the output sounds like it could have been written by anyone in your field, the skill failed.

---

## First-Time Setup

Before running this skill, you must customize your voice file:

1. Open `.claude/skills/pulse-linkedin/linkedin-voice.md`
2. Replace every template section with your own writing examples, principles, and anti-patterns
3. The more specific your examples, the more the output sounds like you

The skill will not produce good results with the default template. Your voice file is the difference between "AI-generated LinkedIn post" and "my insight, my words, published faster."

---

## Instructions

### Step 0 — Parse Arguments

`$ARGUMENTS` is a project name, optionally followed by flags.

**Parse:**
- `project-name` — required. Match against project folder names in your vault.
- `--series` — optional. Propose a 3-5 post arc instead of a single post.
- `--format [type]` — optional. Force a specific angle: `story`, `tension`, `framework`, `observation`.

**If no project name is provided**, stop:
```
SKILL STOPPED: Provide a project name. Usage: /pulse-linkedin [project-name]
Available projects: [list project folders]
```

### Step 1 — Gather Context (Silent)

Read these files. Do not narrate that you are reading them.

1. **Project files** — Everything in the named project folder. Read all files.
2. **Voice file** — `.claude/skills/pulse-linkedin/linkedin-voice.md`. This is the execution layer — how it sounds, sentence patterns, anti-patterns. Every writing decision defers to this file.
3. **Editorial directive** *(optional)* — `.claude/skills/pulse-linkedin/linkedin-editorial.md`. If present, this is the strategic layer — positioning, audience, content pillars, and quality gates. It controls *what* you write about and *why*. If absent, infer content pillars from your voice file's audience description.
4. **Post history** — `.claude/skills/pulse-linkedin/published.md`. Check for theme overlap with recent posts.

### Step 2 — Extract Themes

Synthesize the project files into **3-5 distinct content angles**. Each theme must have:

- **Theme name** — 3-6 words
- **Hook seed** — a one-sentence tension or claim that could open a post
- **Why it resonates** — one line explaining why your audience would care
- **Pillar** — which content category it maps to
- **Overlap check** — flag if `published.md` shows a similar theme in the last 30 days

**Theme quality filter:** Each theme must pass this test: "Would an experienced professional in my audience stop scrolling for this?" If the answer is "maybe" — it's not a theme, it's a topic. Topics are too broad. Themes are specific enough to have an opinion about.

**Present themes to the user.** Format:

```
Themes extracted from [project]:

1. [Theme Name]
   Hook seed: "[tension or claim]"
   Why it resonates: [one line]
   Pillar: [pillar name]

2. [Theme Name]
   ...

Which theme? (number, or describe what you're looking for)
```

**Wait for selection.** Do not proceed until a theme is picked.

### Step 3 — Propose Angle

After theme selection, propose **4 angles** for how to write the post. Angles are the *format* of the argument, not the content. **Story is always the first option and the default.**

| Angle | What it does | Hook pattern | Example opener |
|-------|-------------|--------------|----------------|
| **Story** *(default)* | Opens with a scene, moment, or experience. The reader is *in it* before they know the point. | Curiosity / scene-setting | "Last Tuesday, I watched two AI models argue about a PowerPoint slide." |
| **Tension** | Leads with a contradiction or counterintuitive claim. Challenges a common belief head-on. | Bold claim / counterintuitive | "Your knowledge base isn't a library. It's a landfill." |
| **Framework** | Packages an insight into a reusable mental model. Teaches through structure. | Promise of structure | "There are exactly three ways AI projects die. I've seen all of them." |
| **Observation** | A quiet noticing that lands hard. Less structured, more reflective. Names a problem the audience feels but hasn't articulated. | Question / quiet noticing | "Nobody talks about what happens after the AI demo goes well." |

**If `--format` was specified**, skip this step and use that angle.

**If `--series` was specified**, propose a 3-5 post arc:
```
Series: [Arc Name]
Narrative thread: [one sentence describing what connects the posts]

1. [Theme] — [Angle] — [Hook seed]
2. [Theme] — [Angle] — [Hook seed]
3. [Theme] — [Angle] — [Hook seed]
...

This is post [N] of [total]. Previous posts in this series: [list or "none yet"]
```

**Present angles. Wait for selection.**

### Step 4 — Quality Gates

Before writing, evaluate the selected theme silently against these gates. If an editorial directive exists in your skills folder, use its gates. Otherwise, use the defaults below.

**Gate 1 — Proof of Experience:** "What's the evidence this comes from lived experience?" An artifact, a decision, a failure, a pattern from being in the room. If the proof isn't obvious, the theme needs more specificity.

**Gate 2 — Mockingbird Test:** "Could someone who hasn't built anything write this post?" If yes, the theme fails. Add specificity that only comes from having done the work.

**Gate 3 — Altitude Test:** "Does this reveal strategic thinking, not just tactical execution?" Lead with the insight, anchor with the proof. The reader should walk away thinking about the idea.

**Gate 4 — Analogy Check:** "Is there a natural metaphor that reframes this topic?" Not required, but the best posts have one. Flag if one is available.

**Relevancy check** — at least one must also be true:
- It challenges a common practice in the field
- It reveals a non-obvious connection between disciplines
- It teaches something transferable from a specific experience
- It names a problem the audience feels but hasn't articulated

**If gates fail:** Surface a different theme from Step 2. Tell the user: "The [theme] angle is interesting internally but I don't think it lands for your audience. Here's why: [reason]. Try [alternative theme] instead?"

### Step 5 — Write (Three-Pass Pipeline)

#### Pass 1: Draft

Write the post. Focus on structure and logic. Don't worry about voice yet.

**Structure rules:**
- **Hook** — must be ≤150 characters. This is the mobile fold. It must create tension or make a claim that demands proof. The hook is incomplete without the body — a question, a tension, a claim that needs the rest of the post to resolve.
- **Body** — the payoff. 3-5 short paragraphs. Each paragraph earns its place or gets cut.
- **CTA** — optional. If included, it's a genuine question, not a performative one. "What's the actual bottleneck in your workflow?" not "Agree? Like and share!"
- **Hashtags** — 3-5 relevant hashtags. Mix broad with niche. No hashtags with spaces. No more than 5.

**Forbidden patterns:**
- No bullet points in the post body
- No opening with "In today's rapidly evolving..." or "I've been thinking about..."
- No rhetorical questions that don't need the post to answer them
- No "It's worth noting..." or "At the end of the day..."
- No passive constructions when active voice is possible

#### Pass 2: Tighten

Re-read the draft. For every sentence, ask: "Does this earn its place, or is it furniture?"

- Cut any sentence that restates what the previous one said
- Cut any qualifier that doesn't change the meaning ("actually", "really", "quite")
- Cut any transition that the reader's brain supplies automatically ("However", "Moreover", "That said")
- If the post is >1500 characters total, something isn't earning its place. Find it and cut it.
- **Curiosity gap check:** Does the hook open a loop that the body closes? If the hook is a self-contained statement that doesn't pull the reader forward — rewrite it.

#### Pass 3: Voice + Humanize

Read the draft against `linkedin-voice.md` (style execution) and your editorial directive if one exists (strategic positioning). For each paragraph:

1. **Voice match:** Read the examples from the voice file. Does the draft match the energy? If the draft sounds like a consultant's blog post, it fails.
2. **AI tic scan:** Check the AI Guardrails table in the voice file. Replace every flagged pattern.
3. **Analogy check:** Is there at least one analogy in the post? Not a simile — an analogy that carries structural weight. If not, find the abstract concept and make it concrete.
4. **Mockingbird final check:** Could someone who hasn't built anything write this? If yes, add a concrete detail that only someone who lived it would know.
5. **The final test:** Read the hook aloud. If it doesn't create a "wait, what?" reaction — rewrite it.

### Step 6 — Construct JSON + Deliver

Build the `linkedin_post` JSON:

```json
{
  "type": "linkedin_post",
  "project": "[project name]",
  "pillar": "[content pillar]",
  "theme": "[selected theme name]",
  "hook": "[hook text — ≤150 chars]",
  "body": "[body text]",
  "cta": "[CTA text or omit]",
  "hashtags": ["tag1", "tag2", "tag3"],
  "hook_char_count": [number],
  "total_char_count": [number],
  "voice_version": "1.0"
}
```

**Character counts:** Calculate `hook_char_count` as the character length of the hook field. Calculate `total_char_count` as the combined length of hook + body + cta (if present) + hashtag line.

**Delivery:**

1. If `pulse_create_artifact` tool is available, call it with the JSON string.
   Report the returned URL.

2. If Pulse is not running or the tool fails:
   - Save the full `linkedin_post` JSON to the project folder as `[Project]-LinkedIn-[YYYY-MM-DD].json`
   - Valid JSON only — no markdown fences, no preamble
   - Tell the user: "Pulse wasn't running — JSON saved to your project folder. Start Pulse and re-push."

### Step 7 — Update Post Log

Append a row to `.claude/skills/pulse-linkedin/published.md`:

```
| YYYY-MM-DD | [project] | [pillar] | [theme] | [angle] | [Pulse URL or "draft"] |
```

---

## Output Format

Your chat output after delivery is **maximum 8 lines**:

```
[Pillar] · [Theme] · [Angle]

Hook (XX/150): "[hook text]"

[Pulse URL or draft file path]

Hashtags: #tag1 #tag2 #tag3
```

No preamble. No explanation of what you did. Start with the pillar line.

---

## Series Mode (`--series`)

When `--series` is passed:

1. In Step 2, extract themes with an eye toward narrative connection — what story do these themes tell together?
2. In Step 3, propose a 3-5 post arc with sequencing. Each post should stand alone but gain meaning in sequence.
3. Track the series in `published.md` by adding a `Series: [name]` note in the angle column.
4. On subsequent runs, detect if a series is in progress and suggest the next post in sequence.

Series are opt-in. Default is always single post.

---

## Rules

### Voice File Is the Tiebreaker
When uncertain about a writing decision, the voice file wins — not LinkedIn best practices, not engagement optimization, not what "performs well."

### No Narration
Do not announce what you're reading, what pass you're on, or what you're checking. The pipeline is invisible. The user sees: themes → angle selection → final output.

### No Bullet Points in Output
If the generated post contains bullet points, the voice pass failed. Rewrite.

### Hook Is King
The hook must be written *for* the 150-char constraint, not trimmed to fit it. If you write a hook and then check the count, you're doing it backwards.

### One Post Per Run
Unless `--series` is passed, generate exactly one post. No variants, no alternatives, no "here's another option." Theme selection is the creative choice. After that, commit.

### Fallback Is Not Failure
If Pulse isn't running, saving JSON to the project folder is a complete, successful execution. Don't apologize for it.
