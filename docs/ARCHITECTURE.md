# Pulse Architecture Map

> [!NOTE]
> **AI Onboarding Note**: If you are an AI reading this repo (Claude, Gemini, or Cursor), start here. This document acts as the topological map of Pulse. Use this in conjunction with `README.md` (vision/setup) and `SCHEMA.md` (data payloads).

Pulse is a local content engine for AI-powered personal operating systems. It transforms markdown vault data into rich artifacts (slide decks, LinkedIn posts) directly in the browser.

---

## The Core Model

Pulse is a transformation engine. It takes structured vault content and renders it into format-specific artifacts.

```
Vault (source of truth)
    ↓
Skill (transformation instruction)
    ↓
Artifact (format-specific output)
    ↓
Pulse (renderer + delivery layer)
```

The vault doesn't change. The skill changes. The output changes. This is the architectural spine of every feature decision.

---

## Directory Taxonomy

The repository is segmented into discrete functional boundaries:

- `/src/app/` — **Next.js App Router**: Contains all pages, layouts, and data-fetching logic. The core routing and server-side operations happen here.
- `/src/components/` — **React Component Library**: Reusable UI elements, slide renderers, dynamic timeline lists, and artifact navigation tabs.
- `/skills/` — **Prompt Engineering Layer**: Contains `.md` instruction files (e.g., `/pulse-status`, `/linkedin`). These are read by terminal-based agent systems (Claude Code) to parse the local vault and generate appropriate JSON payloads.
- `/mcp/` — **Model Context Protocol Server**: The local connective tissue that enables skills to seamlessly push their generated JSON artifacts directly into the Pulse database.
- `/public/themes/` — **CSS Design System**: Raw `.css` variables that dictate the appearance of specific decks or posts (e.g., `obsidian.css`, `blue.css`, `ember.css`).
- `/prisma/` — **Database Layer**: SQLite schema definitions for all stored artifacts.

---

## The MCP Architecture

The MCP server uses a single generic tool — `pulse_create_artifact` — that routes by `type` field in the JSON payload:

```
type: "deck"           → /api/mcp/decks
type: "linkedin_post"  → /api/mcp/posts
```

Why a single tool instead of per-type tools (`pulse_create_deck`, `pulse_create_post`, etc.): the MCP server should never need to change when a new format skill ships. The skill defines the type. The router handles delivery. The renderer displays it. Three separate concerns that stay separate.

**Backward compatibility rule:** JSON without a `type` field but with `meta`/`slides` structure auto-routes to deck. Existing skills never break.

---

## The Artifact Generation Pipeline

How data travels from a user's markdown vault to a finished browser artifact:

1. **Execution**: The user invokes a skill (e.g., `/linkedin`) inside their vault directory using a CLI agent.
2. **Parsing & Inference**: The skill instructions force the agent to synthesize user project files against custom writing models/rules and construct a strictly validated JSON payload.
3. **Delivery (via MCP)**: The agent uses the MCP `pulse_create_artifact` tool to deliver the JSON directly to the running Pulse server.
4. **Storage**: Pulse's backend accepts the payload, identifies the type (Deck or Post), and inserts it into the SQLite database.
5. **Rendering**: The user navigates to `localhost:3000`. Next.js fetches the artifacts chronologically, wrapping them in structured React components like `TimelineList.tsx` or `DeckRowItem.tsx`.

---

## Data Models (Prisma)

The SQLite database (`dev.db`) is the source of truth for historical artifacts, structured via Prisma definition.

- **Deck (`Update`)**: The original V1 presentation model. Includes properties like `template`, `theme`, `voice_version`, and the core `content_json` which strictly adheres to `SCHEMA.md`.
- **Post**: Introduced in V2. Represents social output. Includes fields tailored to different contexts such as `platform`, `hook`, `hook_char_count`, `total_char_count`, and `pinned` status.

Both models share common utility fields like `created_at`, `project`, `pillar`, and `status` to allow seamless merging into a unified timeline feed.

---

## The Skills Architecture

Each skill is a transformation instruction — a `SKILL.md` file that tells Claude Code how to read project files and produce artifact JSON. Skills are not code. They are structured prompts with:

- A defined input (`$ARGUMENTS` = project path)
- Shell preprocessing (`!ls $ARGUMENTS` to inventory files before Claude reads them)
- A transformation pipeline (extract → draft → refine)
- A JSON output that matches the artifact schema
- A Pulse MCP call to deliver the artifact

### The Leash Concept

Every skill has an interpretation budget — how much synthesis and editorial judgment it's allowed to apply. Short leash = stick tightly to source files. Long leash = synthesize patterns and build a narrative. No skill invents. If data isn't there, the output says so.

### Two Skill Families

**Deck skills** transform project state into presentation format. They serve an audience in a room. The output is navigable, themed, speaker-noted.

**Content skills** transform project insights into publishing format. They serve an audience on a platform. The output is voice-matched, platform-aware, copy-ready.

These families have different constraints, different quality gates, and different renderers — but the same underlying architecture.

---

