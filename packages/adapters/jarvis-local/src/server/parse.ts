// `jarvis ask --json` prints exactly one JSON value to stdout on success:
//   - agent mode:   {"content": "...", "turns": N, "tool_results": [...]}
//   - direct mode:  whatever the engine's generate() call returns, which in
//     practice is a dict that also carries a "content" key (the non-JSON
//     branch does `result.get("content", "")`).
// Everything else OpenJarvis prints (banner, spinner, warnings) goes to a
// stderr-bound Rich console, so stdout should be exactly one JSON document
// once the process exits successfully.

export interface ParsedJarvisAsk {
  content: string | null;
  raw: Record<string, unknown> | null;
  usage: {
    inputTokens?: number;
    outputTokens?: number;
  };
  parseError: string | null;
}

function firstJsonValue(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fall back to the last top-level JSON value in the text, in case a
    // warning line leaked onto stdout before the JSON payload.
    const lastBrace = trimmed.lastIndexOf("{");
    if (lastBrace === -1) return undefined;
    try {
      return JSON.parse(trimmed.slice(lastBrace));
    } catch {
      return undefined;
    }
  }
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function parseJarvisAskOutput(stdout: string): ParsedJarvisAsk {
  const value = firstJsonValue(stdout);
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {
      content: null,
      raw: null,
      usage: {},
      parseError: "jarvis ask did not print a JSON object to stdout",
    };
  }

  const record = value as Record<string, unknown>;
  const content = typeof record.content === "string" ? record.content : null;
  const usageRecord =
    typeof record.usage === "object" && record.usage !== null && !Array.isArray(record.usage)
      ? (record.usage as Record<string, unknown>)
      : {};

  return {
    content,
    raw: record,
    usage: {
      inputTokens:
        readNumber(usageRecord.prompt_tokens) ?? readNumber(usageRecord.input_tokens),
      outputTokens:
        readNumber(usageRecord.completion_tokens) ?? readNumber(usageRecord.output_tokens),
    },
    parseError: null,
  };
}

export function firstNonEmptyLine(text: string): string {
  return (
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean) ?? ""
  );
}

export interface JarvisDoctorCheck {
  name: string;
  status: "ok" | "warn" | "fail" | string;
  message: string;
  details?: string | null;
}

export function parseJarvisDoctorOutput(stdout: string): JarvisDoctorCheck[] | null {
  const trimmed = stdout.trim();
  if (!trimmed) return null;
  try {
    const value = JSON.parse(trimmed);
    if (!Array.isArray(value)) return null;
    return value.filter(
      (entry): entry is JarvisDoctorCheck =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as Record<string, unknown>).name === "string" &&
        typeof (entry as Record<string, unknown>).status === "string" &&
        typeof (entry as Record<string, unknown>).message === "string",
    );
  } catch {
    return null;
  }
}
