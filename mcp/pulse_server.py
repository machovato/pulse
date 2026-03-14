#!/usr/bin/env python3
"""
Pulse MCP Server
Lets Claude Code skills push deck JSON directly to Pulse.
"""

import urllib.request
import json
import asyncio
from mcp.server import Server
from mcp.server.stdio import stdio_server
import mcp.types as types

server = Server("pulse")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """
    List tools available for the Pulse server.
    """
    return [
        types.Tool(
            name="pulse_create_deck",
            description="Create a new deck in Pulse.",
            inputSchema={
                "type": "object",
                "properties": {
                    "content_json": {
                        "type": "string",
                        "description": "Full Pulse deck JSON as a string"
                    }
                },
                "required": ["content_json"]
            }
        ),
        types.Tool(
            name="pulse_list_decks",
            description="List decks currently in Pulse.",
            inputSchema={
                "type": "object",
                "properties": {
                    "template": {
                        "type": "string",
                        "description": "Optional filter by template type (status, strategy, standup, kickoff)"
                    }
                }
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict | None) -> list[types.TextContent]:
    """
    Execute the requested tool.
    """
    if arguments is None:
        arguments = {}

    if name == "pulse_create_deck":
        content_json = arguments.get("content_json")
        if not content_json:
            return [types.TextContent(type="text", text="Error: content_json is required")]
            
        try:
            req = urllib.request.Request(
                "http://127.0.0.1:3000/api/mcp/decks",
                data=json.dumps({"content_json": content_json}).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read())
                return [types.TextContent(type="text", text=f"Deck created: {data['url']}")]
        except urllib.error.URLError:
            return [types.TextContent(
                type="text", 
                text="Pulse is not running. Start it with 'npm run dev' in your Pulse folder, then retry. Your deck JSON was saved to the project folder as a fallback."
            )]
        except Exception as e:
            return [types.TextContent(type="text", text=f"Error creating deck: {str(e)}")]

    elif name == "pulse_list_decks":
        template = arguments.get("template")
        url = "http://127.0.0.1:3000/api/mcp/decks"
        if template:
            url += f"?template={template}"

        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=10) as resp:
                result = resp.read().decode("utf-8")
                return [types.TextContent(type="text", text=result)]
        except urllib.error.URLError:
            return [types.TextContent(type="text", text="Pulse is not running. Start it with 'npm run dev'.")]
        except Exception as e:
            return [types.TextContent(type="text", text=f"Error listing decks: {str(e)}")]
            
    else:
        raise ValueError(f"Unknown tool: {name}")

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())
