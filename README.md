# Pulse

**A local presentation engine for AI-powered personal operating systems.**

You've automated your projects, tasks, and tracking in a markdown vault using tools like [Dex](https://github.com/davekilleen/Dex) or [Claude Chief of Staff](https://github.com/mimurchison/claude-chief-of-staff). But when it's time to present, you're still copying and pasting into PowerPoint.

Pulse is the last mile. Run a skill, get a deck.

```
/pulse-status my-project
```

Your vault data becomes a navigable, animated slide deck in the browser — with speaker notes, keyboard shortcuts, and themed layouts. With the MCP server enabled, the deck just *appears*. No copy-paste. No switching windows.

Pulse is a local deck renderer, not a slide editor in the PowerPoint sense. It turns structured JSON into presentation-ready decks. Everything runs on your machine — no cloud, no accounts, no API keys.

**Tech stack:** Next.js 14 · React 18 · SQLite (Prisma) · Tailwind CSS · Framer Motion · Zod

![Pulse Demo](docs/Pulse-Generator.gif)

---

## Table of Contents

- [What You Get](#what-you-get)
- [Quick Start for Dex Users](#quick-start-for-dex-users-60-seconds)
- [Full Getting Started](#full-getting-started)
- [MCP Server — Automatic Deck Delivery](#mcp-server--automatic-deck-delivery)
- [The Four Skills](#the-four-skills)
- [Themes](#themes)
- [MISSING Slides](#missing-slides)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Design Decisions](#design-decisions)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Related Projects](#related-projects)
- [Credits & License](#credits--license)

---

## What You Get

Pulse ships ready to explore. On first launch, you'll see four **Atlas** demo decks — a single fictional project moving through its full lifecycle:

| Deck | Skill | Theme | The Moment |
|---|---|---|---|
| Strategy Briefing | `/pulse-strategy` | Obsidian (dark) | Pitching the VP on why Atlas needs to happen |
| Project Kickoff | `/pulse-kickoff` | Ember (warm) | Aligning the execution team after approval |
| Sprint 2 Status | `/pulse-status` | Blue (light) | Week 5 — migration on track, review sessions slipping |
| Daily Standup | `/pulse-standup` | Blue (light) | Day 8 — clearing the review backlog before it compounds |

Click through all four. You'll see how the same project data tells a different story depending on who's in the room.

Under the hood:

- **4 skills** — status, strategy, standup, kickoff
- **3 themes** — Blue, Obsidian, Ember
- **14 slide types** — hero, context, problem, evidence, framework, roadmap, grid, pipeline, timeline, kpis, blockers, and more
- **MCP server** — skills push decks directly to Pulse, no clipboard involved
- **MISSING slides** — when data is absent, Pulse tells you what to add instead of making something up

MCP makes delivery seamless, but it's optional. Without it, Pulse still works: generate JSON, paste it into the editor, save.

---

## Quick Start for Dex Users (60 Seconds)

You already have Node, Git, Python, Claude Code, and MCP servers running. You've been through this dance before. Here's the fast track:

```bash
git clone https://github.com/yourusername/pulse.git
cd pulse
npm install
npm run setup    # point it at your vault when prompted
npm run dev
```

Open `http://localhost:3000`. Four Atlas demo decks are ready to explore.

If you provide your vault path during setup, Pulse will also copy the skills and register the MCP server for automatic delivery. Restart Claude Code, then:

```
/pulse-standup my-project
```

If MCP connected successfully, the deck appears in Pulse without pasting. If not, the skill saves a JSON file as a fallback — paste it manually and troubleshoot later.

---

## Full Getting Started

This section assumes you can follow terminal commands but doesn't assume you've set up a local web app before. Every step tells you what's happening and what success looks like.

### Prerequisites

Make sure these are installed before you start:

| Tool | Check with | Install from |
|---|---|---|
| **Git** | `git --version` | [git-scm.com](https://git-scm.com) |
| **Node.js** (v18+) | `node --version` | [nodejs.org](https://nodejs.org/) |
| **Python** (3.10+) | `python --version` (Win) or `python3 --version` (Mac/Linux) | [python.org](https://python.org) |
| **Claude Code** or **Cursor** | `claude --version` or open the app | [claude.ai/download](https://claude.ai/download) |

Python is only required for MCP delivery (recommended, but optional). Everything else works without it.

**Windows users:** When installing Python, check the box that says **"Add python.exe to PATH."** This prevents a common headache later.

### Step 1 — Clone and install

```bash
git clone https://github.com/yourusername/pulse.git
cd pulse
npm install
```

**What's happening:** Git downloads the code, npm installs the dependencies. This may take a minute the first time.

**Success looks like:** The command finishes with `added XXX packages` and no red errors at the end.

### Step 2 — Run setup

```bash
npm run setup
```

Setup automatically handles:

- **.env creation** — sensible local defaults
- **Prisma generation** — compiles the database layer
- **SQLite initialization** — creates the local database (no server to configure)
- **Data seeding** — loads four Atlas demo decks
- **MCP integration** (optional) — prompts for your vault path to copy skills, install the Python MCP SDK, and register the MCP server

**If you don't have a vault yet**, press Enter to skip. You can re-run `npm run setup` later to add skills and MCP at any time.

**What success looks like:** Green checkmarks. The last line says `Setup complete! Run 'npm run dev' to start.`

**Windows note:** If a Pulse dev server is already running in another terminal, stop it first (`Ctrl+C`). Windows locks the database file and setup will fail with an `EPERM` error.

### Step 3 — Start Pulse

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**What you should see:** The Pulse home page with four Atlas demo decks listed.

**If the first load takes a few seconds**, that's normal. Next.js compiles pages on first visit in dev mode. It only happens once per session.

**If port 3000 is taken:**

```bash
# Mac/Linux
PORT=3001 npm run dev

# Windows PowerShell
$env:PORT=3001; npm run dev
```

### Step 4 — Connect the MCP server (optional but recommended)

Skip this if you're not using Claude Code or don't want automatic deck delivery. Skills work fine without it — you'll just copy-paste JSON.

If you provided your vault path during setup, the MCP server is already installed. Activate it:

1. Open Claude Code from your vault directory
2. It will ask about the new "pulse" MCP server — select **"Use this and all future MCP servers in this project"**
3. Type `/mcp` to verify — you should see `pulse · ✅ connected`

**Important:** Pulse must be running (`npm run dev`) for MCP delivery to work. If Pulse isn't running when the skill fires, it falls back to saving a JSON file.

If you see `pulse · ✗ failed`, see [Troubleshooting → MCP & Python](#mcp--python).

### Step 5 — Generate your first deck

Make sure Pulse is running in one terminal (`npm run dev`). Then in Claude Code:

```
/pulse-standup my-project
```

Replace `my-project` with a project in your vault.

**With MCP:** The deck appears in Pulse. Claude Code shows you the URL — click it.

**Without MCP:** The skill saves a JSON file. Open Pulse, click "New Deck," paste the JSON, save.

**Claude Code will ask to approve the MCP tool** the first time. Pick option 2 ("Yes, and don't ask again") to auto-approve future deliveries.

### Step 6 — Install skills manually (if you skipped the vault path)

If you pressed Enter during setup, the skills weren't copied. Do it by hand:

**Mac/Linux:**
```bash
cp -r skills/pulse-status   ~/path/to/vault/.claude/skills/
cp -r skills/pulse-strategy  ~/path/to/vault/.claude/skills/
cp -r skills/pulse-standup   ~/path/to/vault/.claude/skills/
cp -r skills/pulse-kickoff   ~/path/to/vault/.claude/skills/
```

**Windows PowerShell:**
```powershell
Copy-Item -Recurse skills\pulse-status   "$HOME\Documents\vault\.claude\skills\"
Copy-Item -Recurse skills\pulse-strategy "$HOME\Documents\vault\.claude\skills\"
Copy-Item -Recurse skills\pulse-standup  "$HOME\Documents\vault\.claude\skills\"
Copy-Item -Recurse skills\pulse-kickoff  "$HOME\Documents\vault\.claude\skills\"
```

Replace the vault path with your actual path. See `skills/README.md` for details.

---

## MCP Server — Automatic Deck Delivery

This is the feature that turns Pulse from a nice tool into a daily habit.

**Without MCP:**
```
Run skill → open JSON file → copy → open Pulse → paste → save → view
```

**With MCP:**
```
Run skill → deck appears in Pulse
```

Seven steps become two. Compounded across daily standups and weekly status updates, that's the difference between "I should use this" and "I can't stop using this."

### How it works

The MCP server is a small Python script (~80 lines) that Claude Code launches when it needs to deliver a deck. It hands the JSON payload to Pulse over a local API, Pulse creates the deck, and the skill gets back a URL. You click it.

If Pulse isn't running, the skill falls back gracefully — it saves the JSON file and tells you to paste manually. No data is ever lost.

**Pulse must be running** (`npm run dev`) for MCP delivery to work. Keep it open in a separate terminal.

### Verifying it works

In Claude Code, type `/mcp`. Look for:

```
pulse · ✅ connected
```

Green checkmark = you're good. Run any skill and watch the deck land.

---

## The Four Skills

Each skill reads your project files and generates a specific kind of deck. Think of them like lenses — same project, different angle depending on the audience.

| Skill | Use Case | Theme | Leash |
|---|---|---|---|
| `/pulse-status` | Weekly project update | Blue | Medium — cites everything, no editorial spin |
| `/pulse-strategy` | Leadership briefing | Obsidian | Long — synthesizes patterns, builds a narrative |
| `/pulse-standup` | Daily standup | Blue | Short — yesterday, today, blockers. That's it. |
| `/pulse-kickoff` | Project launch | Ember | Shortest — charter-bound, nothing beyond the doc |

**"Leash"** is how much interpretation a skill is allowed. Short leash = stick tightly to the source files. Long leash = synthesize across them and build a story. But every skill follows the cardinal rule: **no invention.** If the data isn't there, the slide says [MISSING], not something that sounds plausible.

---

## Themes

Three built-in themes. Each one sets a different tone without you touching a CSS file.

**Blue** (default) — Clean, light, professional. Navy left panels on split layouts, white content areas, blue accents. The workhorse. Good for any meeting where you want the data to speak.

**Obsidian** — Dark, high-contrast, boardroom-ready. Deep navy background, violet accents, elevated surfaces. For strategy decks where the room should lean forward.

**Ember** — Warm, collaborative, energetic. Light surfaces, orange and green accents. For kickoffs where you want the room to feel invited, not briefed.

Themes are set in the deck JSON (`meta.theme`) or from the editor dropdown. If no theme is specified, Blue applies automatically.

**Making your own:** Drop a CSS file in `public/themes/` following the token structure in `blue.css`. Every slide component reads from semantic CSS custom properties — override the tokens and the whole deck follows.

---

## MISSING Slides

When a skill can't find data for a slide, it doesn't guess. It shows a **MISSING slide** — a placeholder that sits right where the real slide would be and tells you exactly what to add.

> **Project Timeline**
>
> No sprint dates or milestones found in project files.
>
> 💡 Add a timeline or sprint schedule to your project folder to populate this slide.

MISSING slides show up in navigation, pagination, and the grid overview. Press **E** to edit them inline or delete them.

This is the feature that makes Pulse a feedback loop. You run the skill, see what's missing, improve your vault, run it again. **The output teaches the input.** Over time, your project documentation gets better because Pulse keeps gently pointing at the gaps.

---

## Keyboard Shortcuts

Pulse is built for presenting, not for clicking.

| Key | Action |
|---|---|
| `← → ↑ ↓` | Navigate slides |
| `E` | Edit this slide |
| `Shift + E` | Edit full deck JSON |
| `N` | Toggle speaker notes |
| `G` / `O` | Slide grid overview |
| `D` | Toggle density |
| `P` | Print / export |
| `Esc` | Dismiss overlay / return home |

---

## Design Decisions

Some things in Pulse are opinionated on purpose. Here's the thinking:

**Eyebrows describe the slide.** The small label above each title says "Completed," "Pipeline," "Blockers" — not "Daily Standup" on every slide. Only the hero carries the meeting type. The rest orient you within the deck.

**Standup is always 5 slides.** Even when empty. An empty parking lot is a facilitator prompt: "Anything that needs a separate conversation?" Remove the slide and you remove the question.

**No invention, ever.** If the skill can't find data, it flags MISSING. It never fills in a plausible-sounding guess. A confident slide sourced from thin air is worse than an honest gap.

**Skills are vault-agnostic.** They say "find the project," not "look in `02-Projects/`." Dex folder structure, flat Obsidian vault, custom system — the skill adapts.

**MCP is additive, not required.** Copy-paste always works. The MCP makes it seamless, but removing it doesn't break the product. Every feature has a manual fallback.

**Local-first, no exceptions.** SQLite, localhost, no telemetry, no accounts. Your decks live on your machine and nowhere else.

---

## Troubleshooting

### Install & Setup

**`npm run setup` fails with EPERM on Windows**
The dev server is running and Windows has the database file locked. Stop it (`Ctrl+C`), then re-run `npm run setup`.

**First page load takes several seconds**
Normal in dev mode. Next.js compiles pages on first visit. Subsequent loads are instant.

**Port 3000 already in use**
Another app is on that port. Use `PORT=3001 npm run dev` (Mac/Linux) or `$env:PORT=3001; npm run dev` (Windows PowerShell).

### MCP & Python

**`python3` not recognized on Windows**
Windows uses `python`, not `python3`. If you manually edited `.mcp.json`, change `"command": "python3"` to `"command": "python"`. Re-run setup to fix it automatically.

**Typing `python` opens the Microsoft Store**
Python isn't actually installed — Windows has a Store alias that traps the command. Install Python from [python.org](https://python.org), or disable the alias: Settings → Apps → App execution aliases → turn off "python.exe."

**`pip` not recognized**
Use `python -m pip install mcp` instead. Python's pip module works even when the `pip` command isn't on PATH.

**MCP shows `✗ failed` in Claude Code**
Run the server manually to see the Python stack trace:
```bash
# Windows
python "C:\path\to\vault\mcp\pulse_server.py"

# Mac/Linux
python3 ~/path/to/vault/mcp/pulse_server.py
```

Common errors:
- `ModuleNotFoundError: No module named 'mcp'` → Run `python -m pip install mcp`
- `AttributeError: 'Server' object has no attribute 'tool'` → Run `python -m pip install --upgrade mcp`
- File not found → Check the path in `.mcp.json`

**`/mcp` doesn't show Pulse at all**
Claude Code hasn't loaded the project MCP config yet. Fully restart Claude Code from the vault root (exit and re-launch, don't just open a new session), then run `/mcp` again.

**Skill says "Pulse is not running"**
The dev server needs to be running in a separate terminal. Start it with `npm run dev` and keep it open.

**Claude Code asks to approve the tool every time**
Select option 2 ("Yes, and don't ask again") on first use. After that, it auto-approves.

**Will Pulse overwrite my existing `.mcp.json`?**
No. Setup merges the Pulse entry into your existing config. Your Dex servers, Figma, calendar — all preserved.

---

## Roadmap

### Shipped (v1)

- Four skills: status, strategy, standup, kickoff
- Three themes: Blue, Obsidian, Ember
- 14 slide types with Zod validation
- MCP server for zero-click deck delivery
- MISSING slide placeholders
- Inline editor with keyboard shortcuts
- Speaker notes, density toggle, print/export
- Atlas demo decks showing a full project lifecycle

### Planned

- **MCP upsert** — run the same skill twice without duplicating the deck
- **Slug URLs** — `/deck/atlas-strategy` instead of `/deck/cmmqhlh0b0003...`
- **Retrospective skill** — went well, improve, action items
- **PDF export** — direct generation without print dialog

---

## Contributing

Pulse is open source and MIT licensed. Here's where to start depending on your strengths:

**If you're a strong prompter / workflow designer** → start with **skills**. Build a skill for a meeting type we haven't covered. Follow the existing pattern: vault-agnostic, citation-required, no invention. See the `skills/` folder for examples.

**If you want the easiest first contribution** → start with **themes**. Add a CSS file to `public/themes/` following the token structure. Blue, Obsidian, and Ember are your references.

**If you're comfortable in React/TypeScript** → start with **renderers**. New slide types, animation refinements, accessibility improvements. See `SCHEMA.md` for the full slide type inventory.

---

## Related Projects

Pulse is the presentation layer for a growing ecosystem of AI personal operating systems:

| Project | Author | What It Does |
|---|---|---|
| [Dex](https://github.com/davekilleen/Dex) | Dave Killeen | AI Chief of Staff — personal OS for 25+ roles |
| [Claude Chief of Staff](https://github.com/mimurchison/claude-chief-of-staff) | Mike Murchison | CEO-oriented AI OS with inbox triage and relationship CRM |
| [AI Chief of Staff](https://github.com/tomochang/ai-chief-of-staff) | Tomo Chang | VP-oriented AI OS with multi-channel triage |

If you're building or using one of these, Pulse turns your project data into shareable decks without leaving your workflow.

---

## Credits & License

Built by Tony Melendez. Inspired by [Dave Killeen's Dex](https://github.com/davekilleen/Dex) and the AI Chief of Staff community.

Designed in Claude Chat. Built with Claude Code and Gemini. Powered by Next.js, Framer Motion, Prisma, and Zod.

Released under the MIT License. See `LICENSE` for details.
