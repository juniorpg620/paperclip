#!/usr/bin/env -S node --import tsx
import { eq } from "../server/node_modules/drizzle-orm/index.js";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createDb,
  routines as routineTable,
} from "../server/node_modules/@paperclipai/db/src/index.ts";
import { normalizeAgentUrlKey, normalizeProjectUrlKey } from "../server/node_modules/@paperclipai/shared/src/index.ts";
import {
  agentService,
  goalService,
  issueService,
  logActivity,
  projectService,
  routineService,
} from "../server/src/services/index.js";

type GoalSeed = {
  slug: string;
  title: string;
  description: string;
  level: "company" | "team" | "task";
  status: "active";
  ownerAgentSlug: string;
  parentSlug?: string | null;
};

type ProjectSeed = {
  slug: string;
  name: string;
  description: string;
  ownerAgentSlug: string;
  leadAgentSlug: string;
  goalSlugs: string[];
  status: "in_progress" | "planned";
};

type IssueSeed = {
  seedId: string;
  title: string;
  summary: string;
  acceptance: string[];
  projectSlug: string;
  goalSlug: string;
  assigneeAgentSlug: string;
  parentSeedId?: string | null;
  epicSlug: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "backlog" | "todo" | "in_progress" | "blocked";
};

type RoutineSeed = {
  slug: string;
  title: string;
  summary: string;
  projectSlug: string;
  goalSlug: string;
  assigneeAgentSlug: string;
  priority: "high" | "medium";
  cronExpression: string;
  timezone: string;
};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_ROOT = path.join(ROOT, "docs", "companies", "tremor");
const COMPANY_ID = "d7c4cdf8-72b5-4dc1-a98f-ba0ebfec1120";
const BOOTSTRAP_ACTOR = { actorType: "system" as const, actorId: "tremor-bootstrap" };

const AGENT_ALIASES = {
  founder: "Founder",
  platformLead: "Co-Engineering Lead A",
  simulationLead: "Co-Engineering Lead B",
  systemsNetworkEngineer: "Systems Network Engineer",
  dspAudioEngineer: "DSP Audio Engineer",
  computerVisionArEngineer: "Computer Vision and AR Engineer",
  technicalArtist: "Technical Artist",
  genaiArchitect: "GenAI Architect",
  devsecopsEngineer: "DevSecOps Engineer",
  simulationEngineer: "Simulation Engineer",
  leadProductDesigner: "Lead Product Designer",
  programManager: "Program Manager",
  toolsQaEngineer: "Tools QA Engineer",
  sdetEngineer: "SDET Engineer",
  adminOps: "Admin and Ops",
} as const;

const GOALS: GoalSeed[] = [
  {
    slug: "ship-tremor-alpha",
    title: "Ship Tremor alpha",
    description: "Deliver a tactile, local-first Apple board-game platform that can support a first playable alpha.",
    level: "company",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.founder,
  },
  {
    slug: "platform-foundation",
    title: "Platform foundation",
    description: "Establish authoritative state, local mesh networking, and deterministic sync primitives.",
    level: "team",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.platformLead,
    parentSlug: "ship-tremor-alpha",
  },
  {
    slug: "sensory-engine",
    title: "Sensory engine",
    description: "Prove board ingestion, timing, haptics, rendering, and simulation fidelity end to end.",
    level: "team",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.simulationLead,
    parentSlug: "ship-tremor-alpha",
  },
  {
    slug: "launch-readiness",
    title: "Launch readiness",
    description: "Close the loop on roadmap discipline, regression confidence, and release safety.",
    level: "team",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.programManager,
    parentSlug: "ship-tremor-alpha",
  },
  {
    slug: "studio-operations",
    title: "Studio operations",
    description: "Run studio cadence, budget tracking, device health, and procurement with predictable hygiene.",
    level: "team",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.adminOps,
    parentSlug: "ship-tremor-alpha",
  },
  {
    slug: "platform-authoritative-state-model",
    title: "Authoritative state model",
    description: "Define the single source of truth that every device reads and writes against.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.platformLead,
    parentSlug: "platform-foundation",
  },
  {
    slug: "platform-local-mesh-transport",
    title: "Local mesh transport",
    description: "Keep device connectivity deterministic across the local network and any fallback path.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.systemsNetworkEngineer,
    parentSlug: "platform-foundation",
  },
  {
    slug: "platform-rule-ingestion-synthesis",
    title: "Rule ingestion and synthesis",
    description: "Turn rules, prompts, and board logic into structured, executable state.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.genaiArchitect,
    parentSlug: "platform-foundation",
  },
  {
    slug: "sensory-board-ingestion-calibration",
    title: "Board ingestion and calibration",
    description: "Capture board state reliably and calibrate the tactile surface before play begins.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.computerVisionArEngineer,
    parentSlug: "sensory-engine",
  },
  {
    slug: "sensory-timing-haptics-audio",
    title: "Timing, haptics, and audio",
    description: "Align sensory timing across audio, haptics, and animation so the board feels physical.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.dspAudioEngineer,
    parentSlug: "sensory-engine",
  },
  {
    slug: "sensory-render-simulation-fidelity",
    title: "Render and simulation fidelity",
    description: "Match the rendered experience and simulated state closely enough for confident play.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.simulationEngineer,
    parentSlug: "sensory-engine",
  },
  {
    slug: "launch-milestone-control-raid",
    title: "Milestone control and RAID",
    description: "Keep the active delivery window sequenced, visible, and free of hidden blockers.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.programManager,
    parentSlug: "launch-readiness",
  },
  {
    slug: "launch-regression-harness-qa",
    title: "Regression harness and QA automation",
    description: "Ensure the first playable slice can be verified repeatedly without manual heroics.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.toolsQaEngineer,
    parentSlug: "launch-readiness",
  },
  {
    slug: "launch-release-safety-dual-screen",
    title: "Release safety and dual-screen readiness",
    description: "Keep release controls and the player-facing dual-screen flow in a shippable state.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.devsecopsEngineer,
    parentSlug: "launch-readiness",
  },
  {
    slug: "ops-lab-device-health",
    title: "Lab readiness and device health",
    description: "Keep the lab, devices, and supporting gear ready for repeatable delivery work.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.adminOps,
    parentSlug: "studio-operations",
  },
  {
    slug: "ops-budget-runway-discipline",
    title: "Budget and runway discipline",
    description: "Track spend, burn, and milestone gates so the studio can stay funded for the next slice.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.founder,
    parentSlug: "studio-operations",
  },
  {
    slug: "ops-approvals-onboarding-hygiene",
    title: "Approvals and onboarding hygiene",
    description: "Keep approvals, onboarding, and administrative follow-through explicit and current.",
    level: "task",
    status: "active",
    ownerAgentSlug: AGENT_ALIASES.programManager,
    parentSlug: "studio-operations",
  },
];

const PROJECTS: ProjectSeed[] = [
  {
    slug: "flight-plan",
    name: "Tremor Flight Plan",
    description: "The staged roadmap from architectural core to tactile board-game platform.",
    ownerAgentSlug: AGENT_ALIASES.founder,
    leadAgentSlug: AGENT_ALIASES.founder,
    goalSlugs: [
      "platform-foundation",
      "platform-authoritative-state-model",
      "platform-local-mesh-transport",
      "platform-rule-ingestion-synthesis",
      "ship-tremor-alpha",
      "sensory-engine",
      "sensory-board-ingestion-calibration",
      "sensory-timing-haptics-audio",
      "sensory-render-simulation-fidelity",
      "launch-readiness",
      "launch-milestone-control-raid",
      "launch-regression-harness-qa",
      "launch-release-safety-dual-screen",
    ],
    status: "in_progress",
  },
  {
    slug: "studio-ops",
    name: "Tremor Studio Ops",
    description: "Recurring operations, release readiness, and studio health work that keeps Tremor moving.",
    ownerAgentSlug: AGENT_ALIASES.programManager,
    leadAgentSlug: AGENT_ALIASES.programManager,
    goalSlugs: [
      "studio-operations",
      "ops-lab-device-health",
      "ops-budget-runway-discipline",
      "ops-approvals-onboarding-hygiene",
      "ship-tremor-alpha",
    ],
    status: "planned",
  },
];

