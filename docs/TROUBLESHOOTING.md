# Troubleshooting

Common issues when installing and running Pulse, organized by when you'll hit them.

---

## During Install

### `python` is not recognized / command not found

Pulse's build tools may require Python for native module compilation. Install Python before running `npm install`:

- **Windows:** Download from [python.org](https://www.python.org/downloads/) or run `choco install python` if you use Chocolatey. Make sure "Add Python to PATH" is checked during install.
- **Mac:** `brew install python3` or download from [python.org](https://www.python.org/downloads/).
- **Linux:** `sudo apt install python3` (Ubuntu/Debian) or `sudo dnf install python3` (Fedora).

After installing, close and reopen your terminal, then verify with `python --version` before continuing.

### `npm install` fails with `node-gyp` errors

This is the Python issue above in disguise. `node-gyp` compiles native modules and needs Python + build tools.

- **Windows:** Install Python (above), then run `npm install -g windows-build-tools` from an admin terminal.
- **Mac/Linux:** Install Python (above) and retry `npm install`.

### `npm install` fails with permission errors

- **Mac/Linux:** Don't use `sudo npm install`. Instead, fix npm permissions: `npm config set prefix ~/.npm-global` and add `~/.npm-global/bin` to your PATH.
- **Windows:** Run your terminal as Administrator, or use the Node.js command prompt that ships with the installer.

---

## During Setup

### `npm run setup` — what is the vault path?

Your vault is the folder of markdown files that Claude Code or Cursor manages. Common locations:

- **Dex users:** Usually `~/Documents/Dex/` or wherever you pointed Dex during its setup.
- **Claude Code users:** The folder you open Claude Code in — the one with your project folders, tasks, meeting notes, etc.
- **Not sure:** Open Claude Code, type `pwd`, and use that path.

If you don't have a vault yet, stop here. Set up [Dex](https://github.com/davekilleen/Dex) first, then come back.

### `npm run setup` asks about MCP — what is that?

MCP (Model Context Protocol) is a bridge between Claude Code and Pulse. Without it, you manually copy JSON from your vault into Pulse. With it, skills push artifacts directly to Pulse — no clipboard involved.

Say yes unless you have a reason not to. You can always add MCP later by re-running `npm run setup`.

---

## During Runtime

### Skills run but nothing appears in Pulse

**Most common cause:** Pulse isn't running. Skills need Pulse's local server (`npm run dev`) to receive artifacts via MCP. Check that your Pulse terminal is still open and showing `ready on http://localhost:3000`.

**Fix:** Start Pulse in a separate terminal with `npm run dev`, then re-run the skill. The JSON fallback file is in your project's `pulse/` folder if you need to re-push it manually.

### "Where do I run the skill?"

Skills run in **Claude Code's chat interface** — not in the terminal. The terminal running Claude Code just keeps the process alive. Type `/pulse-status my-project` in Claude Code's chat panel and send it.

Two terminals should be open:

```
Terminal 1 (Pulse):       npm run dev        ← leave this running
Terminal 2 (Claude Code): claude             ← interact via chat, not this terminal
```

### `localhost:3000` won't load

- **Is Pulse running?** Check the terminal where you ran `npm run dev`. If it crashed, restart it.
- **Port conflict:** Something else is using port 3000. Kill it (`lsof -i :3000` on Mac/Linux, `netstat -ano | findstr :3000` on Windows) or change Pulse's port: `PORT=3001 npm run dev`.
- **Windows firewall:** Windows may prompt to allow Node.js through the firewall. Click "Allow access" when prompted.

### MCP shows disconnected in Claude Code

Run `/mcp` in Claude Code. If Pulse isn't listed or shows disconnected:

1. Make sure Pulse is running (`npm run dev` in its own terminal).
2. Restart Claude Code — it reads MCP config on startup.
3. Re-run `npm run setup` to re-register the MCP server if needed.

### Skill runs but the deck/post looks wrong

- **Missing data:** Check for [MISSING] slides or placeholders. These mean your project files don't have the data the skill expected. Add the missing content to your vault and re-run.
- **Wrong template:** Each skill has a default template and theme. Check the skill's `SKILL.md` for what it expects.
- **Edit it:** Press `E` to edit a single slide or `Shift + E` to edit the full deck JSON directly in Pulse.

---

## Database Issues

### Demo decks aren't showing up

Run the database seed:

```bash
npx prisma db seed
```

If that fails, reset and re-seed:

```bash
npx prisma migrate reset
```

This drops and recreates the database with fresh demo data.

### `prisma` errors on startup

Make sure migrations are current:

```bash
npx prisma migrate dev
```

If you're getting schema mismatch errors after a `git pull`, this is usually the fix.

---

## Still Stuck?

Open an issue on [GitHub](https://github.com/machovato/pulse/issues) with:

- Your OS and Node version (`node --version`)
- The exact error message
- Which step you were on when it broke
