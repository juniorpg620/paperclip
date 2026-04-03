import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../scripts/bootstrap-tremor-work-graph.ts",
);
const scriptSource = readFileSync(scriptPath, "utf8");

function sliceBlock(source: string, start: string, end: string) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  expect(startIndex).toBeGreaterThanOrEqual(0);
  expect(endIndex).toBeGreaterThan(startIndex);
  return source.slice(startIndex, endIndex);
}

function countMatches(text: string, pattern: RegExp) {
  return text.match(pattern)?.length ?? 0;
}

describe("Tremor work graph bootstrap", () => {
  it("keeps the seeded goals, projects, issues, and routines aligned", () => {
    const goalsBlock = sliceBlock(scriptSource, "const GOALS:", "const PROJECTS:");
    const projectsBlock = sliceBlock(scriptSource, "const PROJECTS:", "const ISSUES:");
    const issuesBlock = sliceBlock(scriptSource, "const ISSUES:", "const ROUTINES:");
    const routinesBlock = sliceBlock(scriptSource, "const ROUTINES:", "function isPlainRecord");

    expect(countMatches(goalsBlock, /\n\s*slug:/g)).toBe(17);
    expect(countMatches(goalsBlock, /\n\s*level: "task"/g)).toBe(12);
    expect(goalsBlock).toContain('slug: "ship-tremor-alpha"');
    expect(goalsBlock).toContain('slug: "studio-operations"');

    expect(countMatches(projectsBlock, /\n\s*slug:/g)).toBe(2);
    expect(projectsBlock).toContain('"platform-foundation"');
    expect(projectsBlock).toContain('"studio-operations"');

    expect(countMatches(issuesBlock, /\n\s*seedId:/g)).toBe(15);
    expect(issuesBlock).toContain('goalSlug: "platform-authoritative-state-model"');
    expect(issuesBlock).toContain('goalSlug: "launch-milestone-control-raid"');

    expect(countMatches(routinesBlock, /\n\s*slug:/g)).toBe(5);
    expect(routinesBlock).toContain('goalSlug: "studio-operations"');
  });
});
