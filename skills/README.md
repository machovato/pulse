# Pulse Skills

These are Claude Code / Cursor skills that generate Pulse-compatible JSON from your project files. They ship with the Pulse repo for easy discovery, but they run from your vault — not from this directory.

## Installation

Copy the skill files into your vault's skills directory:

```
your-vault/
  .claude/
    skills/
      pulse-status/
        SKILL.md
      pulse-strategy/
        SKILL.md
      pulse-standup/
        SKILL.md
      pulse-kickoff/
        SKILL.md
```

If you're using Cursor, place them wherever your workspace expects skill files.

## Usage

In Claude Code or Cursor, run:

```
/pulse-status my-project       # Weekly project update (5 slides)
/pulse-strategy my-project     # Leadership briefing — SCQA framework (5+ slides)
/pulse-standup my-project      # Daily standup (5 slides)
/pulse-kickoff my-project      # Project kickoff from charter (8 slides)
```

Replace `my-project` with the name of a project in your vault.

The skill scans your project files, generates a JSON file, and saves it to your project folder. Paste the JSON into the Pulse editor at `http://localhost:3000` to render your deck.

## What Each Skill Does

| Skill | Meeting Type | Theme | Leash Length |
|---|---|---|---|
| `pulse-status` | Weekly update | Default (light) | Medium — cites everything |
| `pulse-strategy` | Leadership / SteerCo | Obsidian (dark) | Long — synthesis expected |
| `pulse-standup` | Daily standup | Default (light) | Short — sprint-scoped, no filter |
| `pulse-kickoff` | Project launch | Ember (warm) | Shortest — charter-bound |

## Design Principles

All skills follow these rules:

- **Vault-agnostic.** Skills say "find the project" — not "look in a specific folder." They work with any vault structure.
- **No invention.** Every data point is sourced from your files. If a field can't be found, it's flagged as MISSING, not filled with a guess.
- **Citation required.** Every claim on a slide traces back to a source file.

## Customization

These skills are markdown files — you can read and modify them. Common customizations:

- Adjust word limits (e.g., 15-word body limit on standup cards)
- Change the default theme for a skill
- Add or remove expected slide types
- Modify speaker note guidance

The skill files are well-commented. Read the Design Principle section at the top of each one to understand the intent before changing anything.