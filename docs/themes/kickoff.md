# Kickoff Template Specification

**Template Name:** `kickoff`
**Personality:** "Organized launch. We have a plan, here's what's happening."
**Differentiation:** Earthy, structured, professional. While Status is tactical (gray/blue) and Strategy is premium (navy/mint), Kickoff centers on slate and teal with burnt orange accents. This establishes an intentional, forward-moving aesthetic without crossing into "status update" territory.

## Color Tokens

| Token Usage | HEX Value | Description |
| :--- | :--- | :--- |
| **Primary surface** | `#1E293B` | Dark slate. Used for Hero gradient, nav bar, and primary card backgrounds. |
| **Secondary surface** | `#1A5C5C` | Dark teal. Used for Sidebar panels, KPI cards, emphasis containers. |
| **Accent** | `#C4652A` | Burnt orange. Used for Eyebrows, badges, borders, accent text. |
| **Danger (Custom)** | `#8B3A3A` | Muted brick red. Serious but not screaming; earthy and professional. |
| **Warning (Custom)** | `#B8860B` | Deep amber. Warm, urgent, but distinct from the burnt orange accent. |
| **Success** | `#3D7B4F` | Forest green. Done states, completed milestones. |
| **Card background** | `#FFFFFF` | Standard content cards. |
| **Card surface muted**| `#F8FAFC` | Light slate. FYI cards, attribution blocks. |
| **Text primary (light)**| `#1E293B` | Dark slate. Body text on white cards. |
| **Text primary (dark)** | `#FFFFFF` | White. Text on slate/teal surfaces. |
| **Text accent** | `#C4652A` | Burnt orange. Highlighted words, eyebrow labels. |
| **Border default** | `#E2E8F0` | Light gray. Standard card borders. |
| **Border accent** | `#C4652A` | Burnt orange. Action card left borders. |

## Supported Slide Types
The Kickoff template natively supports all existing Pulse slide architecture:
- Hero
- Context
- Problem
- Evidence
- Framework
- Grid
- Timeline
- Roadmap
- Pipeline
- Blockers
- Callout
- Decision Log

*All components read CSS custom properties dynamically, inheriting these exact hexes immediately when `<body className="theme-kickoff">` engages.*
