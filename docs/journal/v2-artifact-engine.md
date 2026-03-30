# V2: From Presentation Builder to Unified Artifact Engine

*Date: March 30, 2026*

## Vision
The overarching goal was to evolve Pulse well beyond its original scope as a single-format tool (Presentation Decks). The vision is to establish Pulse as a true "Personal OS"—a central hub capable of generating, storing, organizing, and rendering a multitude of completely different output formats, beginning by incorporating specialized LinkedIn Social Posts.

## Objective
Seamlessly integrate LinkedIn social writing into the platform without cluttering the UI or confusing the user experience, proving that Pulse's engine can handle radically different data models simultaneously.

## What We Did
1. **Schema Expansion**: Added the `Post` schema to the Prisma database (`schema.prisma`) to natively store platform-specific textual drafts, completely separate from the `Update` (Deck) model.
2. **The "News Feed" Architecture**: Overhauled the homepage to shift away from a simple static list of files and tabs, introducing a chronological "All Activity" Timeline feed.
3. **Visual Segmenting**: Because we blended presentation slide decks with social media text posts, we introduced specific brand-colored left border accents: `#0A66C2` (true blue) for LinkedIn Posts, and `#D04423` (deep red-orange) for Presentation Decks. We supplemented this with explicit "Eyebrow" hierarchy badges so different artifact types remain instantly scannable when mixed together in a single list.
4. **Pinning Parity**: Upgraded the `Post` schema to support boolean pinning. We updated the rendering components to parse and isolate pinned artifacts—whether they are Decks or Posts—to the absolute top of the timeline feed in a designated `Pinned` block.

## How We Did It
- Leveraged `type TimelineItem` union types and `Promise.all` inside Next.js's server components to safely fetch and merge `DeckRow` and `PostRow` data into a single, perfectly sequenced chronological array.
- Avoided overlapping parent flexbox bounds by rendering the accent borders as `absolute left-0` stripes directly inside `overflow-hidden` container cards (`DeckRowItem` and `PostRowItem`). 
- Utilized Next.js App Router (`useRouter().replace()`) to attach deep-linking URL modifications directly to `onClick` tab buttons (`/?tab=posts`), ensuring UI states are organically bookmarkable and shareable without requiring hard page refreshes.

## Value Added for V3
By building a generic Timeline engine and the flexible `ArtifactTabs` container, the foundation is now rigidly tested to handle *any* future artifact. 

When we eventually move to V3, adding "Email Summaries", "Memos", "Dashboards", or "Meeting Transcripts" will simply mean plugging a newly defined data type into the `TimelineItem` pipeline without needing to rethink or rebuild the core homepage architecture.
