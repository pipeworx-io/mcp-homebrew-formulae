# @pipeworx/homebrew-formulae

Homebrew [formulae.brew.sh](https://formulae.brew.sh) MCP — formulae + casks + installation counts. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `formula(name)` — formula by name
- `cask(name)` — cask by name
- `analytics_install(formula?, days?)` — install counts (per formula or top list)
- `analytics_cask_install(cask?, days?)` — cask install counts
- `recent_formulae(days?, limit?)` — recently-added formulae

## Data source

`https://formulae.brew.sh/api/`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
