// `jarvis ask --json` prints one JSON document at the end of the run, not a
// JSONL event stream, so there is nothing structured to format per-line.
// Print stdout as-is, matching the generic `process` adapter's CLI behavior.
export function printJarvisStreamEvent(raw: string, _debug: boolean): void {
  const line = raw.trimEnd();
  if (!line) return;
  console.log(line);
}
