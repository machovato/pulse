import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Demo decks for first-time users.
// These showcase the four Pulse skills (strategy, kickoff, status, standup)
// following a single project ("Atlas") through its lifecycle.
// Users can safely delete these from the UI after exploring.

const deck1 = {
  "schemaVersion": 2,
  "meta": {
    "title": "Atlas — Strategy Briefing",
    "eyebrow": "Strategy Briefing",
    "subtitle": "Centralizing documentation saves 5+ hours per employee per week and eliminates the #1 support escalation driver.",
    "date": "2026-01-15",
    "audience": "exec",
    "template": "strategy",
    "theme": "obsidian",
    "rag": "yellow",
    "headline": "Centralizing documentation saves 5+ hours per employee per week and eliminates the #1 support escalation driver.",
    "project": "Atlas"
  },
  "slides": [
    {
      "type": "hero",
      "title": "Atlas",
      "notes": "Open with the punchline: the documentation problem isn't an inconvenience — it's a measurable cost. 5 hours per person per week across 200 employees is 52,000 hours a year. That's the forcing function.",
      "data": {
        "subtitle": "Strategy Briefing — January 2026",
        "rag": "yellow",
        "headline": "Centralizing documentation saves 5+ hours per employee per week and eliminates the #1 support escalation driver.",
        "kpis": [
          { "label": "Hours Wasted/Week", "value": "5.2 avg", "icon": "clock" },
          { "label": "Support Escalations", "value": "34% doc-related", "icon": "message-circle" },
          { "label": "Legacy Articles", "value": "2,400", "icon": "file-text" }
        ]
      }
    },
    {
      "type": "context",
      "title": "Where We Are",
      "notes": "Settled ground — get four nods before introducing the tension. If Jordan pushes back on any of these, the rest of the deck falls apart.",
      "data": {
        "eyebrow": "Current State",
        "items": [
          {
            "title": "Documentation Lives in 6+ Systems",
            "body": "Confluence, SharePoint, Google Drive, Slack pins, personal wikis, and tribal knowledge.",
            "icon": "layers",
            "status": "confirmed"
          },
          {
            "title": "Support Team Bears the Cost",
            "body": "34% of Tier 2 escalations trace back to missing documentation.",
            "icon": "headphones",
            "status": "confirmed"
          },
          {
            "title": "Onboarding Takes 3x Longer Than Benchmark",
            "body": "Six weeks instead of two. Documentation gaps are the primary driver.",
            "icon": "user-plus",
            "status": "confirmed"
          },
          {
            "title": "Platform Decision Already Made",
            "body": "Zendesk Guide approved in November. Budget allocated.",
            "icon": "check-square",
            "status": "confirmed"
          }
        ]
      }
    },
    {
      "type": "problem",
      "title": "The Complication",
      "notes": "The primary tension — no structured KB for self-serve customers — is what Jordan is accountable for. If the KB doesn't exist when tiered support launches, base-tier customers get nothing.",
      "data": {
        "eyebrow": "Risk",
        "primary": {
          "title": "Self-Serve Customers Get Nothing Without a KB",
          "body": "Tiered support commits base-tier to self-serve only. No KB exists. July 29 is fixed.",
          "icon": "alert-triangle",
          "severity": "critical"
        },
        "secondary": [
          {
            "title": "60% of Content Is Outdated",
            "body": "1,440 of 2,400 articles are stale, duplicated, or contradictory.",
            "icon": "copy",
            "severity": "high"
          },
          {
            "title": "Knowledge Lives in People",
            "body": "When Casey's team is unavailable, resolution time doubles.",
            "icon": "users",
            "severity": "high"
          },
          {
            "title": "Competitors Moving Faster",
            "body": "Three competitors launched self-serve portals in 12 months.",
            "icon": "trending-up",
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "type": "evidence",
      "title": "What the Evidence Shows",
      "notes": "Lead with the time audit — 5.2 hours makes executives do math. The support data seals it: not just efficiency, it's customer retention.",
      "data": {
        "eyebrow": "Proof Points",
        "points": [
          {
            "metric": "5.2 hrs/week",
            "label": "Time searching for docs",
            "source": "Time audit, Dec 2025 (n=84)",
            "type": "quantified",
            "body": "A full workday per week lost to finding information."
          },
          {
            "metric": "34%",
            "label": "Escalations from doc gaps",
            "source": "Ticket analysis, Q4 2025",
            "type": "quantified",
            "body": "One-third of escalations are knowledge issues."
          },
          {
            "metric": "3x",
            "label": "Onboarding vs. benchmark",
            "source": "HR data, 2025 cohort",
            "type": "quantified",
            "body": "Six weeks instead of two. Docs are the driver."
          },
          {
            "metric": "#1 request",
            "label": "Top support team ask",
            "source": "Casey Martinez, Jan 2026",
            "type": "qualitative",
            "body": "Customer-facing teams confirm: docs are the top pain."
          }
        ]
      }
    },
    {
      "type": "framework",
      "title": "The Architecture",
      "notes": "Three layers of ownership. Inner ring: Atlas controls directly. Middle: requires Casey's cooperation. Outer: depends on the whole org.",
      "data": {
        "eyebrow": "Ownership Model",
        "lanes": [
          {
            "title": "Content Structure & Migration",
            "body": "Taxonomy, metadata, migration tooling. Atlas team owns.",
            "icon": "database",
            "type": "control",
            "rank": 1
          },
          {
            "title": "Search & Discovery",
            "body": "Search config, navigation, cross-linking. Platform team.",
            "icon": "search",
            "type": "control",
            "rank": 2
          },
          {
            "title": "SME Review & Editorial",
            "body": "Experts validate content. 4 hrs/wk per department.",
            "icon": "user-check",
            "type": "influence",
            "rank": 3
          },
          {
            "title": "Adoption & Feedback",
            "body": "Analytics, feedback, freshness. Org-wide change needed.",
            "icon": "activity",
            "type": "concern",
            "rank": 4
          }
        ]
      }
    },
    {
      "type": "roadmap",
      "title": "The Path",
      "notes": "Phase 1 is underway — coming with work in progress signals confidence. July 29 is the business's deadline, not ours.",
      "data": {
        "eyebrow": "Timeline",
        "milestones": [
          {
            "label": "Phase 1: Foundation",
            "date": "2026-02-28",
            "state": "current",
            "detail": "Content audit, taxonomy, metadata schema, migration toolkit."
          },
          {
            "label": "Phase 2: Migration & Review",
            "date": "2026-05-15",
            "state": "upcoming",
            "detail": "Batch migration, SME review, search config, editorial workflow."
          },
          {
            "label": "Phase 3: Launch & Adoption",
            "date": "2026-07-29",
            "state": "upcoming",
            "detail": "Go-live with tiered support. Feedback loops, freshness monitoring."
          }
        ]
      }
    },
    {
      "type": "blockers",
      "title": "What We Need",
      "notes": "Casey's 4 hours per week is the critical ask. Without SME review, the timeline stalls at Phase 2.",
      "data": {
        "eyebrow": "The Ask",
        "items": [
          {
            "text": "SME review: 4 hrs/wk from Casey's team through Phase 2",
            "severity": "action",
            "owner": "Jordan → Casey Martinez",
            "badges": ["Critical path"]
          },
          {
            "text": "Engineering: Riley's team confirmed for platform work",
            "severity": "approval",
            "owner": "Jordan",
            "badges": ["Q2 headcount"]
          },
          {
            "text": "Executive sponsorship for org-wide adoption",
            "severity": "approval",
            "owner": "Jordan",
            "badges": ["Needed by June"]
          },
          {
            "text": "Legacy wiki archived, not maintained in parallel",
            "severity": "fyi",
            "owner": "All department leads"
          }
        ]
      }
    }
  ]
};

const deck2 = {
  "schemaVersion": 2,
  "meta": {
    "title": "Atlas — Project Kickoff",
    "eyebrow": "Leadership Briefing",
    "subtitle": "This project produces the knowledge base your teams need — and the template that scales it to every department.",
    "date": "2026-02-03",
    "audience": "team",
    "template": "kickoff",
    "theme": "ember",
    "rag": "green",
    "headline": "This project produces the knowledge base your teams need — and the template that scales it to every department.",
    "project": "Atlas"
  },
  "slides": [
    {
      "type": "hero",
      "title": "Atlas",
      "notes": "Jordan approved the strategy two weeks ago. This room is the execution team — they need to leave knowing what's being built, when it lands, and what you need from them. The mission statement should feel like a done deal, not a pitch.",
      "data": {
        "subtitle": "Project Kickoff — February 2026",
        "rag": "green",
        "headline": "This project produces the knowledge base your teams need — and the template that scales it to every department.",
        "kpis": [
          { "label": "Duration", "value": "6 months", "icon": "calendar" },
          { "label": "Sprints", "value": "4", "icon": "layers" },
          { "label": "Go-Live", "value": "July 29", "icon": "flag" }
        ]
      }
    },
    {
      "type": "context",
      "title": "What Everyone Agrees On",
      "notes": "Four nods. These are facts the room already knows. The budget approval and platform selection signal executive backing.",
      "data": {
        "eyebrow": "Shared Reality",
        "items": [
          {
            "title": "Docs Scattered Across 6+ Systems",
            "body": "Confluence, SharePoint, Google Drive, Slack pins, personal wikis. No single source of truth.",
            "icon": "layers",
            "status": "confirmed"
          },
          {
            "title": "Tiered Support Launches July 29",
            "body": "Base-tier customers become self-serve only. The KB is the product.",
            "icon": "calendar",
            "status": "confirmed"
          },
          {
            "title": "Zendesk Guide Selected",
            "body": "Enterprise tier approved in November. Budget allocated, contract in progress.",
            "icon": "check-square",
            "status": "confirmed"
          },
          {
            "title": "Strategy Endorsed by Jordan",
            "body": "Full 4-sprint plan approved. This briefing is the execution handoff.",
            "icon": "shield-check",
            "status": "confirmed"
          }
        ]
      }
    },
    {
      "type": "problem",
      "title": "Why This Matters",
      "notes": "Don't relitigate the strategy — the room bought the ticket. Thirty-second reminder of why we're here. Keep it brief, move to deliverables.",
      "data": {
        "eyebrow": "Anchor Tension",
        "primary": {
          "title": "No KB Means No Self-Serve on July 29",
          "body": "Tiered model is committed. Base-tier has no human fallback. No KB means a blank page.",
          "icon": "alert-triangle",
          "severity": "critical"
        },
        "secondary": [
          {
            "title": "2,400 Articles — 60% Outdated",
            "body": "Content audit confirmed: most existing docs can't be migrated as-is.",
            "icon": "file-x",
            "severity": "high"
          },
          {
            "title": "Knowledge in Individuals",
            "body": "Casey's team holds critical product knowledge never documented.",
            "icon": "user",
            "severity": "moderate"
          }
        ]
      }
    },
    {
      "type": "evidence",
      "title": "Why This Plan Will Work",
      "notes": "Build trust in the lead and the approach. Phase 0 completion shows competence. The AI audit speed is the wow moment.",
      "data": {
        "eyebrow": "Credibility",
        "points": [
          {
            "metric": "Phase 0 Done",
            "label": "Audit and taxonomy complete",
            "source": "Atlas project file, Jan 2026",
            "type": "quantified",
            "body": "Not starting from zero. Audit, taxonomy, and schema are done."
          },
          {
            "metric": "2,400 in 45 min",
            "label": "AI-powered content audit",
            "source": "Atlas Phase 0 report",
            "type": "quantified",
            "body": "Every article processed in 45 minutes. Reproducible."
          },
          {
            "metric": "7 categories",
            "label": "Taxonomy validated",
            "source": "Taxonomy validation, Jan 2026",
            "type": "quantified",
            "body": "Absorbed two source systems without modification."
          },
          {
            "metric": "Endorsed",
            "label": "Executive approval",
            "source": "Jordan, 1:1, Jan 30",
            "type": "qualitative",
            "body": "Charter approved. Kickoff directed to execution team."
          }
        ]
      }
    },
    {
      "type": "grid",
      "title": "What We're Delivering",
      "notes": "Four concrete outputs. The audience should point to each and know what it is, who owns it, and when it lands. The conversion template is the long-term play.",
      "data": {
        "eyebrow": "Deliverables",
        "cards": [
          {
            "title": "Migrated Knowledge Base",
            "body": "2,400 articles audited, cleaned, migrated to Zendesk Guide with metadata.",
            "icon": "database"
          },
          {
            "title": "Intent-Based Taxonomy",
            "body": "7 categories by customer intent. One taxonomy, two navigation paths.",
            "icon": "tags"
          },
          {
            "title": "Editorial Workflow",
            "body": "Review cycle, ownership model, content freshness rules.",
            "icon": "git-pull-request"
          },
          {
            "title": "Conversion Template",
            "body": "Repeatable migration process. Scales beyond the first department.",
            "icon": "copy"
          }
        ]
      }
    },
    {
      "type": "timeline",
      "title": "The Sprint Plan",
      "notes": "Four sprints, six months, fixed end date. Sprint 2 is the heavy lift — that's where Casey's commitment matters most.",
      "data": {
        "eyebrow": "Milestones",
        "milestones": [
          {
            "label": "Phase 0: Discovery & Audit",
            "date": "2026-01-31",
            "state": "done",
            "detail": "Content audit, taxonomy design, metadata schema. Complete."
          },
          {
            "label": "Sprint 1: Foundation",
            "date": "2026-03-14",
            "state": "current",
            "detail": "Migration toolkit, Zendesk config, taxonomy implementation."
          },
          {
            "label": "Sprint 2: Content Migration",
            "date": "2026-04-25",
            "state": "upcoming",
            "detail": "Batch migration, SME review. Heaviest load for Casey's team."
          },
          {
            "label": "Sprint 3: Search & Polish",
            "date": "2026-06-06",
            "state": "upcoming",
            "detail": "Search tuning, navigation testing, editorial workflow."
          },
          {
            "label": "Sprint 4: Launch Prep",
            "date": "2026-07-29",
            "state": "upcoming",
            "detail": "Go-live. Monitoring, feedback loops, content freshness."
          }
        ],
        "progress": {
          "completed": 1,
          "total": 5,
          "percent": 20
        }
      }
    },
    {
      "type": "context",
      "title": "How We Measure Success",
      "notes": "Four parallel outcomes. The hardest is adoption — migrating perfectly means nothing if agents don't use the new system.",
      "data": {
        "eyebrow": "Success Criteria",
        "items": [
          {
            "title": "Content Migration Complete",
            "body": "All 2,400 articles audited, triaged, migrated or archived.",
            "icon": "archive",
            "status": "confirmed"
          },
          {
            "title": "Search Accuracy ≥ 85%",
            "body": "Users find what they need in the first 3 results, 85% of the time.",
            "icon": "search",
            "status": "confirmed"
          },
          {
            "title": "Escalations Drop 20%",
            "body": "Doc-related Tier 2 escalations decrease from 34% to under 14%.",
            "icon": "trending-down",
            "status": "confirmed"
          },
          {
            "title": "Template Validated",
            "body": "Second department can migrate using the template without Atlas team.",
            "icon": "copy",
            "status": "confirmed"
          }
        ]
      }
    },
    {
      "type": "blockers",
      "title": "What I Need From This Room",
      "notes": "Casey's 4 hours per week is the critical ask. Frame it as 'your team is the quality gate.' Out-of-scope items prevent scope creep in Q&A.",
      "data": {
        "eyebrow": "Commitments",
        "summary": {
          "actions": 2,
          "approvals": 1,
          "fyis": 2
        },
        "items": [
          {
            "text": "Casey's team: 4 hrs/wk SME review during Sprints 2-3",
            "severity": "action",
            "owner": "Casey Martinez",
            "priority": "high",
            "badges": ["Blocks Sprint 2"]
          },
          {
            "text": "Riley's team: platform config and search during Sprint 1",
            "severity": "action",
            "owner": "Riley Chen",
            "priority": "high",
            "badges": ["Starting now"]
          },
          {
            "text": "Jordan to communicate legacy wiki sunset",
            "severity": "approval",
            "owner": "Jordan Park",
            "priority": "standard",
            "badges": ["Before Sprint 3"]
          },
          {
            "text": "Training portal and LMS are out of scope",
            "severity": "fyi",
            "owner": "All"
          },
          {
            "text": "Community forums and external docs are out of scope",
            "severity": "fyi",
            "owner": "All"
          }
        ]
      }
    }
  ]
};

const deck3 = {
  "schemaVersion": 2,
  "meta": {
    "title": "Atlas — Sprint 2 of 4",
    "eyebrow": "Project Update",
    "date": "2026-03-12",
    "audience": "team",
    "template": "status",
    "theme": "blue",
    "rag": "yellow",
    "headline": "Migration on track but SME review sessions slipping — need Casey's team back on schedule.",
    "project": "Atlas"
  },
  "slides": [
    {
      "type": "hero",
      "title": "Atlas",
      "notes": "RAG is yellow because Casey's team missed two consecutive review sessions. Migration velocity is fine — Sam is ahead of pace. But unreviewed content is piling up. If Casey doesn't re-engage this week, Sprint 2 deliverables slip into Sprint 3.",
      "data": {
        "subtitle": "Sprint 2 of 4 | Week 5 of 24",
        "rag": "yellow",
        "headline": "Migration on track but SME review sessions slipping — need Casey's team back on schedule.",
        "kpis": [
          { "label": "Migrated", "value": "340 / 2,400", "icon": "file-text", "trend": "up" },
          { "label": "Search Accuracy", "value": "78%", "icon": "search", "trend": "up" },
          { "label": "Review Backlog", "value": "45 articles", "icon": "clock", "trend": "down" }
        ]
      }
    },
    {
      "type": "grid",
      "title": "Accomplishments",
      "notes": "Three wins this sprint. Taxonomy finalization is the biggest — every future article has a home. Search config is Riley delivering ahead of schedule. The 340 milestone proves the migration toolkit works.",
      "data": {
        "eyebrow": "Completed",
        "cards": [
          {
            "title": "Taxonomy Finalized and Validated",
            "body": "Sam validated 7-category taxonomy against 340 articles. Zero reclassifications.",
            "icon": "check-circle"
          },
          {
            "title": "Search Configuration Deployed",
            "body": "Riley deployed search v1. Accuracy at 78% — above Sprint 2 target.",
            "icon": "search"
          },
          {
            "title": "340 Articles Migrated",
            "body": "14% of total corpus. Toolkit handling 50 articles/day batch processing.",
            "icon": "database"
          },
          {
            "title": "Editorial Workflow Drafted",
            "body": "Review cycle and ownership model documented. Pending Casey's feedback.",
            "icon": "git-pull-request"
          }
        ]
      }
    },
    {
      "type": "pipeline",
      "title": "In Progress",
      "notes": "Content review is the bottleneck. Sam migrates faster than Casey reviews. If review doesn't catch up, Sprint 3 starts with compounding backlog.",
      "data": {
        "eyebrow": "Pipeline",
        "steps": [
          {
            "label": "Clear Review Backlog",
            "status": "current",
            "badges": ["Casey's team", "45 articles", "Blocking"]
          },
          {
            "label": "Migrate Batch 4",
            "status": "next",
            "badges": ["Sam", "100 articles"]
          },
          {
            "label": "Finalize Style Guide",
            "status": "next",
            "badges": ["Sam", "Draft complete"]
          },
          {
            "label": "Deploy Search v2",
            "status": "next",
            "badges": ["Riley", "Synonym support"]
          }
        ]
      }
    },
    {
      "type": "timeline",
      "title": "Roadmap",
      "notes": "Phase 0 done, Sprint 1 done, Sprint 2 current and halfway through. Sprint 3 is the most complex — search tuning, navigation, and editorial workflow converge. If Sprint 2's backlog carries over, Sprint 3 gets compressed.",
      "data": {
        "eyebrow": "Progress",
        "milestones": [
          {
            "label": "Phase 0: Discovery & Audit",
            "date": "2026-01-31",
            "state": "done",
            "detail": "Content audit, taxonomy, metadata schema. Complete."
          },
          {
            "label": "Sprint 1: Foundation",
            "date": "2026-03-14",
            "state": "done",
            "detail": "Migration toolkit, Zendesk config, taxonomy. Complete."
          },
          {
            "label": "Sprint 2: Content Migration",
            "date": "2026-04-25",
            "state": "current",
            "detail": "340/2,400 migrated. Review backlog building."
          },
          {
            "label": "Sprint 3: Search & Polish",
            "date": "2026-06-06",
            "state": "upcoming",
            "detail": "Search tuning, navigation, editorial workflow."
          },
          {
            "label": "Sprint 4: Launch Prep",
            "date": "2026-07-29",
            "state": "upcoming",
            "detail": "Go-live. Monitoring, feedback, content freshness."
          }
        ]
      }
    },
    {
      "type": "blockers",
      "title": "Asks & Blockers",
      "notes": "One real blocker: Casey's team missed two review sessions. They're stretched across three other projects. The ask is specific: Jordan frees Casey's time or provides an alternative reviewer.",
      "data": {
        "eyebrow": "Blockers",
        "items": [
          {
            "text": "Casey's team missed 2 of 4 review sessions — backlog growing",
            "severity": "action",
            "owner": "Jordan → Casey Martinez",
            "badges": ["Escalated", "Blocks Sprint 2 exit"]
          },
          {
            "text": "Style guide needs Casey's input before editorial workflow launches",
            "severity": "approval",
            "owner": "Casey Martinez",
            "badges": ["Due end of sprint"]
          },
          {
            "text": "Zendesk Enterprise contract expected to close this week",
            "severity": "fyi",
            "owner": "Procurement"
          }
        ]
      }
    }
  ]
};

const deck4 = {
  "schemaVersion": 2,
  "meta": {
    "title": "Atlas — Standup 2026-03-12",
    "eyebrow": "Daily Standup",
    "date": "2026-03-12",
    "audience": "team",
    "template": "standup",
    "theme": "blue",
    "rag": "yellow",
    "headline": "Clear the review backlog and get Casey's team re-engaged before end of week.",
    "project": "Atlas"
  },
  "slides": [
    {
      "type": "hero",
      "title": "Atlas",
      "notes": "Sprint 2, day 8. The sprint goal is content migration at pace, but the review backlog is the story today. Yellow because Casey's team hasn't attended a review session in a week. This deck is a mirror for the team, not a report to the boss.",
      "data": {
        "subtitle": "Sprint 2 of 4 | Day 8 of 15",
        "rag": "yellow",
        "headline": "Clear the review backlog and get Casey's team re-engaged before end of week.",
        "kpis": [
          { "label": "Sprint", "value": "2 of 4", "icon": "calendar" },
          { "label": "Days Left", "value": "7", "icon": "clock" },
          { "label": "Review Backlog", "value": "45", "icon": "alert-triangle" }
        ]
      }
    },
    {
      "type": "grid",
      "title": "Yesterday",
      "notes": "Three completions. The 45-article batch is Sam maintaining pace despite the bottleneck. Riley's search fix is a quick win. Editorial workflow draft means Sam is working ahead.",
      "data": {
        "eyebrow": "Completed",
        "cards": [
          {
            "title": "Batch 3 Migration Complete",
            "body": "Sam — 45 articles migrated and tagged. Cumulative: 340.",
            "icon": "database"
          },
          {
            "title": "Search Synonym Support Added",
            "body": "Riley — search v1.1 with synonym mapping. Accuracy up to 78%.",
            "icon": "search"
          },
          {
            "title": "Editorial Workflow Draft Sent",
            "body": "Sam — review cycle and ownership model sent to Casey.",
            "icon": "file-text"
          }
        ]
      }
    },
    {
      "type": "pipeline",
      "title": "Today",
      "notes": "Casey outreach is the most important thing today. If Casey confirms sessions resume tomorrow, sprint is back on track. If not, escalate to Jordan by end of day.",
      "data": {
        "eyebrow": "Pipeline",
        "steps": [
          {
            "label": "Contact Casey Re: Reviews",
            "status": "current",
            "badges": ["You", "Direct Slack", "Before noon"]
          },
          {
            "label": "Start Batch 4 Migration",
            "status": "next",
            "badges": ["Sam", "100 articles"]
          },
          {
            "label": "Test Search v1.1 Accuracy",
            "status": "next",
            "badges": ["Riley", "50-query benchmark"]
          },
          {
            "label": "Update Sprint Burndown",
            "status": "next",
            "badges": ["You", "End of day"]
          }
        ]
      }
    },
    {
      "type": "blockers",
      "title": "Asks & Blockers",
      "notes": "One blocker: Casey's team hasn't attended a review session in 5 business days. If today's outreach doesn't work, escalate to Jordan tomorrow morning.",
      "data": {
        "eyebrow": "Blockers",
        "items": [
          {
            "text": "Casey's team: no review sessions in 5 days. Backlog at 45.",
            "severity": "action",
            "owner": "You → Casey Martinez"
          },
          {
            "text": "Zendesk contract still unsigned — procurement says 'this week.'",
            "severity": "fyi",
            "owner": "Procurement"
          }
        ]
      }
    },
    {
      "type": "grid",
      "title": "Parking Lot",
      "notes": "Two items needing deeper discussion. The batch vs. incremental question affects Sprint 3 planning. The taxonomy depth question came from Riley's synonym work.",
      "data": {
        "eyebrow": "Discussion Items",
        "cards": [
          {
            "title": "Batch vs. Incremental Migration",
            "body": "Migrate remaining 2,060 articles in bulk or incrementally? Affects Sprint 3.",
            "icon": "git-branch"
          },
          {
            "title": "Search Taxonomy Depth",
            "body": "Riley: taxonomy may need a 4th level for troubleshooting. Needs Sam + Casey.",
            "icon": "search"
          }
        ]
      }
    }
  ]
};

const decks = [deck4, deck3, deck2, deck1]; // Reverse chronological for seeding

async function main() {
    console.log("🌱 Seeding database with 4 example Atlas decks…");

    let count = 0;
    for (const deck of decks) {
        // Find existing or create (upsert by title to be safe, though title is not unique in schema?)
        // The previous code used create, so let's stick to create since it's meant to be run on empty DB
        await prisma.update.create({
            data: {
                title: deck.meta.title,
                date: new Date(deck.meta.date),
                template: deck.meta.template,
                rag: deck.meta.rag || null,
                content_json: JSON.stringify(deck),
                source_raw: JSON.stringify(deck, null, 2),
                schema_version: deck.schemaVersion,
            },
        });
        count++;
        console.log(`✅ Seeded: ${deck.meta.title} (${deck.meta.template} template)`);
    }

    console.log(`🎉 Seed complete. ${count} decks created. Visit /history to see your decks.`);
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
