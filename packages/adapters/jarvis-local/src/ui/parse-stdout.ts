import type { TranscriptEntry } from "@paperclipai/adapter-utils";

// `jarvis ask --json` prints one indented multi-line JSON document at the end
// of the run rather than a JSONL event stream, so there is no reliable way to
// interpret it line-by-line as it arrives. Pass every line through as raw
// stdout (same convention as the generic `process` adapter); the full JSON
// result is still available in the run's stored resultJson/summary.
export function parseJarvisStdoutLine(line: string, ts: string): TranscriptEntry[] {
  return [{ kind: "stdout", ts, text: line }];
}
