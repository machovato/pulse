---
description: How to add a new presentation template to Pulse
---
# Pulse Theme Playbook
This document outlines the exact, repeatable sequence required to add a new presentation template (theme) to Pulse. Following this playbook ensures the new template is recognized by the schema, renders with the correct CSS tokens, and is completely free of legacy hardcoded styles.

## Step 1: Register the Template in the Schema
Before Pulse can read a new template, it must be whitelisted in the data validation layer.
1. Open `src/lib/schema.ts`
2. Locate `MetaSchema`
3. Add your new template string to the `template` enum.
   ```typescript
   export const MetaSchema = z.object({
       // ...
       template: z.enum(["status", "allHands", "requirements", "strategy", "kickoff", "yourNewTheme"]),
   });
   ```

## Step 2: Define Color Tokens in CSS
Pulse uses CSS Custom Properties applied dynamically based on the active template.
1. Open `src/styles/globals.css`
2. Find the theming blocks (e.g., `.theme-strategy`, `.theme-status`)
3. Create a new block: `.theme-[yourNewThemeName]`
4. Define the core color tokens. Ensure you define `danger` and `warning` specifically to match your theme's aesthetic instead of relying on defaults.
5. In addition to primary tokens, map specific component variants like `--surface-split` (used in 40/60 split slides):
   ```css
   .theme-yourNewThemeName {
       --surface-primary: #YOUR_HEX;
       --surface-split: #YOUR_HEX;
       --accent-info: #YOUR_HEX;
       /* ... map all variables ... */
   }
   ```

## Step 3: Configure Dark Surface Typography Protocol
If your theme includes dark surfaces (e.g., slate, navy, dark teal), you need to ensure text automatically inverts to white without needing manual Tailwind classes.
1. Inside `src/styles/globals.css`, locate the `/* Dark Surface Text Inversion */` section.
2. Add your theme's constraint:
   ```css
   .theme-yourNewThemeName .dark-surface {
       --text-primary: #FFFFFF;
       --text-secondary: rgba(255, 255, 255, 0.7);
       --text-muted: rgba(255, 255, 255, 0.5);
       /* Override specific shades as needed */
   }
   ```

## Step 4: The Hardcoded "Search & Destroy" Audit
A new theme will immediately break visually if existing components use tightly coupled Tailwind hex codes. Do not skip this step!
1. Run a global regex search in your editor or via standard IDE tools for:
   - `text-[#`
   - `bg-[#`
   - `border-[#`
2. Replace every single hardcoded hex value with its mapped semantic Tailwind variable (e.g., `text-accent-info`, `bg-surface-primary`).

## Step 5: Test via Mock Data
End-to-end testing requires a real slide payload rendered in the new theme.
1. Duplicate an existing robust deck (e.g., `src/app/data/strategy-deck.ts`) into a new file: `src/app/data/[yourNewTheme]-deck.ts`.
2. Update the exported `id` string (e.g., "new-theme-demo").
3. Change `meta.template` to `"yourNewTheme"`.
4. Open the home page `src/app/(app)/page.tsx` and wire up a new "Play [Theme]" button routing to `/deck/[new-theme-id]`.
5. Launch the dev server, hit the new play button, and verify every single slide type (Hero, Blockers, Context, Grid, Timeline, etc.) honors your new CSS tokens precisely.

## Checklist for Adding a Theme
- [ ] Registered theme name in `src/lib/schema.ts`
- [ ] Added `.theme-name` variables to `src/styles/globals.css`
- [ ] Configured `.dark-surface` inversion rules in CSS
- [ ] Audited the entire `src/components/slides/` directory for hardcoded hexes
- [ ] Generated `[theme]-deck.ts` mock data
- [ ] Placed test button on the homepage