## The Renderer Architecture

Each artifact type has its own renderer component. Renderers are deliberately simple — their job is display, not logic.

**Deck renderer:** Animated slide sequence with keyboard navigation, speaker notes, density toggle, theme application, inline editor.

**LinkedIn renderer:** Single card with hook, body, optional CTA. Includes a hook character progress bar, character count footer, project and pillar labels, Draft status badge, and copy-to-clipboard.

**Design principle:** The renderer should make the quality of the content immediately visible. The character progress bar on the LinkedIn renderer isn't decoration — it's a quality gate made visual. If the hook runs long, the author knows before they publish.

---

## Key Design Patterns

- **Unified Timeline Activity Feed**: In `TimelineList.tsx`, disparate models (`Deck` and `Post`) are fetched, cast into a generic `TimelineItem` union type, sorted chronologically, and segmented by their `pinned` status.
- **Visual Boundaries (CSS JIT)**: Because the Timeline mixes radically different artifact types, we employ absolute left-border accents (`bg-[#0A66C2]` for LinkedIn, `#D04423` for Decks) alongside explicit sub-eyebrow type badges to maintain strict visual scannability and context switching.
- **Dynamic Theme Loading**: Rather than compiling themes into the master CSS bundle, the `LocalThemeLoader` dynamically injects customized `public/themes/[name].css` variables mapped to the data's requested theme, isolating styles without conflict.

---

## The Two-Terminal Reality

Pulse is a local web app. It needs to stay running (`npm run dev` at `localhost:3000`) while Claude Code executes skills in a separate terminal.

```
Your work happens here              Leave this running
────────────────────────             ─────────────────
Claude Code                          Pulse
/pulse-status my-project             npm run dev
       ↓                                ↑
       └── skill pushes artifact ──→ MCP server receives
```

If Pulse isn't running when a skill fires, the JSON saves to the project folder as a fallback. No work is lost.

This is non-obvious to first-time users and the most common setup failure. Every install path — README, Concierge prompt, troubleshooting guide — must make this explicit.

---

## Decisions Already Made

These decisions have been tested and shipped. Don't revisit without good reason.

| Decision | Rationale |
|---|---|
| `pulse_create_artifact` over per-type tools | Scales to any format without MCP changes |
| Separate Post model from Deck model | Different schema, different storage, different render path |
| Hook generated first, body second | Constraint-driven writing produces better hooks than trimming |
| Voice file as tiebreaker over platform best practices | Author identity > engagement optimization |
| CHECK mode at judgment points | Author decides creative direction; skill executes |
| No auto-publish to LinkedIn | Copy-paste is intentional friction — author reviews before posting |
| Fallback to JSON when Pulse offline | No work lost; skill completes regardless of Pulse state |
| Backward compat for deck JSON without type field | Existing skills never break on MCP upgrade |

---

## What the Architecture Makes Possible

The transformation model is format-agnostic. If your vault has the data and you can define the transformation in a `SKILL.md`, Pulse can render the output. Here are surfaces the architecture already supports — no structural changes needed:

**Tweet/X threads** — A content skill that compresses project insights into a thread: hook tweet, numbered takes, closing CTA. Same voice file concept as LinkedIn. The renderer would show thread preview with per-tweet character counts.

**PDF briefs** — A content skill that generates structured document JSON. The renderer produces a downloadable PDF — client-ready proposals, project summaries, or executive briefs without opening a word processor.

**Email narratives** — A content skill for stakeholder updates. Longer form than LinkedIn, different voice constraints, but the same vault-to-artifact pipeline. The renderer shows a formatted email preview with copy-to-clipboard.

**Video storyboards** — A content skill that produces scene direction for short-form video (Reels, YouTube Shorts). Each scene gets a shot description, text overlay, and timing. The renderer becomes a visual storyboard with scene cards.

**Meeting prep cards** — A deck skill variant that produces a single-screen reference card instead of a navigable deck. Context, talking points, open items, and stakeholder notes — all from the vault's person and project pages.

These aren't promises. They're possibilities that the current architecture enables without modification. The pattern for each one is the same: `SKILL.md` → JSON schema → API route → renderer component → MCP routing rule. The LinkedIn skill is the template. Fork it.

---

## Adding a New Format

Every new artifact type follows the same checklist:

1. **Define the schema** — What fields does the JSON need? Add a Zod schema in `src/lib/schema.ts`.
2. **Write the skill** — Create a `SKILL.md` that transforms vault content into your schema. See `skills/linkedin/SKILL.md` as the template for content skills, `skills/pulse-status/SKILL.md` for deck skills.
3. **Add the API route** — Create an endpoint in `src/app/api/mcp/` that validates and stores the artifact.
4. **Add a routing rule** — Update the MCP router to handle your new `type` value.
5. **Build the renderer** — Create a React component that displays the artifact. Keep it simple — display, not logic.
6. **Update the MCP server** — If the Python MCP server needs a new tool description, add it. Usually the generic `pulse_create_artifact` tool handles it without changes.

---

*Last updated: March 2026.*
