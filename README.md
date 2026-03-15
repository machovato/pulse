# Pulse

**A local presentation engine for AI-powered personal operating systems.**

You've automated your projects, tasks, and tracking in a markdown vault using tools like [Dex](https://github.com/davekilleen/Dex) or [Claude Chief of Staff](https://github.com/mimurchison/claude-chief-of-staff). But when it's time to present, you're still copying and pasting into PowerPoint.

Pulse is the last mile. Run a skill, get a deck.

```
/pulse-status my-project
```

Your vault data becomes a navigable, animated slide deck in the browser — with speaker notes, keyboard shortcuts, and themed layouts. With the MCP server enabled, the deck just *appears*. No copy-paste. No switching windows.

![Pulse Demo](docs/Pulse-Generator.gif)

**Tech stack:** Next.js 14 · React 18 · SQLite (Prisma) · Tailwind CSS · Framer Motion · Zod

---

## Table of Contents

- [Who This Is For](#who-this-is-for)
- [What You Get](#what-you-get)
- [Quick Start for Dex Users](#quick-start-for-dex-users-60-seconds)
- [Guided Install](#guided-install)
- [MCP — Automatic Deck Delivery](#mcp--automatic-deck-delivery)
- [The Four Skills](#the-four-skills)
- [Themes](#themes)
- [MISSING Slides](#missing-slides)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Related Projects](#related-projects)
- [Credits & License](#credits--license)

---

## Who This Is For

Pulse is built for people who already run an AI-powered personal operating system — a vault of markdown files managed through [Claude Code](https://claude.ai/download) or [Cursor](https://cursor.com), with project folders, sprint plans, and task tracking.

**To generate your own decks, you need:**

- A vault or project folder with markdown files
- Claude Code or Cursor to run the skills
- Pulse running locally to render the decks

Pulse is an add-on to an existing AI workflow. Without a vault and Claude Code, you can explore the demo decks but you can't generate your own.

### New to all of this?

If the concept resonates but you don't have a vault set up yet, start here:

1. **[Dex](https://github.com/davekilleen/Dex)** — the most popular AI Chief of Staff. Sets up a full personal OS with task tracking, meeting prep, and MCP servers. Free, open source, Mac and Windows. Pulse was designed to work alongside it.
2. **[Claude Code](https://claude.ai/download)** — the AI terminal that executes Pulse skills.

Get Dex running first. Once you have projects in your vault and Claude Code on your machine, come back here.

---

## What You Get

Pulse ships ready to explore. On first launch, you'll see four **Atlas** demo decks — a single fictional project moving through its full lifecycle:

| Deck | Skill | Theme | The Moment |
|---|---|---|---|
| Strategy Briefing | `/pulse-strategy` | Obsidian (dark) | Pitching the VP on why Atlas needs to happen |
| Project Kickoff | `/pulse-kickoff` | Ember (warm) | Aligning the execution team after approval |
| Sprint 2 Status | `/pulse-status` | Blue (light) | Week 5 — migration on track, review sessions slipping |
| Daily Standup | `/pulse-standup` | Blue (light) | Day 8 — clearing the review backlog before it compounds |

Click through all four. You'll see how the same project data tells a different story depending on who's in the room. You don't need a vault to explore the demos — just install Pulse and browse.

Under the hood:

- **4 skills** — status, strategy, standup, kickoff
- **3 themes** — Blue, Obsidian, Ember
- **14 slide types** — hero, context, problem, evidence, framework, roadmap, grid, pipeline, timeline, kpis, blockers, and more
- **MCP server** — skills push decks directly to Pulse, no clipboard involved
- **MISSING slides** — when data is absent, Pulse tells you what to add instead of making something up

---

## Quick Start for Dex Users (60 Seconds)

You already have Node, Git, Python, Claude Code, and MCP servers running. Here's the fast track:

```bash
git clone https://github.com/machovato/pulse.git
cd pulse
npm install
npm run setup    # point it at your vault when prompted
npm run dev
```

Open `http://localhost:3000`. Four Atlas demo decks are ready to explore.

If you provide your vault path during setup, Pulse copies the skills and registers the MCP server. Restart Claude Code, then:

```
/pulse-standup my-project
```

The deck appears in Pulse. No paste, no switching windows.

---

![Guided Install](docs/concierge-banner.png)

## Guided Install

If the quick start above doesn't match your setup — or you'd rather have a guide walk you through it — paste this into Claude Code or Claude Chat:

> You are the Pulse Repo Concierge — my friendly, patient guide who installs Pulse step-by-step like a friend sitting next to me.
>
> Pulse turns my project files into beautiful slide decks that appear in the browser. Repo: https://github.com/machovato/pulse
>
> Rules:
> - Start by asking what OS I'm on (Mac, Windows, or Linux)
> - Go ONE STEP AT A TIME. Never list all steps at once.
> - Check for Git, Node.js, and Python first. Help me install anything missing.
> - Then guide: clone → npm install → npm run setup → npm run dev
> - During setup, ask if I want the MCP server (automatic deck delivery, no copy-paste). Explain it in plain English.
> - After every command, ask "Did that work? Paste any error if not" and fix it before continuing.
> - If I skip MCP, show me how to use Pulse with manual copy-paste instead.
> - End by verifying: demo decks visible at localhost:3000, and if MCP is set up, one skill delivers a deck.
>
> Begin!

Claude will ask about your OS, check your prerequisites, walk you through every step, and troubleshoot anything that goes wrong — all tailored to your machine.

For reference, the manual steps are: `git clone` → `npm install` → `npm run setup` → `npm run dev`. See `docs/TROUBLESHOOTING.md` if you prefer to debug on your own.

---

## MCP — Automatic Deck Delivery

**Without MCP:**
```
Run skill → open JSON file → copy → open Pulse → paste → save → view
```

**With MCP:**
```
Run skill → deck appears in Pulse
```

Seven steps become two. For daily standups, that's the difference between "I should use this" and "I can't stop using this."

The MCP server is set up automatically during `npm run setup` if you provide your vault path. To verify it's working, type `/mcp` in Claude Code and look for:

```
pulse · ✅ connected
```

Pulse must be running (`npm run dev`) for delivery to work. If Pulse isn't running, the skill saves the JSON file as a fallback.

---

## The Four Skills

Each skill reads your project files and generates a specific kind of deck. Think of them like lenses — same project, different angle depending on the audience.

| Skill | Use Case | Theme | Leash |
|---|---|---|---|
| `/pulse-status` | Weekly project update | Blue | Medium — cites everything, no editorial spin |
| `/pulse-strategy` | Leadership briefing | Obsidian | Long — synthesizes patterns, builds a narrative |
| `/pulse-standup` | Daily standup | Blue | Short — yesterday, today, blockers. That's it. |
| `/pulse-kickoff` | Project launch | Ember | Shortest — charter-bound, nothing beyond the doc |

**"Leash"** is how much interpretation a skill is allowed. Short leash = stick tightly to the source files. Long leash = synthesize across them and build a story. Every skill follows the cardinal rule: **no invention.** If the data isn't there, the slide says [MISSING], not something that sounds plausible.

---

## Themes

Three built-in themes. Each one sets a different tone.

**Blue** (default) — Clean, light, professional. The workhorse. Good for any meeting where you want the data to speak.

**Obsidian** — Dark, high-contrast, boardroom-ready. For strategy decks where the room should lean forward.

**Ember** — Warm, collaborative, energetic. For kickoffs where you want the room to feel invited, not briefed.

Themes are set in the deck JSON (`meta.theme`) or from the editor dropdown. If no theme is specified, Blue applies automatically.

---

## MISSING Slides

When a skill can't find data for a slide, it doesn't guess. It shows a **MISSING slide** — a placeholder that tells you exactly what to add.

> **Project Timeline**
>
> No sprint dates or milestones found in project files.
>
> 💡 Add a timeline or sprint schedule to your project folder to populate this slide.

**The output teaches the input.** You run the skill, see what's missing, improve your vault, run it again. Over time, your project documentation gets better because Pulse keeps gently pointing at the gaps.

---

## Keyboard Shortcuts

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

Pulse is open source and MIT licensed.

**Prompters & workflow designers** → build new **skills**. See the `skills/` folder for the pattern.

**Want the easiest first contribution?** → add a **theme**. Drop a CSS file in `public/themes/`. See `docs/THEME-PLAYBOOK.md`.

**React/TypeScript developers** → build new **renderers**. See `SCHEMA.md` for slide types.

---

## Related Projects

| Project | Author | What It Does |
|---|---|---|
| [Dex](https://github.com/davekilleen/Dex) | Dave Killeen | AI Chief of Staff — personal OS for 25+ roles |
| [Claude Chief of Staff](https://github.com/mimurchison/claude-chief-of-staff) | Mike Murchison | CEO-oriented AI OS with inbox triage and relationship CRM |
| [AI Chief of Staff](https://github.com/tomochang/ai-chief-of-staff) | Tomo Chang | VP-oriented AI OS with multi-channel triage |

Pulse is the presentation layer these systems don't have.

---

## Credits & License

Built by Tony Melendez. Inspired by [Dave Killeen's Dex](https://github.com/davekilleen/Dex) and the AI Chief of Staff community.

Designed in Claude Chat. Built with Claude Code and Gemini. Powered by Next.js, Framer Motion, Prisma, and Zod.

Released under the MIT License. See `LICENSE` for details.