const ISSUES: IssueSeed[] = [
  {
    seedId: "founder-strategy-approval",
    title: "Founder strategy and approval backlog",
    summary: "Keep company direction, strategy proposals, and board approvals coherent and explicit.",
    acceptance: [
      "A single owner can explain the company's next move and why it matters.",
      "Strategy proposals are reviewed before execution work starts.",
      "Approval requests are clearly tied to a goal, project, and deadline.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "ship-tremor-alpha",
    assigneeAgentSlug: AGENT_ALIASES.founder,
    epicSlug: "company-direction",
    priority: "high",
    status: "todo",
  },
  {
    seedId: "pm-raid-milestones",
    title: "PM RAID and milestone control",
    summary: "Keep roadmap milestones, risks, decisions, and cross-team follow-up visible and current.",
    acceptance: [
      "A weekly milestone view exists for the active delivery window.",
      "Risks and dependencies are captured with owners and next actions.",
      "Stale work is escalated before it blocks release readiness.",
    ],
    projectSlug: "studio-ops",
    goalSlug: "launch-milestone-control-raid",
    assigneeAgentSlug: AGENT_ALIASES.programManager,
    epicSlug: "launch-readiness",
    priority: "high",
    status: "todo",
  },
  {
    seedId: "platform-authoritative-state",
    title: "Platform authoritative state and local networking",
    summary: "Own the deterministic state model and the local transport story that keeps devices in sync.",
    acceptance: [
      "The authoritative state source is documented and used consistently.",
      "Local connectivity behavior is deterministic across repeated runs.",
      "The issue hierarchy for platform work is clear enough for another engineer to pick up.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "platform-authoritative-state-model",
    assigneeAgentSlug: AGENT_ALIASES.platformLead,
    epicSlug: "platform-foundation",
    priority: "high",
    status: "todo",
  },
  {
    seedId: "sensory-simulation-fidelity",
    title: "Sensory simulation and fidelity validation",
    summary: "Own the sensory stack: timing, simulation, visuals, and the feel of the board.",
    acceptance: [
      "A baseline simulation path is available for deterministic verification.",
      "Haptics and visual feedback have an explicit fidelity target.",
      "Calibration, rendering, and timing work can be traced back to this epic.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "sensory-render-simulation-fidelity",
    assigneeAgentSlug: AGENT_ALIASES.simulationLead,
    epicSlug: "sensory-engine",
    priority: "high",
    status: "todo",
  },
  {
    seedId: "systems-network-transport",
    title: "Systems network transport",
    summary: "Implement the Apple-native mesh and networking behavior for the board and clients.",
    acceptance: [
      "The transport strategy is documented and mapped to the actual Apple APIs in use.",
      "Connectivity fallback behavior is explicit for wired, local, and fallback paths.",
      "The solution is ready for measurement and regression testing.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "platform-local-mesh-transport",
    assigneeAgentSlug: AGENT_ALIASES.systemsNetworkEngineer,
    parentSeedId: "platform-authoritative-state",
    epicSlug: "platform-foundation",
    priority: "high",
    status: "backlog",
  },
  {
    seedId: "genai-rule-ingestion",
    title: "GenAI rule ingestion and synthesis",
    summary: "Translate board-game rules into structured assets, searchable knowledge, and testable artifacts.",
    acceptance: [
      "Rules can be ingested into a structured representation.",
      "Search and synthesis outputs are traceable to the original material.",
      "The flow is good enough to support later asset skinning and helper generation.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "platform-rule-ingestion-synthesis",
    assigneeAgentSlug: AGENT_ALIASES.genaiArchitect,
    parentSeedId: "platform-authoritative-state",
    epicSlug: "platform-foundation",
    priority: "medium",
    status: "backlog",
  },
  {
    seedId: "devsecops-release-safety",
    title: "DevSecOps release safety",
    summary: "Keep CI, secrets, release gates, and deployment hygiene under control.",
    acceptance: [
      "Build and release steps are explicit and reproducible.",
      "Secrets and environment requirements are documented for operators.",
      "A release failure can be diagnosed without tribal knowledge.",
    ],
    projectSlug: "studio-ops",
    goalSlug: "launch-release-safety-dual-screen",
    assigneeAgentSlug: AGENT_ALIASES.devsecopsEngineer,
    parentSeedId: "pm-raid-milestones",
    epicSlug: "launch-readiness",
    priority: "high",
    status: "backlog",
  },
  {
    seedId: "lead-product-designer-dual-screen",
    title: "Lead product designer dual-screen flow",
    summary: "Design the primary player and spectator flows across TV, iPhone, and iPad surfaces.",
    acceptance: [
      "The dual-screen interaction model is legible in the docs and UI flow.",
      "Haptics and motion intent are captured, not left implicit.",
      "The design direction fits the tactile, measured studio thesis.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "launch-release-safety-dual-screen",
    assigneeAgentSlug: AGENT_ALIASES.leadProductDesigner,
    parentSeedId: "pm-raid-milestones",
    epicSlug: "launch-readiness",
    priority: "medium",
    status: "backlog",
  },
  {
    seedId: "tools-qa-regression-hil",
    title: "Tools QA regression and HIL coverage",
    summary: "Own the regression harness, hardware-in-the-loop coverage, and issue reproduction loop.",
    acceptance: [
      "A smoke/regression path exists for the current vertical slice.",
      "Hardware-loop checks can be run without rebuilding the company graph.",
      "The team can tell when a failure is product, platform, or lab related.",
    ],
    projectSlug: "studio-ops",
    goalSlug: "launch-regression-harness-qa",
    assigneeAgentSlug: AGENT_ALIASES.toolsQaEngineer,
    parentSeedId: "pm-raid-milestones",
    epicSlug: "launch-readiness",
    priority: "high",
    status: "backlog",
  },
  {
    seedId: "sdet-automation-coverage",
    title: "SDET automation and coverage",
    summary: "Keep automated checks, repeatability, and integration coverage ahead of manual drift.",
    acceptance: [
      "Automation work is tied to the highest-risk surfaces first.",
      "Regression coverage is broad enough to catch broken sync or rendering behavior.",
      "Test outputs can be consumed by operators and agents without translation.",
    ],
    projectSlug: "studio-ops",
    goalSlug: "launch-regression-harness-qa",
    assigneeAgentSlug: AGENT_ALIASES.sdetEngineer,
    parentSeedId: "pm-raid-milestones",
    epicSlug: "launch-readiness",
    priority: "high",
    status: "backlog",
  },
  {
    seedId: "admin-ops-lab-readiness",
    title: "Admin and Ops lab readiness",
    summary: "Maintain device inventory, procurement, lab readiness, and studio operational hygiene.",
    acceptance: [
      "Lab status can be checked quickly and without digging through chat history.",
      "Inventory/procurement needs are visible before they become blockers.",
      "Device readiness is tied to the actual build/test cadence.",
    ],
    projectSlug: "studio-ops",
    goalSlug: "ops-lab-device-health",
    assigneeAgentSlug: AGENT_ALIASES.adminOps,
    parentSeedId: "pm-raid-milestones",
    epicSlug: "studio-operations",
    priority: "high",
    status: "backlog",
  },
  {
    seedId: "dsp-audio-timing",
    title: "DSP audio pairing and timing",
    summary: "Keep audio pairing, temporal consistency, and haptic timing aligned with gameplay.",
    acceptance: [
      "Audio timing assumptions are documented against the actual play loop.",
      "Pairing and latency behavior can be measured and compared.",
      "The path from signal analysis to gameplay feedback is explicit.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "sensory-timing-haptics-audio",
    assigneeAgentSlug: AGENT_ALIASES.dspAudioEngineer,
    parentSeedId: "sensory-simulation-fidelity",
    epicSlug: "sensory-engine",
    priority: "high",
    status: "backlog",
  },
  {
    seedId: "computer-vision-board-ingestion",
    title: "Computer vision board ingestion and calibration",
    summary: "Detect, calibrate, and ingest the board surface into the runtime with predictable fidelity.",
    acceptance: [
      "Board detection behavior is documented and testable.",
      "Calibration steps are clear enough to repeat on another device.",
      "The output can be fed into the sensory and state layers cleanly.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "sensory-board-ingestion-calibration",
    assigneeAgentSlug: AGENT_ALIASES.computerVisionArEngineer,
    parentSeedId: "sensory-simulation-fidelity",
    epicSlug: "sensory-engine",
    priority: "high",
    status: "backlog",
  },
  {
    seedId: "technical-artist-render-pipeline",
    title: "Technical artist render and material pipeline",
    summary: "Own the visual language, rendering pipeline, and material system for the tactile board.",
    acceptance: [
      "The rendering stack matches the tactile, grounded studio direction.",
      "Materials and shaders are manageable by the team, not just one engineer.",
      "Visual regressions can be isolated from gameplay regressions.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "sensory-render-simulation-fidelity",
    assigneeAgentSlug: AGENT_ALIASES.technicalArtist,
    parentSeedId: "sensory-simulation-fidelity",
    epicSlug: "sensory-engine",
    priority: "medium",
    status: "backlog",
  },
  {
    seedId: "simulation-engine-chaos-harness",
    title: "Simulation engine chaos and stress harness",
    summary: "Create deterministic stress, chaos, and replay validation for the board-game platform.",
    acceptance: [
      "The simulator can drive repeatable load and failure scenarios.",
      "Replays and regression inputs are stable enough to compare across runs.",
      "Failures are surfaced with enough structure for QA and platform owners.",
    ],
    projectSlug: "flight-plan",
    goalSlug: "sensory-render-simulation-fidelity",
    assigneeAgentSlug: AGENT_ALIASES.simulationEngineer,
    parentSeedId: "sensory-simulation-fidelity",
    epicSlug: "sensory-engine",
    priority: "high",
    status: "backlog",
  },
];

const ROUTINES: RoutineSeed[] = [
  {
    slug: "monday-strategy-review",
    title: "Monday strategy review",
    summary: "Review the company goal, current posture, and any approval backlog before the week starts.",
    projectSlug: "studio-ops",
    goalSlug: "studio-operations",
    assigneeAgentSlug: AGENT_ALIASES.founder,
    priority: "high",
    cronExpression: "0 9 * * 1",
    timezone: "Australia/Sydney",
  },
  {
    slug: "tuesday-roadmap-raid-review",
    title: "Tuesday roadmap and RAID review",
    summary: "Refresh milestones, risks, blockers, and dependency ownership for the active roadmap.",
    projectSlug: "studio-ops",
    goalSlug: "launch-readiness",
    assigneeAgentSlug: AGENT_ALIASES.programManager,
    priority: "high",
    cronExpression: "30 9 * * 2",
    timezone: "Australia/Sydney",
  },
  {
    slug: "wednesday-budget-runway-review",
    title: "Wednesday budget and runway review",
    summary: "Check studio spend, burn, and headroom before operational drift becomes a problem.",
    projectSlug: "studio-ops",
    goalSlug: "studio-operations",
    assigneeAgentSlug: AGENT_ALIASES.founder,
    priority: "high",
    cronExpression: "0 10 * * 3",
    timezone: "Australia/Sydney",
  },
  {
    slug: "thursday-lab-device-health-check",
    title: "Thursday lab and device health check",
    summary: "Verify the lab, device farm, and procurement picture for the next test window.",
    projectSlug: "studio-ops",
    goalSlug: "studio-operations",
    assigneeAgentSlug: AGENT_ALIASES.adminOps,
    priority: "medium",
    cronExpression: "30 10 * * 4",
    timezone: "Australia/Sydney",
  },
  {
    slug: "friday-qa-regression-smoke",
    title: "Friday QA and regression smoke",
    summary: "Run the weekly smoke check, confirm regressions, and capture anything that needs follow-up.",
    projectSlug: "studio-ops",
    goalSlug: "launch-readiness",
    assigneeAgentSlug: AGENT_ALIASES.sdetEngineer,
    priority: "high",
    cronExpression: "0 11 * * 5",
    timezone: "Australia/Sydney",
  },
];

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEmptyObject(value: unknown): boolean {
  return isPlainRecord(value) && Object.keys(value).length === 0;
}

function compareYamlKeys(left: string, right: string) {
  return left.localeCompare(right);
}

function orderedYamlEntries(value: Record<string, unknown>) {
  return Object.entries(value).sort(([left], [right]) => compareYamlKeys(left, right));
}

function renderYamlScalar(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
  if (typeof value !== "string") return JSON.stringify(value);
  if (value.length === 0) return '""';
  if (/^[A-Za-z0-9_./:-]+$/.test(value)) return value;
  return JSON.stringify(value);
}

function renderYamlBlock(value: unknown, indentLevel: number): string[] {
  const indent = "  ".repeat(indentLevel);
  if (Array.isArray(value)) {
    if (value.length === 0) return [`${indent}[]`];
    const lines: string[] = [];
    for (const entry of value) {
      const scalar = entry === null || typeof entry === "string" || typeof entry === "boolean" || typeof entry === "number" || Array.isArray(entry) && entry.length === 0 || isEmptyObject(entry);
      if (scalar) {
        lines.push(`${indent}- ${renderYamlScalar(entry)}`);
        continue;
      }
      lines.push(`${indent}-`);
      lines.push(...renderYamlBlock(entry, indentLevel + 1));
    }
    return lines;
  }
  if (isPlainRecord(value)) {
    const entries = orderedYamlEntries(value);
    if (entries.length === 0) return [`${indent}{}`];
    const lines: string[] = [];
    for (const [key, entry] of entries) {
      const scalar = entry === null || typeof entry === "string" || typeof entry === "boolean" || typeof entry === "number" || Array.isArray(entry) && entry.length === 0 || isEmptyObject(entry);
      if (scalar) {
        lines.push(`${indent}${key}: ${renderYamlScalar(entry)}`);
        continue;
      }
      lines.push(`${indent}${key}:`);
      lines.push(...renderYamlBlock(entry, indentLevel + 1));
    }
    return lines;
  }
  return [`${indent}${renderYamlScalar(value)}`];
}

function renderFrontmatter(frontmatter: Record<string, unknown>) {
  const lines = ["---"];
  for (const [key, value] of orderedYamlEntries(frontmatter)) {
    if (value === null || value === undefined) continue;
    const scalar = typeof value === "string" || typeof value === "boolean" || typeof value === "number" || Array.isArray(value) && value.length === 0 || isEmptyObject(value);
    if (scalar) {
      lines.push(`${key}: ${renderYamlScalar(value)}`);
      continue;
    }
    lines.push(`${key}:`);
    lines.push(...renderYamlBlock(value, 1));
  }
  lines.push("---");
  return `${lines.join("\n")}\n`;
}

function buildMarkdown(frontmatter: Record<string, unknown>, body: string) {
  const cleanBody = body.replace(/\r\n/g, "\n").trim();
  if (!cleanBody) return `${renderFrontmatter(frontmatter)}\n`;
  return `${renderFrontmatter(frontmatter)}\n${cleanBody}\n`;
}

function buildYamlFile(value: Record<string, unknown>) {
  return `${renderYamlBlock(value, 0).join("\n")}\n`;
}

function normalizeBodyText(lines: string[]) {
  return lines.map((line) => line.trimEnd()).join("\n");
}

async function ensureDir(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function writeText(filePath: string, content: string) {
  await ensureDir(filePath);
  await writeFile(filePath, content.replace(/\r\n/g, "\n"), "utf8");
}

function resolveAgentSlug(agentRows: Array<{ id: string; name: string }>, slug: string) {
  const target = normalizeAgentUrlKey(slug) ?? slug;
  const match = agentRows.find((agent) => (normalizeAgentUrlKey(agent.name) ?? agent.name) === target);
  if (!match) {
    throw new Error(`Missing Tremor agent for slug "${slug}"`);
  }
  return match;
}

function issueFrontmatter(seed: IssueSeed, projectSlug: string, assigneeSlug: string) {
  return {
    schema: "agentcompanies/v1",
    kind: "task",
    slug: seed.seedId,
    name: seed.title,
    project: projectSlug,
    assignee: assigneeSlug,
    metadata: {
      paperclip: {
        epicSlug: seed.epicSlug,
        goalSlug: seed.goalSlug,
        parentSlug: seed.parentSeedId ?? null,
        workType: "issue",
      },
    },
  };
}

function routineFrontmatter(seed: RoutineSeed, projectSlug: string, assigneeSlug: string) {
  return {
    schema: "agentcompanies/v1",
    kind: "task",
    slug: seed.slug,
    name: seed.title,
    project: projectSlug,
    assignee: assigneeSlug,
    recurring: true,
    metadata: {
      paperclip: {
        goalSlug: seed.goalSlug,
        workType: "routine",
      },
    },
  };
}

function projectFrontmatter(seed: ProjectSeed) {
  return {
    schema: "agentcompanies/v1",
    kind: "project",
    slug: seed.slug,
    name: seed.name,
    description: seed.description,
    owner: seed.ownerAgentSlug,
  };
}

function companyFrontmatter() {
  return {
    schema: "agentcompanies/v1",
    kind: "company",
    slug: "tremor",
    name: "Tremor",
    description: "Local-first Apple ecosystem game studio for tactile board-game experiences.",
    authors: ["Embr Labs"],
    tags: ["game-studio", "apple", "local-first", "r-and-d"],
    goals: GOALS.map((goal) => goal.title),
    includes: [
      "./teams/leadership/TEAM.md",
      "./teams/nervous-system/TEAM.md",
      "./teams/sensory-engine/TEAM.md",
      "./teams/fidelity-quality/TEAM.md",
      "./projects/flight-plan/PROJECT.md",
      "./projects/studio-ops/PROJECT.md",
      "./tasks/README.md",
    ],
    requirements: {
      secrets: ["APPLE_DEVELOPER_ACCOUNT", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"],
    },
  };
}

function companyReadme() {
  return normalizeBodyText([
    "# Tremor",
    "",
    "> Local-first Apple ecosystem game studio for tactile board-game experiences.",
    "",
    "## What's Inside",
    "",
    "| Content | Count |",
    "|---------|-------|",
    "| Agents | 15 |",
    "| Projects | 2 |",
    "| Starter tasks | 15 |",
    "| Routines | 5 |",
    "| Goals | 17 |",
    "| Skills | 55 |",
    "",
    "## Work Graph",
    "",
    "- Division chart: Leadership Cell, Nervous System Division, Sensory Engine Division, Fidelity and Quality Division",
    "- Company goal: `Ship Tremor alpha`",
    "- Branch goals: `Platform foundation`, `Sensory engine`, `Launch readiness`, `Studio operations`",
    "- Delivery project: `Tremor Flight Plan`",
    "- Studio operations project: `Tremor Studio Ops`",
    "- Goals are seeded at runtime because the portable package does not carry them yet.",
    "- The live tree includes four branch goals plus twelve leaf goals beneath them.",
    "- Issues and routines live under `tasks/` and round-trip through the package importer.",
    "",
    "## Agents",
    "",
    "| Agent | Division | Role | Reports To |",
    "|-------|----------|------|------------|",
    "| Founder | Leadership Cell | CEO | — |",
    "| Co-Engineering Lead A | Leadership Cell | Platform and Networking Lead | founder |",
    "| Co-Engineering Lead B | Leadership Cell | Simulation and Sensory Lead | founder |",
    "| Systems Network Engineer | Nervous System Division | Senior Systems and Network Engineer | co-engineering-lead-platform |",
    "| DevSecOps Engineer | Nervous System Division | Platform and DevSecOps Engineer | founder |",
    "| DSP Audio Engineer | Sensory Engine Division | DSP and Audio Engineer | co-engineering-lead-simulation |",
    "| Computer Vision and AR Engineer | Sensory Engine Division | Computer Vision and AR Engineer | co-engineering-lead-simulation |",
    "| Technical Artist | Sensory Engine Division | Technical Artist | co-engineering-lead-simulation |",
    "| GenAI Architect | Sensory Engine Division | Generative AI and Search Architect | co-engineering-lead-simulation |",
    "| Simulation Engineer | Sensory Engine Division | Physics and Simulation Specialist | co-engineering-lead-simulation |",
    "| Lead Product Designer | Fidelity and Quality Division | Lead Product Designer | founder |",
    "| Tools QA Engineer | Fidelity and Quality Division | Tools and QA Engineer | program-manager |",
    "| SDET Engineer | Fidelity and Quality Division | Software Engineer in Test | program-manager |",
    "| Program Manager | Leadership Cell | Technical Program Manager | founder |",
    "| Admin and Ops | Leadership Cell / Studio Ops | Admin and Operations | founder |",
    "",
    "## Getting Started",
    "",
    "```bash",
    "pnpm paperclipai company import ./docs/companies/tremor",
    "```",
    "",
    "## Artifacts",
    "",
    "See [artifacts/README.md](./artifacts/README.md) for the discrete breakdown of the source conversation into reusable documents.",
    "",
    "## Projects",
    "",
    "See [projects/README.md](./projects/README.md) for the delivery and operations projects.",
    "",
    "## Tasks",
    "",
    "See [tasks/README.md](./tasks/README.md) for the starter issue graph and recurring routines.",
    "",
    "## Skills",
    "",
    "See [skills/README.md](./skills/README.md) for the Tremor skill packages used by the company import.",
  ]);
}

function companyMarkdown() {
  return normalizeBodyText([
    "# Tremor",
    "",
    "Tremor is a $4.5M R&D studio building local-first, Apple-native board-game systems that combine deterministic networking, shared-screen presentation, and tactile feedback.",
    "",
    "## Operating Thesis",
    "",
    "- Wired-first, AirPlay-fallback later.",
    "- Authoritative state lives on the hub.",
    "- iPhone and iPad act as tactile clients.",
    "- TV is the shared board and spectator surface.",
    "- The product should feel physically grounded before it feels expansive.",
    "",
    "## Company Shape",
    "",
    "- Leadership Cell: founder, program manager, and both co-engineering leads set company direction and coordinate the delivery spine.",
    "- Nervous System Division: platform networking and DevSecOps own deterministic transport, release integrity, and the authoritative runtime.",
    "- Sensory Engine Division: simulation, audio, vision, technical art, and GenAI own the tactile and perceptual layer of the product.",
    "- Fidelity and Quality Division: product design, QA, and SDET own the player-facing quality bar, release readiness, and verification feedback loop.",
    "- Studio operations is support work led from Leadership Cell through the `Tremor Studio Ops` project rather than a separate division tree.",
    "",
    "## Work Graph",
    "",
    "- The company goal is seeded at runtime: `Ship Tremor alpha`.",
    "- Branch goals are `Platform foundation`, `Sensory engine`, `Launch readiness`, and `Studio operations`.",
    "- `Tremor Flight Plan` carries the first three branches: platform foundation, sensory engine, and launch readiness.",
    "- `Tremor Studio Ops` carries the studio operations branch and the recurring operating cadence that supports the delivery work.",
    "- Each branch is decomposed into three leaf goals so the roadmap, projects, and issues all point at the same execution spine.",
    "- The live company should have 17 goals, 15 issues, and 5 recurring routines after bootstrap.",
    "",
    "## What Good Looks Like",
    "",
    "- A first playable slice with deterministic state sync.",
    "- Stable local mesh connectivity across multiple devices.",
    "- A clear skills matrix for every hire.",
    "- A working onboarding guide for every agent.",
    "- Metrics for latency, haptic jitter, and board fidelity.",
  ]);
}

function projectMarkdown(seed: ProjectSeed) {
  const body =
    seed.slug === "flight-plan"
      ? [
        "## Branch Coverage",
        "",
        "- Platform foundation",
        "- Sensory engine",
        "- Launch readiness",
        "",
        "## Milestones",
        "",
        "### Platform Foundation",
        "",
        "- Authoritative state model",
        "- Local mesh transport",
        "- Rule ingestion and synthesis",
        "",
        "### Sensory Engine",
        "",
        "- Board ingestion and calibration",
        "- Timing, haptics, and audio",
        "- Render and simulation fidelity",
        "",
        "### Launch Readiness",
        "",
        "- Milestone control and RAID",
        "- Regression harness and QA automation",
        "- Release safety and dual-screen readiness",
        "",
        "## Phase 1",
        "",
        "- Establish the authoritative state model.",
        "- Land a deterministic local mesh connection.",
        "- Define the first vertical slice and its regression harness.",
        "",
        "## Phase 2",
        "",
        "- Add board ingestion and sensory synchronization.",
        "- Introduce the core haptic and visual language.",
        "- Validate the system against the KPI dashboard.",
        "",
        "## Phase 3",
        "",
        "- Expand the experience to multiple game formats.",
        "- Harden AirPlay fallback and broader device support.",
        "- Prepare the platform for publishing and reuse.",
      ]
      : [
        "## Branch Coverage",
        "",
        "- Studio operations",
        "",
        "## Milestones",
        "",
        "- Lab readiness and device health",
        "- Budget and runway discipline",
        "- Approvals and onboarding hygiene",
        "",
        "## Scope",
        "",
        "- Run weekly strategy, RAID, budget, and lab health cadences.",
        "- Keep release safety, regression coverage, and operational hygiene visible.",
        "- Own the support work that keeps the delivery project unblocked.",
        "",
        "## Routine Coverage",
        "",
        "- Monday strategy review",
        "- Tuesday roadmap and RAID review",
        "- Wednesday budget and runway review",
        "- Thursday lab and device health check",
        "- Friday QA and regression smoke",
      ];

  return buildMarkdown(projectFrontmatter(seed), normalizeBodyText(body));
}

function issueMarkdown(seed: IssueSeed) {
  const lines = [
    `## Summary`,
    "",
    seed.summary,
    "",
    "## Acceptance Criteria",
    "",
    ...seed.acceptance.map((item) => `- ${item}`),
  ];
  return buildMarkdown(issueFrontmatter(seed, seed.projectSlug, seed.assigneeAgentSlug), normalizeBodyText(lines));
}

function issueBody(seed: IssueSeed) {
  return normalizeBodyText([
    "## Summary",
    "",
    seed.summary,
    "",
    "## Acceptance Criteria",
    "",
    ...seed.acceptance.map((item) => `- ${item}`),
  ]);
}

function routineMarkdown(seed: RoutineSeed) {
  const lines = [
    "## Summary",
    "",
    seed.summary,
    "",
    "## Cadence",
    "",
    `- Schedule: ${seed.cronExpression} (${seed.timezone})`,
    "- Recurring: true",
    "- Project: Tremor Studio Ops",
    "",
    "## Expected Output",
    "",
    "- A visible update in the activity log.",
    "- The owning agent knows what changed and what should happen next.",
    "- Missed runs should be easy to reason about.",
  ];
  return buildMarkdown(routineFrontmatter(seed, seed.projectSlug, seed.assigneeAgentSlug), normalizeBodyText(lines));
}

function branchGoalTitle(goalSlug: string) {
  const goalSeed = GOALS.find((goal) => goal.slug === goalSlug);
  if (!goalSeed) return goalSlug;
  if (goalSeed.level === "task" && goalSeed.parentSlug) {
    return GOALS.find((goal) => goal.slug === goalSeed.parentSlug)?.title ?? goalSeed.title;
  }
  return goalSeed.title;
}

function tasksReadme() {
  const rows = [
    "| Seed | Type | Branch Goal | Project | Assignee | Purpose |",
    "|------|------|-------------|---------|----------|---------|",
    ...ISSUES.map((issue) => {
      const type = issue.parentSeedId ? "issue" : "epic";
      const branchGoal = branchGoalTitle(issue.goalSlug);
      const project = issue.projectSlug === "flight-plan" ? "Tremor Flight Plan" : "Tremor Studio Ops";
      const assignee = issue.assigneeAgentSlug;
      return `| [${issue.seedId}](./issues/${issue.seedId}/TASK.md) | ${type} | ${branchGoal} | ${project} | ${assignee} | ${issue.title} |`;
    }),
    "",
    "| Routine | Branch Goal | Project | Assignee | Schedule |",
    "|---------|-------------|---------|----------|----------|",
    ...ROUTINES.map((routine) => {
      const branchGoal = branchGoalTitle(routine.goalSlug);
      const schedule = `${routine.cronExpression} (${routine.timezone})`;
      return `| [${routine.slug}](./routines/${routine.slug}/TASK.md) | ${branchGoal} | Tremor Studio Ops | ${routine.assigneeAgentSlug} | ${schedule} |`;
    }),
  ];
  return normalizeBodyText([
    "# Tremor Tasks",
    "",
    "Seed tasks and recurring routines for the Tremor company graph.",
    "",
    ...rows,
    "",
    "Goals are seeded separately at runtime by the bootstrap script, including the milestone sub-goals that sit under the four roadmap branches.",
    "",
    "Each starter issue is attached to one of those leaf goals so the issue graph mirrors the roadmap tree.",
  ]);
}

function projectsReadme() {
  return normalizeBodyText([
    "# Tremor Projects",
    "",
    "## Delivery",
    "",
    "- [Tremor Flight Plan](./flight-plan/PROJECT.md)",
    "- Covers the `Platform foundation`, `Sensory engine`, and `Launch readiness` branches.",
    "",
    "## Operations",
    "",
    "- [Tremor Studio Ops](./studio-ops/PROJECT.md)",
    "- Covers the `Studio operations` branch and the recurring operating cadence.",
    "",
    "The delivery project carries the first three roadmap branches; the operations project carries the fourth branch and keeps the studio unblocked.",
    "",
    "For the phase and sub-goal breakdown, use [Executive Milestones](../artifacts/executive/04-milestones.md).",
  ]);
}

function operatingBootstrapArtifact() {
  return normalizeBodyText([
    "# Work Graph Bootstrap",
    "",
    "The Tremor work graph is split into runtime goals plus portable projects, issues, and routines.",
    "",
    "## Graph",
    "",
    "- Root company goal: `Ship Tremor alpha`",
    "- Branch goals: platform foundation, sensory engine, launch readiness, studio operations",
    "- Leaf goals: authoritative state model, local mesh transport, rule ingestion and synthesis, board ingestion and calibration, timing, haptics, and audio, render and simulation fidelity, milestone control and RAID, regression harness and QA automation, release safety and dual-screen readiness, lab readiness and device health, budget and runway discipline, approvals and onboarding hygiene",
    "- Delivery project: `Tremor Flight Plan`",
    "- Operations project: `Tremor Studio Ops`",
    "- Starter issues: 15",
    "- Recurring routines: 5",
    "",
    "## Verification",
    "",
    "- The bootstrap should leave the company with 17 goals, 2 projects, 15 seeded issues, and 5 routines.",
    "- `Tremor Flight Plan` should own the first three branch goals.",
    "- `Tremor Studio Ops` should own the studio operations branch.",
    "- No legacy suffix artifacts such as `Tremor Flight Plan 2` or `Tremor Studio Ops 2` should remain if they are safe to remove.",
    "",
    "## Bootstrap Rule",
    "",
    "- Re-run the bootstrap script to keep docs and runtime state synchronized.",
    "- Goals are runtime-seeded because the portable company format does not carry them.",
    "- Issues and routines are seeded from portable `TASK.md` files and `.paperclip.yaml` triggers.",
  ]);
}

function executiveMilestonesMarkdown() {
  return normalizeBodyText([
    "# Milestones",
    "",
    "The flight plan is broken into leaf goals so the roadmap, projects, and issues all point at the same execution spine.",
    "",
    "## Phase 1: Platform Foundation",
    "",
    "- Project: `Tremor Flight Plan`",
    "- Primary division: `Nervous System Division` with leadership support",
    "",
    "- Authoritative state model",
    "- Local mesh transport",
    "- Rule ingestion and synthesis",
    "",
    "## Phase 2: Sensory Engine",
    "",
    "- Project: `Tremor Flight Plan`",
    "- Primary division: `Sensory Engine Division`",
    "",
    "- Board ingestion and calibration",
    "- Timing, haptics, and audio",
    "- Render and simulation fidelity",
    "",
    "## Phase 3: Launch Readiness",
    "",
    "- Project: `Tremor Flight Plan`",
    "- Primary division: `Fidelity and Quality Division` with leadership support",
    "",
    "- Milestone control and RAID",
    "- Regression harness and QA automation",
    "- Release safety and dual-screen readiness",
    "",
    "## Phase 4: Studio Operations",
    "",
    "- Project: `Tremor Studio Ops`",
    "- Primary ownership: `Leadership Cell / Studio Ops`",
    "",
    "- Lab readiness and device health",
    "- Budget and runway discipline",
    "- Approvals and onboarding hygiene",
  ]);
}

async function writePackageDocs() {
  const companyPath = path.join(DOCS_ROOT, "COMPANY.md");
  const readmePath = path.join(DOCS_ROOT, "README.md");
  const projectsReadmePath = path.join(DOCS_ROOT, "projects", "README.md");
  const flightPlanPath = path.join(DOCS_ROOT, "projects", "flight-plan", "PROJECT.md");
  const studioOpsPath = path.join(DOCS_ROOT, "projects", "studio-ops", "PROJECT.md");
  const tasksReadmePath = path.join(DOCS_ROOT, "tasks", "README.md");
  const routinesYamlPath = path.join(DOCS_ROOT, ".paperclip.yaml");
  const operatingArtifactPath = path.join(DOCS_ROOT, "artifacts", "operating", "05-work-graph-bootstrap.md");
  const milestonesPath = path.join(DOCS_ROOT, "artifacts", "executive", "04-milestones.md");

  await writeText(companyPath, buildMarkdown(companyFrontmatter(), companyMarkdown()));
  await writeText(readmePath, companyReadme());
  await writeText(projectsReadmePath, projectsReadme());
  await writeText(flightPlanPath, projectMarkdown(PROJECTS[0]!));
  await writeText(studioOpsPath, projectMarkdown(PROJECTS[1]!));
  await writeText(tasksReadmePath, tasksReadme());
  await writeText(operatingArtifactPath, operatingBootstrapArtifact());
  await writeText(milestonesPath, executiveMilestonesMarkdown());

  for (const issue of ISSUES) {
    const filePath = path.join(DOCS_ROOT, "tasks", "issues", issue.seedId, "TASK.md");
    await writeText(filePath, issueMarkdown(issue));
  }
  for (const routine of ROUTINES) {
    const filePath = path.join(DOCS_ROOT, "tasks", "routines", routine.slug, "TASK.md");
    await writeText(filePath, routineMarkdown(routine));
  }

  const routinesYaml: Record<string, unknown> = {
    schema: "paperclip/v1",
    routines: Object.fromEntries(
      ROUTINES.map((routine) => [
        routine.slug,
        {
          concurrencyPolicy: "coalesce_if_active",
          catchUpPolicy: "skip_missed",
          triggers: [
            {
              kind: "schedule",
              label: routine.title,
              enabled: true,
              cronExpression: routine.cronExpression,
              timezone: routine.timezone,
            },
          ],
        },
      ]),
    ),
  };
  await writeText(routinesYamlPath, buildYamlFile(routinesYaml));

  const operatingReadmePath = path.join(DOCS_ROOT, "artifacts", "operating", "README.md");
  const operatingReadme = normalizeBodyText([
    "# Operating Cabinet",
    "",
    "Operational docs for the Tremor company graph, cadence, and runtime hygiene.",
    "",
    "## Start Here",
    "",
    "- [Decision, Linear, and Approvals](./04-decision-and-linear-governance.md)",
    "- [Work Graph Bootstrap](./05-work-graph-bootstrap.md)",
    "",
    "## Ownership",
    "",
    "- Program Manager owns execution hygiene and follow-through.",
    "- Founder owns strategy and escalation.",
    "",
    "## Documents",
    "",
    "- [RAID and Git Governance](./01-raid-and-git-governance.md)",
    "- [QA and HIL](./02-qa-and-hil.md)",
    "- [DevSecOps and Lab Ops](./03-devsecops-and-lab-ops.md)",
    "- [Decision, Linear, and Approvals](./04-decision-and-linear-governance.md)",
    "- [Work Graph Bootstrap](./05-work-graph-bootstrap.md)",
  ]);
  await writeText(operatingReadmePath, operatingReadme);
}

async function resolveTremorAgents(db: ReturnType<typeof createDb>) {
  const agentsSvc = agentService(db);
  const rows = await agentsSvc.list(COMPANY_ID, { includeTerminated: true });
  const bySlug = new Map(rows.map((row) => [normalizeAgentUrlKey(row.name) ?? row.name, row]));
  const resolved: Record<string, { id: string; name: string }> = {};
  for (const [alias, slug] of Object.entries(AGENT_ALIASES)) {
    const targetSlug = normalizeAgentUrlKey(slug) ?? slug;
    const agent = bySlug.get(targetSlug) ?? bySlug.get(slug);
    if (!agent) {
      throw new Error(`Missing Tremor agent "${slug}" for alias "${alias}"`);
    }
    resolved[alias] = { id: agent.id, name: agent.name };
  }
  return resolved;
}

function resolveAgentSeed(
  agentIds: Record<string, { id: string; name: string }>,
  displayName: string,
) {
  const target = normalizeAgentUrlKey(displayName) ?? displayName;
  for (const [alias, label] of Object.entries(AGENT_ALIASES)) {
    const candidate = normalizeAgentUrlKey(label) ?? label;
    if (candidate === target) {
      const agent = agentIds[alias as keyof typeof agentIds];
      if (agent) return agent;
    }
  }
  return null;
}

async function upsertGoals(db: ReturnType<typeof createDb>, agentIds: Record<string, { id: string; name: string }>) {
  const svc = goalService(db);
  const existing = await svc.list(COMPANY_ID);
  const byTitle = new Map(existing.map((goal) => [goal.title, goal]));
  const resolved: Record<string, { id: string; title: string }> = {};

  for (const seed of GOALS) {
    const ownerAgentId = resolveAgentSeed(agentIds, seed.ownerAgentSlug)?.id ?? null;
    const parentId = seed.parentSlug ? resolved[seed.parentSlug]?.id ?? byTitle.get(GOALS.find((goal) => goal.slug === seed.parentSlug)?.title ?? "")?.id ?? null : null;
    const existingGoal = byTitle.get(seed.title) ?? null;
    if (existingGoal) {
      const updated = await svc.update(existingGoal.id, {
        title: seed.title,
        description: seed.description,
        level: seed.level,
        status: seed.status,
        parentId,
        ownerAgentId,
      });
      if (!updated) throw new Error(`Failed to update goal "${seed.title}"`);
      resolved[seed.slug] = { id: updated.id, title: updated.title };
      await logActivity(db, {
        companyId: COMPANY_ID,
        actorType: BOOTSTRAP_ACTOR.actorType,
        actorId: BOOTSTRAP_ACTOR.actorId,
        action: "goal.updated",
        entityType: "goal",
        entityId: updated.id,
        details: { title: updated.title },
      });
      continue;
    }
    const created = await svc.create(COMPANY_ID, {
      title: seed.title,
      description: seed.description,
      level: seed.level,
      status: seed.status,
      parentId,
      ownerAgentId,
    });
    resolved[seed.slug] = { id: created.id, title: created.title };
    await logActivity(db, {
      companyId: COMPANY_ID,
      actorType: BOOTSTRAP_ACTOR.actorType,
      actorId: BOOTSTRAP_ACTOR.actorId,
      action: "goal.created",
      entityType: "goal",
      entityId: created.id,
      details: { title: created.title },
    });
  }

  return resolved;
}

function projectGoalIds(seed: ProjectSeed, goalMap: Record<string, { id: string; title: string }>) {
  return seed.goalSlugs.map((slug) => {
    const goal = goalMap[slug];
    if (!goal) throw new Error(`Missing goal "${slug}" for project "${seed.slug}"`);
    return goal.id;
  });
}

async function removeDuplicateProjectIfSafe(
  db: ReturnType<typeof createDb>,
  projectSvc: ReturnType<typeof projectService>,
  issueSvc: ReturnType<typeof issueService>,
  projectId: string,
) {
  const issueRows = await issueSvc.list(COMPANY_ID, { projectId });
  const workspaces = await projectSvc.listWorkspaces(projectId);
  if (issueRows.length > 0 || workspaces.length > 0) return false;
  const removed = await projectSvc.remove(projectId);
  if (removed) {
    await logActivity(db, {
      companyId: COMPANY_ID,
      actorType: BOOTSTRAP_ACTOR.actorType,
      actorId: BOOTSTRAP_ACTOR.actorId,
      action: "project.deleted",
      entityType: "project",
      entityId: removed.id,
      details: { name: removed.name },
    });
    return true;
  }
  return false;
}

async function upsertProjects(
  db: ReturnType<typeof createDb>,
  goalMap: Record<string, { id: string; title: string }>,
  agentIds: Record<string, { id: string; name: string }>,
) {
  const svc = projectService(db);
  const issueSvc = issueService(db);
  const existing = await svc.list(COMPANY_ID);
  const bySlug = new Map(existing.map((project) => [normalizeProjectUrlKey(project.name) ?? project.urlKey, project]));
  const resolved: Record<string, { id: string; name: string; goalIds: string[] }> = {};

  for (const seed of PROJECTS) {
    const leadAgent = resolveAgentSeed(agentIds, seed.leadAgentSlug);
    if (!leadAgent) throw new Error(`Missing lead agent "${seed.leadAgentSlug}" for project "${seed.slug}"`);
    const goalIds = projectGoalIds(seed, goalMap);
    const targetNames = seed.slug === "studio-ops"
      ? ["studio-ops", "tremor-studio-ops", "flight-plan-2", "tremor-flight-plan-2"]
      : ["flight-plan", "tremor-flight-plan"];
    const found = targetNames.map((candidate) => bySlug.get(candidate)).find((project): project is NonNullable<typeof project> => Boolean(project));
    if (found) {
      const updated = await svc.update(found.id, {
        name: seed.name,
        description: seed.description,
        leadAgentId: leadAgent.id,
        status: seed.status,
        goalIds,
        goalId: goalIds[0] ?? null,
      });
      if (!updated) throw new Error(`Failed to update project "${seed.name}"`);
      resolved[seed.slug] = { id: updated.id, name: updated.name, goalIds };
      bySlug.set(normalizeProjectUrlKey(updated.name) ?? updated.urlKey, updated);
      await logActivity(db, {
        companyId: COMPANY_ID,
        actorType: BOOTSTRAP_ACTOR.actorType,
        actorId: BOOTSTRAP_ACTOR.actorId,
        action: "project.updated",
        entityType: "project",
        entityId: updated.id,
        details: { name: updated.name },
      });
      const legacyDuplicateKeys = seed.slug === "studio-ops"
        ? new Set(["flight-plan-2", "tremor-flight-plan-2", "studio-ops-2", "tremor-studio-ops-2"])
        : new Set(["flight-plan-2", "tremor-flight-plan-2"]);
      for (const duplicate of existing) {
        const key = normalizeProjectUrlKey(duplicate.name) ?? duplicate.urlKey;
        if (duplicate.id === updated.id) continue;
        if (!legacyDuplicateKeys.has(key)) continue;
        await removeDuplicateProjectIfSafe(db, svc, issueSvc, duplicate.id);
      }
      continue;
    }

    const created = await svc.create(COMPANY_ID, {
      name: seed.name,
      description: seed.description,
      leadAgentId: leadAgent.id,
      status: seed.status,
      goalIds,
      goalId: goalIds[0] ?? null,
    });
    resolved[seed.slug] = { id: created.id, name: created.name, goalIds };
    bySlug.set(normalizeProjectUrlKey(created.name) ?? created.urlKey, created);
    await logActivity(db, {
      companyId: COMPANY_ID,
      actorType: BOOTSTRAP_ACTOR.actorType,
      actorId: BOOTSTRAP_ACTOR.actorId,
      action: "project.created",
      entityType: "project",
      entityId: created.id,
      details: { name: created.name },
    });

    const legacyDuplicateKeys = seed.slug === "studio-ops"
      ? new Set(["flight-plan-2", "tremor-flight-plan-2", "studio-ops-2", "tremor-studio-ops-2"])
      : new Set(["flight-plan-2", "tremor-flight-plan-2"]);
    for (const duplicate of existing) {
      const key = normalizeProjectUrlKey(duplicate.name) ?? duplicate.urlKey;
      if (duplicate.id === created.id) continue;
      if (!legacyDuplicateKeys.has(key)) continue;
      await removeDuplicateProjectIfSafe(db, svc, issueSvc, duplicate.id);
    }
  }

  return resolved;
}

async function upsertIssues(
  db: ReturnType<typeof createDb>,
  goalMap: Record<string, { id: string; title: string }>,
  projectMap: Record<string, { id: string; name: string; goalIds: string[] }>,
  agentIds: Record<string, { id: string; name: string }>,
) {
  const svc = issueService(db);
  const existing = await svc.list(COMPANY_ID, { includeRoutineExecutions: true });
  const byOrigin = new Map(existing.filter((issue) => issue.originKind === "tremor_seed" && issue.originId).map((issue) => [issue.originId!, issue]));
  const resolved = new Map<string, string>();

  const epicSeeds = ISSUES.filter((issue) => !issue.parentSeedId);
  const childSeeds = ISSUES.filter((issue) => issue.parentSeedId);

  const createOrUpdate = async (seed: IssueSeed) => {
    const project = projectMap[seed.projectSlug];
    if (!project) throw new Error(`Missing project "${seed.projectSlug}" for issue "${seed.seedId}"`);
    const goal = goalMap[seed.goalSlug];
    if (!goal) throw new Error(`Missing goal "${seed.goalSlug}" for issue "${seed.seedId}"`);
    const assignee = resolveAgentSeed(agentIds, seed.assigneeAgentSlug);
    if (!assignee) throw new Error(`Missing assignee "${seed.assigneeAgentSlug}" for issue "${seed.seedId}"`);
    const parentId = seed.parentSeedId ? resolved.get(seed.parentSeedId) ?? null : null;
    const existingIssue = byOrigin.get(seed.seedId) ?? null;
    const patch = {
      projectId: project.id,
      goalId: goal.id,
      parentId,
      title: seed.title,
      description: issueBody(seed),
      status: seed.status,
      priority: seed.priority,
      assigneeAgentId: assignee.id,
      originKind: "tremor_seed" as const,
      originId: seed.seedId,
    };
    if (existingIssue) {
      const updated = await svc.update(existingIssue.id, patch);
      if (!updated) throw new Error(`Failed to update issue "${seed.seedId}"`);
      resolved.set(seed.seedId, updated.id);
      await logActivity(db, {
        companyId: COMPANY_ID,
        actorType: BOOTSTRAP_ACTOR.actorType,
        actorId: BOOTSTRAP_ACTOR.actorId,
        action: "issue.updated",
        entityType: "issue",
        entityId: updated.id,
        details: { title: updated.title, originId: seed.seedId },
      });
      return;
    }
    const created = await svc.create(COMPANY_ID, {
      ...patch,
      labelIds: [],
    });
    resolved.set(seed.seedId, created.id);
    await logActivity(db, {
      companyId: COMPANY_ID,
      actorType: BOOTSTRAP_ACTOR.actorType,
      actorId: BOOTSTRAP_ACTOR.actorId,
      action: "issue.created",
      entityType: "issue",
      entityId: created.id,
      details: { title: created.title, originId: seed.seedId },
    });
  };

  for (const seed of epicSeeds) {
    await createOrUpdate(seed);
  }
  for (const seed of childSeeds) {
    await createOrUpdate(seed);
  }

  return resolved;
}

async function upsertRoutines(
  db: ReturnType<typeof createDb>,
  goalMap: Record<string, { id: string; title: string }>,
  projectMap: Record<string, { id: string; name: string; goalIds: string[] }>,
  agentIds: Record<string, { id: string; name: string }>,
) {
  const svc = routineService(db);
  const existing = await svc.list(COMPANY_ID);
  const resolved = new Map<string, string>();

  for (const seed of ROUTINES) {
    const project = projectMap[seed.projectSlug];
    if (!project) throw new Error(`Missing project "${seed.projectSlug}" for routine "${seed.slug}"`);
    const goal = goalMap[seed.goalSlug];
    if (!goal) throw new Error(`Missing goal "${seed.goalSlug}" for routine "${seed.slug}"`);
    const assignee = resolveAgentSeed(agentIds, seed.assigneeAgentSlug);
    if (!assignee) throw new Error(`Missing assignee "${seed.assigneeAgentSlug}" for routine "${seed.slug}"`);
    const matching = existing.filter((routine) =>
      normalizeAgentUrlKey(routine.title) === normalizeAgentUrlKey(seed.title)
      && routine.projectId === project.id
      && routine.assigneeAgentId === assignee.id,
    );
    const primary = matching[0] ?? null;
    for (const duplicate of matching.slice(1)) {
      const detail = await svc.getDetail(duplicate.id);
      if (detail) {
        for (const trigger of detail.triggers) {
          await svc.deleteTrigger(trigger.id);
        }
      }
      await db.delete(routineTable).where(eq(routineTable.id, duplicate.id));
      await logActivity(db, {
        companyId: COMPANY_ID,
        actorType: BOOTSTRAP_ACTOR.actorType,
        actorId: BOOTSTRAP_ACTOR.actorId,
        action: "routine.deleted",
        entityType: "routine",
        entityId: duplicate.id,
        details: { title: duplicate.title },
      });
    }

    const patch = {
      projectId: project.id,
      goalId: goal.id,
      parentIssueId: null,
      title: seed.title,
      description: seed.summary,
      assigneeAgentId: assignee.id,
      priority: seed.priority,
      status: "active" as const,
      concurrencyPolicy: "coalesce_if_active" as const,
      catchUpPolicy: "skip_missed" as const,
    };

    let routineId: string;
    if (primary) {
      const updated = await svc.update(primary.id, patch, { agentId: null, userId: "tremor-bootstrap" });
      if (!updated) throw new Error(`Failed to update routine "${seed.slug}"`);
      routineId = updated.id;
      await logActivity(db, {
        companyId: COMPANY_ID,
        actorType: BOOTSTRAP_ACTOR.actorType,
        actorId: BOOTSTRAP_ACTOR.actorId,
        action: "routine.updated",
        entityType: "routine",
        entityId: updated.id,
        details: { title: updated.title },
      });
    } else {
      const created = await svc.create(COMPANY_ID, patch, { agentId: null, userId: "tremor-bootstrap" });
      routineId = created.id;
      await logActivity(db, {
        companyId: COMPANY_ID,
        actorType: BOOTSTRAP_ACTOR.actorType,
        actorId: BOOTSTRAP_ACTOR.actorId,
        action: "routine.created",
        entityType: "routine",
        entityId: created.id,
        details: { title: created.title },
      });
    }
    resolved.set(seed.slug, routineId);

    const detail = await svc.getDetail(routineId);
    if (!detail) throw new Error(`Failed to read routine "${seed.slug}" after upsert`);
    const scheduleTrigger = detail.triggers.find((trigger) => trigger.kind === "schedule") ?? null;
    const expectedCron = seed.cronExpression;
    const expectedTimezone = seed.timezone;
    const triggerMatches = scheduleTrigger && scheduleTrigger.cronExpression === expectedCron && scheduleTrigger.timezone === expectedTimezone;
    if (!triggerMatches) {
      for (const trigger of detail.triggers) {
        await svc.deleteTrigger(trigger.id);
      }
      const createdTrigger = await svc.createTrigger(routineId, {
        kind: "schedule",
        label: seed.title,
        enabled: true,
        cronExpression: expectedCron,
        timezone: expectedTimezone,
      }, { agentId: null, userId: "tremor-bootstrap" });
      await logActivity(db, {
        companyId: COMPANY_ID,
        actorType: BOOTSTRAP_ACTOR.actorType,
        actorId: BOOTSTRAP_ACTOR.actorId,
        action: "routine.trigger_created",
        entityType: "routine_trigger",
        entityId: createdTrigger.trigger.id,
        details: { routineId, kind: createdTrigger.trigger.kind },
      });
    }
  }

  return resolved;
}

async function verifyGraph(
  db: ReturnType<typeof createDb>,
  goalMap: Record<string, { id: string; title: string }>,
  projectMap: Record<string, { id: string; name: string; goalIds: string[] }>,
  issueMap: Map<string, string>,
  routineMap: Map<string, string>,
) {
  const goalsSvc = goalService(db);
  const projectsSvc = projectService(db);
  const issuesSvc = issueService(db);
  const routinesSvc = routineService(db);

  const goals = await goalsSvc.list(COMPANY_ID);
  const projects = await projectsSvc.list(COMPANY_ID);
  const issues = await issuesSvc.list(COMPANY_ID, { includeRoutineExecutions: true });
  const routines = await routinesSvc.list(COMPANY_ID);

  const projectNames = projects.map((project) => project.name);
  const duplicateProjectNames = projectNames.filter((name, index) => projectNames.indexOf(name) !== index);
  if (duplicateProjectNames.length > 0) {
    throw new Error(`Duplicate project names remain: ${duplicateProjectNames.join(", ")}`);
  }
  const suffixArtifacts = projects
    .map((project) => normalizeProjectUrlKey(project.name) ?? project.urlKey)
    .filter((key) => /^(flight-plan|tremor-flight-plan|studio-ops|tremor-studio-ops)-\d+$/.test(key));
  if (suffixArtifacts.length > 0) {
    throw new Error(`Legacy suffix project artifacts remain: ${suffixArtifacts.join(", ")}`);
  }

  if (goals.length !== 17) throw new Error(`Expected 17 goals, found ${goals.length}`);
  if (projects.length !== 2) throw new Error(`Expected 2 projects, found ${projects.length}`);
  if (issues.filter((issue) => issue.originKind === "tremor_seed").length !== 15) {
    throw new Error(`Expected 15 seeded issues, found ${issues.filter((issue) => issue.originKind === "tremor_seed").length}`);
  }
  if (routines.length !== 5) throw new Error(`Expected 5 routines, found ${routines.length}`);

  for (const seed of GOALS) {
    if (!goalMap[seed.slug]) throw new Error(`Missing goal mapping for ${seed.slug}`);
  }
  for (const seed of PROJECTS) {
    if (!projectMap[seed.slug]) throw new Error(`Missing project mapping for ${seed.slug}`);
  }
  for (const seed of ISSUES) {
    if (!issueMap.get(seed.seedId)) throw new Error(`Missing issue mapping for ${seed.seedId}`);
  }
  for (const seed of ROUTINES) {
    if (!routineMap.get(seed.slug)) throw new Error(`Missing routine mapping for ${seed.slug}`);
  }

  console.log("Graph verification summary:");
  console.log(`- Goals: ${goals.length}`);
  console.log(`- Projects: ${projects.length}`);
  console.log(`- Seeded issues: ${issues.filter((issue) => issue.originKind === "tremor_seed").length}`);
  console.log(`- Routines: ${routines.length}`);
}

async function main() {
  const dbUrl = process.env.DATABASE_URL?.trim()
    || `postgres://paperclip:paperclip@127.0.0.1:${readEmbeddedPort()}/paperclip`;
  const db = createDb(dbUrl);
  const agents = await resolveTremorAgents(db);

  await writePackageDocs();

  const goalMap = await upsertGoals(db, agents);
  const projectMap = await upsertProjects(db, goalMap, agents);
  const issueMap = await upsertIssues(db, goalMap, projectMap, agents);
  const routineMap = await upsertRoutines(db, goalMap, projectMap, agents);
  await verifyGraph(db, goalMap, projectMap, issueMap, routineMap);
}

function readEmbeddedPort() {
  try {
    const pidPath = path.join(os.homedir(), ".paperclip", "instances", "default", "db", "postmaster.pid");
    const contents = readFileSync(pidPath, "utf8").trim().split("\n");
    const port = Number(contents[3]);
    if (Number.isFinite(port) && port > 0) return port;
  } catch {
    // Fall through.
  }
  return 54329;
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : error);
    process.exit(1);
  });
