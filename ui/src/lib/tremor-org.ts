import type { Agent, AgentDetail } from "@paperclipai/shared";

export type TremorDivisionKey =
  | "leadership"
  | "nervous-system"
  | "sensory-engine"
  | "fidelity-quality";

export interface TremorDivisionDefinition {
  key: TremorDivisionKey;
  label: string;
  shortLabel: string;
  description: string;
  lead: string;
  toneClassName: string;
}

type AgentLike = Pick<Agent, "name" | "title" | "urlKey"> | Pick<AgentDetail, "name" | "title" | "urlKey">;

const DIVISIONS: Record<TremorDivisionKey, TremorDivisionDefinition> = {
  leadership: {
    key: "leadership",
    label: "Leadership Cell",
    shortLabel: "Leadership",
    description: "Strategy, delivery hygiene, budget control, and studio support.",
    lead: "Founder",
    toneClassName: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  "nervous-system": {
    key: "nervous-system",
    label: "Nervous System Division",
    shortLabel: "Nervous System",
    description: "Platform architecture, networking, and release safety.",
    lead: "Co-Engineering Lead A",
    toneClassName: "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  },
  "sensory-engine": {
    key: "sensory-engine",
    label: "Sensory Engine Division",
    shortLabel: "Sensory Engine",
    description: "Simulation, perception, timing, and asset synthesis.",
    lead: "Co-Engineering Lead B",
    toneClassName: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  },
  "fidelity-quality": {
    key: "fidelity-quality",
    label: "Fidelity and Quality Division",
    shortLabel: "Fidelity + Quality",
    description: "Experience design, regression coverage, and confidence engineering.",
    lead: "Lead Product Designer",
    toneClassName: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
};

const DIVISION_MATCHERS: Record<TremorDivisionKey, string[]> = {
  leadership: [
    "founder",
    "ceo and founder",
    "co-engineering-lead-a",
    "co-engineering lead a",
    "platform and networking lead",
    "co-engineering-lead-b",
    "co-engineering lead b",
    "simulation and sensory lead",
    "program-manager",
    "program manager",
    "technical program manager",
    "admin-ops",
    "admin and ops",
    "admin and operations",
  ],
  "nervous-system": [
    "systems-network-engineer",
    "systems network engineer",
    "senior systems and network engineer",
    "ops-engineer",
    "devsecops-engineer",
    "devsecops engineer",
    "platform and devsecops engineer",
  ],
  "sensory-engine": [
    "dsp-audio-engineer",
    "dsp audio engineer",
    "dsp and audio engineer",
    "computer-vision-ar-engineer",
    "computer vision and ar engineer",
    "genai-architect",
    "genai architect",
    "generative ai and search architect",
    "technical-artist",
    "technical artist",
    "simulation-engineer",
    "simulation engineer",
    "physics and simulation specialist",
  ],
  "fidelity-quality": [
    "lead-product-designer",
    "lead product designer",
    "tools-qa-engineer",
    "tools qa engineer",
    "sdet-engineer",
    "sdet engineer",
    "software engineer in test",
  ],
};

function normalizeToken(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;
  return trimmed
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTremorDivision(agent: AgentLike | null | undefined): TremorDivisionDefinition | null {
  if (!agent) return null;
  const candidates = [normalizeToken(agent.urlKey), normalizeToken(agent.name), normalizeToken(agent.title)];
  for (const [key, matchers] of Object.entries(DIVISION_MATCHERS) as Array<[TremorDivisionKey, string[]]>) {
    if (candidates.some((candidate) => candidate && matchers.includes(candidate))) {
      return DIVISIONS[key];
    }
  }
  return null;
}

export function listTremorDivisions() {
  return [
    DIVISIONS.leadership,
    DIVISIONS["nervous-system"],
    DIVISIONS["sensory-engine"],
    DIVISIONS["fidelity-quality"],
  ];
}

export function readProcessCommand(agent: Pick<Agent, "adapterConfig"> | Pick<AgentDetail, "adapterConfig">): string | null {
  const config = agent.adapterConfig;
  if (typeof config !== "object" || config === null || Array.isArray(config)) return null;
  return typeof config.command === "string" && config.command.trim().length > 0 ? config.command.trim() : null;
}

export function readProcessArgs(
  agent: Pick<Agent, "adapterConfig"> | Pick<AgentDetail, "adapterConfig">,
): string[] {
  const config = agent.adapterConfig;
  if (typeof config !== "object" || config === null || Array.isArray(config)) return [];
  const value = config.args;
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
  }
  if (typeof value === "string" && value.trim().length > 0) return [value.trim()];
  return [];
}

export interface AgentRunPolicySummary {
  enabled: boolean;
  intervalSec: number;
  wakeOnDemand: boolean;
  cooldownSec: number;
  maxConcurrentRuns: number;
  summary: string;
}

export function readAgentRunPolicy(
  agent: Pick<Agent, "runtimeConfig"> | Pick<AgentDetail, "runtimeConfig">,
): AgentRunPolicySummary {
  const runtime = agent.runtimeConfig;
  const heartbeat =
    typeof runtime === "object" && runtime !== null && !Array.isArray(runtime) &&
    typeof runtime.heartbeat === "object" && runtime.heartbeat !== null && !Array.isArray(runtime.heartbeat)
      ? runtime.heartbeat as Record<string, unknown>
      : {};

  const enabled = heartbeat.enabled === true;
  const intervalSec = typeof heartbeat.intervalSec === "number" ? heartbeat.intervalSec : 300;
  const wakeOnDemand = heartbeat.wakeOnDemand !== false;
  const cooldownSec = typeof heartbeat.cooldownSec === "number" ? heartbeat.cooldownSec : 10;
  const maxConcurrentRuns =
    typeof heartbeat.maxConcurrentRuns === "number" ? heartbeat.maxConcurrentRuns : 1;

  const summary = enabled
    ? `Timer every ${intervalSec}s${wakeOnDemand ? " with on-demand wake" : ""}`
    : `Timer disabled${wakeOnDemand ? ", on-demand wake enabled" : ""}`;

  return {
    enabled,
    intervalSec,
    wakeOnDemand,
    cooldownSec,
    maxConcurrentRuns,
    summary,
  };
}
