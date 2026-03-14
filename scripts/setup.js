#!/usr/bin/env node

/**
 * scripts/setup.js
 * One-command local dev setup. Runs the pre-publish checklist:
 *   1. Install dependencies
 *   2. Create .env from .env.example (if missing)
 *   3. Generate Prisma client
 *   4. Push schema to local SQLite
 *   5. Seed example decks
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function run(cmd, label) {
    console.log(`\n\u2500\u2500 ${label} \u2500\u2500`);
    console.log(`$ ${cmd}\n`);
    execSync(cmd, { cwd: ROOT, stdio: "inherit" });
}

// 1. Install dependencies
run("npm install", "Installing dependencies");

// 2. Create .env if it doesn't exist
const envPath = path.join(ROOT, ".env");
const envExamplePath = path.join(ROOT, ".env.example");

if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log("\n\u2500\u2500 Created .env from .env.example \u2500\u2500");
        console.log("   Edit .env if you need to change defaults (SQLite is pre-configured).\n");
    } else {
        // Write minimal .env for local SQLite dev
        const defaultEnv = [
            'DATABASE_URL="file:./dev.db"',
            'DB_PROVIDER="sqlite"',
            'NEXT_PUBLIC_APP_URL="http://localhost:3000"',
            "",
        ].join("\n");
        fs.writeFileSync(envPath, defaultEnv, "utf-8");
        console.log("\n\u2500\u2500 Created .env with SQLite defaults \u2500\u2500\n");
    }
} else {
    console.log("\n\u2500\u2500 .env already exists, skipping \u2500\u2500\n");
}

// 3. Generate Prisma client
run("npx prisma generate", "Generating Prisma client");

// 4. Push schema to local database
run("npx prisma db push", "Pushing schema to database");

// 5. Seed example decks
run("npm run db:seed", "Seeding example decks");

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('📋 Optional: Install Pulse skills and MCP Server into your vault.');
rl.question('   Enter absolute path to your active vault (or press enter to skip): ', (answer) => {
    const vaultPath = answer.trim();
    
    if (vaultPath) {
        // --- Skill Copy ---
        console.log('\n📦 Copying Pulse skills to vault...');
        const claudeSkillsDir = path.join(vaultPath, '.claude', 'skills');
        if (!fs.existsSync(claudeSkillsDir)) {
            fs.mkdirSync(claudeSkillsDir, { recursive: true });
        }
        
        const skillsRoot = path.join(ROOT, 'skills');
        const skillDirs = fs.readdirSync(skillsRoot).filter(d => d.startsWith('pulse-'));
        
        for (const dir of skillDirs) {
            const src = path.join(skillsRoot, dir);
            const dest = path.join(claudeSkillsDir, dir);
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            
            const files = fs.readdirSync(src);
            for (const file of files) {
                fs.copyFileSync(path.join(src, file), path.join(dest, file));
            }
        }
        console.log('   ✅ Skills copied successfully');

        // === MCP Server Setup ===
        console.log('');
        console.log('🔌 Pulse MCP Server');
        console.log('   Lets Claude Code skills push decks directly to Pulse.');
        console.log('   Requires Python 3.10+ (already installed if you use Dex).');
        console.log('');

        // 1. Check Python
        let pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
        let fallbackCmd = process.platform === 'win32' ? 'python3' : 'python';
        try {
            execSync(`${pythonCmd} --version`, { stdio: 'pipe' });
        } catch {
            try {
                execSync(`${fallbackCmd} --version`, { stdio: 'pipe' });
                pythonCmd = fallbackCmd;
            } catch {
                console.log('⚠️  Python not found. MCP setup skipped.');
                console.log('   Install Python 3.10+ from https://python.org');
                pythonCmd = null;
            }
        }

        if (pythonCmd) {
            // Install MCP SDK
            console.log('   Installing MCP dependencies...');
            try {
                execSync(`${pythonCmd} -m pip install mcp`, { stdio: 'inherit' });
            } catch {
                console.log('⚠️  Could not install MCP package.');
                console.log(`   Try manually: ${pythonCmd} -m pip install mcp`);
            }

            // 2. Copy MCP server to vault
            const mcpDir = path.join(vaultPath, 'mcp');
            if (!fs.existsSync(mcpDir)) fs.mkdirSync(mcpDir, { recursive: true });
            fs.copyFileSync(
                path.join(ROOT, 'mcp', 'pulse_server.py'),
                path.join(mcpDir, 'pulse_server.py')
            );
            console.log('   ✅ MCP server installed in vault');

            // 3. Register in .mcp.json
            const mcpConfigPath = path.join(vaultPath, '.mcp.json');
            let mcpConfig = { mcpServers: {} };

            if (fs.existsSync(mcpConfigPath)) {
                try {
                    mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf-8'));
                    fs.copyFileSync(mcpConfigPath, mcpConfigPath + '.backup');
                } catch {
                    console.log('⚠️  Could not parse existing .mcp.json. Overwriting with clean config.');
                }
            }

            if (!mcpConfig.mcpServers) mcpConfig.mcpServers = {};
            
            mcpConfig.mcpServers.pulse = {
                command: pythonCmd,
                args: [path.join(mcpDir, 'pulse_server.py')]
            };

            fs.writeFileSync(mcpConfigPath, JSON.stringify(mcpConfig, null, 2));
            console.log('   ✅ MCP registered in .mcp.json');
            console.log('');
            console.log('   Restart Cursor/Claude Code to activate.');
            console.log('   Look for the green "pulse" checkmark in the MCP panel.');
        }
    } else {
        console.log('\n   Skipped skill and MCP installation.');
        console.log('   See skills/README.md for manual install instructions.');
    }

    console.log("\n✅ Setup complete! Run 'npm run dev' to start the dev server.\n");
    rl.close();
});
