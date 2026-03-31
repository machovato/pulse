# V3: Voice Layer, Documentation Overhaul, and the Publishing Reframe

*Date: March 31, 2026*

## Vision
Pulse isn't a deck generator that also does LinkedIn posts. It's a publishing layer — the vault captures the work, Pulse transforms it into whatever the moment requires. V3 makes that real by treating voice as a first-class concept, filling the documentation gaps that would block adoption, and reframing the entire project around what it actually is.

## Objective
Three goals in one session: (1) give Pulse the infrastructure to sound like its user, not like an AI; (2) make the repo self-explanatory to someone who's never seen it; (3) ship the LinkedIn skill as a distributable asset.

## What We Did

1. **README Rewrite**: Complete overhaul. Reframed Pulse from "presentation engine" to "publishing layer." Added a "Before You Install" section with an ASCII two-terminal diagram so users understand the Claude Code + Pulse architecture before they hit Quick Start. Updated the skills table to split Deck Skills and Content Skills. Added a "Newly Added: The LinkedIn Skill" section with screenshot. Fixed dead cross-references (`#how-it-runs` → `#before-you-install`, `skills/linkedin/` → `skills/pulse-linkedin/`).

2. **Guided Install Concierge Prompt Strengthened**: Three additions based on simulation testing — (a) vault path check before setup begins, (b) Python/node-gyp install instruction for Windows, (c) explicit clarification that Claude Code chat (not Pulse) is where users run skills.

3. **TROUBLESHOOTING.md Created**: New file organized by failure phase — install, setup, runtime, database. Covers Python/node-gyp, vault path confusion, "where do I run the skill?", Windows firewall, port conflicts, MCP disconnection, and Prisma migration issues.

4. **ARCHITECTURE.md Created**: Merged two sources — the remote repo's AI-optimized directory taxonomy with a new strategic decisions document covering the core model, MCP architecture rationale, leash concept, renderer architecture, two-terminal diagram, architectural decisions table, and "Adding a New Format" checklist.

5. **`pulse-linkedin` Skill Shipped to Repo**: Created `skills/pulse-linkedin/` with three files — a generalized `SKILL.md` (all personal references removed, content pillars inferred from voice file instead of hardcoded), a template `linkedin-voice.md` (structure intact, placeholders for user customization, AI Guardrails table populated with defaults), and an empty `published.md` for post memory. The `scripts/setup.js` filter (`d.startsWith('pulse-')`) picks it up automatically — no code change needed.

6. **Voice Setup Assistant**: Designed a paste-able Claude Code prompt that interviews users about their writing style and generates a customized `linkedin-voice.md`. Pattern borrowed from PromptEQ — archetype-first (Storyteller, Teacher, Provocateur, Observer) seeds defaults, then five targeted questions sharpen voice principles, followed by writing sample collection, anti-pattern identification, and audience definition. Prompt lives in `skills/pulse-linkedin/VOICE-SETUP.md`.

7. **Voice Setup Drawer (Antigravity)**: Built a slideout drawer on the LinkedIn post editor page. Triggered by a "Customize your voice" button in the editor footer bar. Drawer contains explanation, status indicator (placeholder for v1), the full Voice Setup prompt in a terminal-styled copyable block, and a copy button. Uses Radix Dialog for accessibility and Framer Motion for animation.

## How We Did It

- Simulated the Guided Install concierge prompt end-to-end to find gaps — surfaced the vault check, Python rule, and Claude Code chat confusion that the original prompt missed.
- Pressure-tested the Voice Setup Assistant by emulating a full 6-step interview against the template voice file. Validated that archetype seeding, minimum example enforcement, and the gut-check gate on synthesized principles all work as designed.
- Resolved the LinkedIn skill distribution problem by leveraging the existing `setup.js` filter pattern — naming the folder `pulse-linkedin/` meant zero code changes to the install pipeline.
- Merged ARCHITECTURE.md from two competing sources (remote's technical map + our strategic decisions doc) rather than shipping duplicates.
- Cloned and analyzed the PromptEQ repo to extract the archetype → slider → generate pattern as the UX model for the Voice Setup Assistant interview flow.

## What's Next

- **Voice status API**: Replace the mocked "Configured/Not configured" badge in the drawer with a real check — read the voice file and detect whether it still contains template placeholder text.
- **Hook character limit reconciliation**: The skill file and some README versions reference 150 chars; others reference 210. Needs a single source of truth.
- **Manual cleanup**: `README-draft.md` and `docs/ARCHITECTURE.md.bak` still need deletion.
- **GitHub push**: README, TROUBLESHOOTING.md, ARCHITECTURE.md, and `pulse-linkedin/` skill folder are staged and ready.
