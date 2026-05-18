interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Homebrew formulae.brew.sh MCP.
 */


const BASE = 'https://formulae.brew.sh/api';
const UA = 'pipeworx-mcp-homebrew-formulae/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'formula',
    description: 'Formula by name.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    },
  },
  {
    name: 'cask',
    description: 'Cask by name.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
    },
  },
  {
    name: 'analytics_install',
    description: 'Install counts. Pass formula to scope, or omit for top list.',
    inputSchema: {
      type: 'object',
      properties: {
        formula: { type: 'string' },
        days: { type: 'number', description: '30 | 90 | 365 (default 30).' },
      },
    },
  },
  {
    name: 'analytics_cask_install',
    description: 'Cask install counts.',
    inputSchema: {
      type: 'object',
      properties: {
        cask: { type: 'string' },
        days: { type: 'number' },
      },
    },
  },
  {
    name: 'recent_formulae',
    description: 'Recently-added formulae.',
    inputSchema: {
      type: 'object',
      properties: {
        days: { type: 'number', description: '1-365 (default 30).' },
        limit: { type: 'number' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'formula':
      return brewGet(`/formula/${encodeURIComponent(reqStr(args, 'name', '"node"'))}.json`);
    case 'cask':
      return brewGet(`/cask/${encodeURIComponent(reqStr(args, 'name', '"firefox"'))}.json`);
    case 'analytics_install': {
      const d = String(args.days ?? 30);
      if (!['30', '90', '365'].includes(d)) throw new Error('days must be 30 | 90 | 365.');
      if (args.formula) return brewGet(`/analytics/install/${d}d.json`).then(t => {
        const counts = (t as { formulae?: Record<string, unknown> }).formulae ?? {};
        return { formula: String(args.formula), data: counts[String(args.formula)] ?? null };
      });
      return brewGet(`/analytics/install/${d}d.json`);
    }
    case 'analytics_cask_install': {
      const d = String(args.days ?? 30);
      if (!['30', '90', '365'].includes(d)) throw new Error('days must be 30 | 90 | 365.');
      if (args.cask) return brewGet(`/analytics/cask-install/${d}d.json`).then(t => {
        const counts = (t as { formulae?: Record<string, unknown> }).formulae ?? {};
        return { cask: String(args.cask), data: counts[String(args.cask)] ?? null };
      });
      return brewGet(`/analytics/cask-install/${d}d.json`);
    }
    case 'recent_formulae': {
      const days = Math.min(365, Math.max(1, (args.days as number) ?? 30));
      const limit = Math.min(1000, Math.max(1, (args.limit as number) ?? 50));
      const data = (await brewGet(`/formula.json`)) as { name?: string; date_added?: string; ruby_source_path?: string; tap?: string }[];
      const cutoff = Date.now() - days * 86400_000;
      const recent = (data as any[])
        .filter((f) => f.date_added && Date.parse(f.date_added) >= cutoff)
        .slice(0, limit);
      return { days, count: recent.length, formulae: recent };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function brewGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('Homebrew: not found');
  if (!res.ok) throw new Error(`Homebrew: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
