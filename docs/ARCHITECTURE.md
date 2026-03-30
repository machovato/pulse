# Pulse Architecture Map

> [!NOTE] 
> **AI Onboarding Note**: If you are an AI reading this repo (Claude, Gemini, Antigravity, or Cursor), start here. This document acts as the topological map of Pulse. Use this in conjunction with `README.md` (vision/setup) and `SCHEMA.md` (data payloads).

Pulse is a local content engine for AI-powered personal operating systems. It transforms markdown vault data into rich artifacts (slide decks, LinkedIn posts) directly in the browser.

## 1. Directory Taxonomy

The repository is neatly segmented into discrete functional boundaries:

- `/src/app/` — **Next.js App Router**: Contains all pages, layouts, and data-fetching logic. The core routing and server-side operations happen here.
- `/src/components/` — **React Component Library**: Reusable UI elements, slide renderers, dynamic timeline lists, and artifact navigation tabs.
- `/skills/` — **Prompt Engineering Layer**: Contains `.md` instruction files (e.g., `/pulse-status`, `/linkedin`). These are read by terminal-based agent systems (Claude Code) to parse the local vault and generate appropriate JSON payloads.
- `/mcp/` — **Model Context Protocol Server**: The local connective tissue that enables skills to seamlessly push their generated JSON artifacts directly into the Pulse database.
- `/public/themes/` — **CSS Design System**: Raw `.css` variables that dictate the appearance of specific decks or posts (e.g., `obsidian.css`, `blue.css`, `ember.css`).
- `/prisma/` — **Database Layer**: SQLite schema definitions for all stored artifacts.

## 2. The Artifact Generation Pipeline

How data travels from a user's markdown vault to a finished browser artifact:

1. **Execution**: The user invokes a skill (e.g., `/linkedin`) inside their vault directory using a CLI agent.
2. **Parsing & Inference**: The skill instructions force the agent to synthesize user project files against custom writing models/rules and construct a strictly validated JSON payload.
3. **Delivery (via MCP)**: The agent uses the MCP `pulse_create_artifact` tool to deliver the JSON directly to the running Pulse server.
4. **Storage**: Pulse's backend accepts the payload, identifies the type (Deck or Post), and inserts it into the SQLite database.
5. **Rendering**: The user navigates to `localhost:3000`. Next.js fetches the artifacts chronologically, wrapping them in structured React components like `TimelineList.tsx` or `DeckRowItem.tsx`.

## 3. Data Models (Prisma)

The SQLite database (`dev.db`) is the source of truth for historical artifacts, structured via Prisma definition. 

- **Deck (`Update`)**: The original V1 presentation model. Includes properties like `template`, `theme`, `voice_version`, and the core `content_json` which strictly adheres to `SCHEMA.md`.
- **Post**: Introduced in V2. Represents social output. Includes fields tailored to different contexts such as `platform`, `hook`, `hook_char_count`, `total_char_count`, and `pinned` status.

*Both models share common utility fields like `created_at`, `project`, `pillar`, and `status` to allow seamless merging into a unified timeline feed.*

## 4. Key Design Patterns

- **Unified Timeline Activity Feed**: In `TimelineList.tsx`, disparate models (`Deck` and `Post`) are fetched, cast into a generic `TimelineItem` union type, sorted chronologically, and segmented by their `pinned` status.
- **Visual Boundaries (CSS JIT)**: Because the Timeline mixes radically different artifact types, we employ absolute left-border accents (`bg-[#0A66C2]` for LinkedIn, `#D04423` for Decks) alongside explicit sub-eyebrow type badges to maintain strict visual scannability and context switching.
- **Dynamic Theme Loading**: Rather than compiling themes into the master CSS bundle, the `LocalThemeLoader` dynamically injects customized `public/themes/[name].css` variables mapped to the data's requested theme, isolating styles without conflict.
