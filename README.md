# mcp-homebrew-formulae

Homebrew formulae + casks + install analytics (formulae.brew.sh)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `formula` | Formula by name. |
| `cask` | Cask by name. |
| `analytics_install` | Install counts. Pass formula to scope, or omit for top list. |
| `analytics_cask_install` | Cask install counts. |
| `recent_formulae` | Recently-added formulae. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "homebrew-formulae": {
      "url": "https://gateway.pipeworx.io/homebrew-formulae/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Homebrew Formulae data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
