# Pulse Theme Playbook

How to add a new presentation theme to Pulse.

---

## What a Theme Is

A theme is a single CSS file in `public/themes/` that defines color tokens for slide layouts. Pulse loads the file dynamically based on the `meta.theme` value in the deck JSON. Every slide component reads from semantic CSS custom properties — override the tokens, the whole deck follows.

The three shipped themes are your reference:

- `blue.css` — light, professional (default)
- `obsidian.css` — dark, high-contrast
- `ember.css` — warm, collaborative

---

## Step 1: Create the CSS File

Copy an existing theme as your starting point:

```bash
cp public/themes/blue.css public/themes/yourtheme.css
```

Open it and replace the color values. The file uses `[data-theme="blue"]` as its root selector — change that to your theme name:

```css
[data-theme="yourtheme"] {
    --surface-primary: #YOUR_HEX;
    --surface-secondary: #YOUR_HEX;
    --accent-cool: #YOUR_HEX;
    /* ... */
}
```

Themes target layouts using `[data-theme][data-layout]` compound selectors:

```css
[data-theme="yourtheme"][data-layout="split"] {
    --surface-left: #YOUR_HEX;
    /* ... */
}

[data-theme="yourtheme"][data-layout="white"] {
    /* ... */
}
```

Look at `obsidian.css` for a dark theme example and `ember.css` for a warm/light theme example. Every token used by slide components is defined in these files.

---

## Step 2: Register the Theme (Optional)

Pulse loads any CSS file from `public/themes/` dynamically — your theme will work in the editor dropdown without any code changes.

However, if you want a template to **default** to your theme, register it in the template registry:

**File:** `src/config/templateRegistry.ts`

Add or update the `defaultTheme` for the template that should use your theme:

```typescript
{
    id: "yourtemplate",
    allowedSlideTypes: [...],
    defaultEyebrow: "Your Template",
    defaultTheme: "yourtheme"
}
```

---

## Step 3: Test It

1. Start Pulse: `npm run dev`
2. Open any existing deck in the editor
3. Change `meta.theme` to `"yourtheme"`
4. Click through every slide type and verify:
   - Text is readable on all surfaces
   - Eyebrows have sufficient contrast on both light and dark panels
   - Split layout left panels use the right background
   - Cards, badges, and icons pick up your accent colors
   - The hero slide KPI pills are legible

Pay special attention to split layouts — the left panel and right panel need different surface colors, and eyebrow/title text must contrast correctly against both.

---

## Token Reference

These are the key CSS custom properties your theme should define. See any shipped theme file for the complete list.

**Surfaces:**
- `--surface-primary` — main background
- `--surface-secondary` — card backgrounds
- `--surface-left` — split layout left panel (used in `[data-layout="split"]`)

**Text:**
- `--text-primary` — headings and body
- `--text-secondary` — supporting text
- `--text-muted` — captions, sources

**Accents:**
- `--accent-cool` — primary brand color (buttons, links, highlights)
- `--accent-warm` — secondary accent
- `--accent-success`, `--accent-warning`, `--accent-danger` — status indicators

**Borders & Effects:**
- `--border-card` — card outlines
- `--border-subtle` — dividers

---

## Checklist

- [ ] Created `public/themes/yourtheme.css`
- [ ] Defined all surface, text, accent, and border tokens
- [ ] Added `[data-theme="yourtheme"]` as root selector
- [ ] Added layout-specific overrides (`[data-layout="split"]`, `[data-layout="white"]`, etc.)
- [ ] Tested every slide type for readability and contrast
- [ ] Eyebrows readable on both light and dark panels
- [ ] Split layout left/right panels visually distinct
- [ ] (Optional) Registered default theme in `templateRegistry.ts`