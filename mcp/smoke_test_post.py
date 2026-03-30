#!/usr/bin/env python3
"""
Smoke test: push a hardcoded linkedin_post through the MCP → API → DB pipeline.
Run with Pulse dev server already running: python mcp/smoke_test_post.py
"""

import urllib.request
import json
import sys

PULSE_BASE = "http://127.0.0.1:3000"

TEST_POST = {
    "type": "linkedin_post",
    "project": "Pulse",
    "pillar": "AI Strategy",
    "theme": "Building tools that build tools",
    "hook": "Most AI tools solve the wrong problem.",
    "body": "They optimize for speed when the real bottleneck is clarity.\n\nI spent six weeks building a presentation engine that turns structured JSON into animated slide decks. Not because PowerPoint is broken — because the thinking that feeds PowerPoint is broken.\n\nWhen you force yourself to express a project update as structured data, you discover what you actually know vs. what you're hand-waving past.",
    "cta": "What's the actual bottleneck in your workflow? Not the tool — the thinking upstream of the tool.",
    "hashtags": ["KnowledgeManagement", "AIStrategy", "BuildInPublic", "CX"],
    "hook_char_count": 42,
    "total_char_count": 467,
    "voice_version": "1.0",
}


def test_create():
    print("1. POST /api/mcp/posts — creating test post...")
    payload = json.dumps({"content_json": json.dumps(TEST_POST)}).encode("utf-8")
    req = urllib.request.Request(
        f"{PULSE_BASE}/api/mcp/posts",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            print(f"   ✅ Created: {data}")
            return data
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"   ❌ HTTP {e.code}: {body}")
        sys.exit(1)
    except urllib.error.URLError:
        print("   ❌ Connection refused — is Pulse running? (npm run dev)")
        sys.exit(1)


def test_list():
    print("2. GET /api/mcp/posts — listing posts...")
    req = urllib.request.Request(f"{PULSE_BASE}/api/mcp/posts")
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read())
        count = len(data.get("posts", []))
        print(f"   ✅ {count} post(s) returned")
        return data


def test_get_single(post_id):
    print(f"3. GET /api/posts/{post_id} — fetching single post...")
    req = urllib.request.Request(f"{PULSE_BASE}/api/posts/{post_id}")
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read())
        print(f"   ✅ Got post: hook='{data['hook'][:40]}...'")
        return data


def test_renderer(post_id):
    print(f"4. GET /posts/{post_id} — checking renderer page...")
    req = urllib.request.Request(f"{PULSE_BASE}/posts/{post_id}")
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode("utf-8")
        if "LinkedInPostRenderer" in html or "Copy to clipboard" in html or post_id in html:
            print(f"   ✅ Renderer page loaded (HTML length: {len(html)})")
        else:
            # Next.js SSR may not have the exact string, check for basic page load
            print(f"   ⚠️  Page loaded ({len(html)} bytes) — visually confirm at: {PULSE_BASE}/posts/{post_id}")
        return True


def test_deck_backward_compat():
    print("5. Backward compat — POST deck without 'type' field...")
    deck_json = {
        "schemaVersion": 2,
        "meta": {
            "title": "Smoke Test Deck",
            "date": "2026-03-29",
            "audience": "team",
            "template": "status",
        },
        "slides": [
            {
                "type": "hero",
                "title": "Smoke Test",
                "data": {"subtitle": "Testing backward compat", "rag": "green"},
            }
        ],
    }
    payload = json.dumps({"content_json": json.dumps(deck_json)}).encode("utf-8")
    req = urllib.request.Request(
        f"{PULSE_BASE}/api/mcp/decks",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            print(f"   ✅ Deck still works: {data.get('url', data)}")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"   ❌ HTTP {e.code}: {body}")


if __name__ == "__main__":
    print("=" * 50)
    print("Pulse LinkedIn Post — Smoke Test")
    print("=" * 50)
    print()

    result = test_create()
    post_id = result["id"]
    post_url = result["url"]

    print()
    test_list()

    print()
    test_get_single(post_id)

    print()
    test_renderer(post_id)

    print()
    test_deck_backward_compat()

    print()
    print("=" * 50)
    print(f"🎯 Open in browser: {post_url}")
    print("=" * 50)
