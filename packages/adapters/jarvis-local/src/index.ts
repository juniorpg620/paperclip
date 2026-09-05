export const type = "jarvis_local";
export const label = "OpenJarvis (local)";

// OpenJarvis (`jarvis model list`) only prints a Rich table, not machine-
// readable JSON, so there is no reliable way to discover model ids from the
// CLI. Leave the static list empty and let operators type the model/engine
// their local OpenJarvis config exposes.
export const models: Array<{ id: string; label: string }> = [];

export const agentConfigurationDoc = `# jarvis_local agent configuration

Adapter: jarvis_local

Use when:
- You want Paperclip to run OpenJarvis (https://github.com/open-jarvis/OpenJarvis) locally as the agent runtime via its \`jarvis\` CLI
- OpenJarvis is already installed, configured (\`jarvis init\`), and has a working inference engine (Ollama, an API-backed engine, etc.)
- You want the agent's own persistent memory (SOUL.md / MEMORY.md / knowledge store under ~/.openjarvis) to carry context across heartbeats instead of Paperclip session resume

Don't use when:
- You need webhook-style external invocation (use openclaw_gateway or http)
- You only need one-shot shell commands (use process)
- The \`jarvis\` CLI is not installed/configured on the machine that runs Paperclip

Core fields:
- cwd (string, optional): working directory the \`jarvis ask\` process is spawned in (created if missing when possible)
- instructionsFilePath (string, optional): absolute path to a markdown instructions file prepended to the run prompt
- promptTemplate (string, optional): run prompt template
- model (string, optional): passed as \`jarvis ask -m <model>\`; omitted when blank
- engine (string, optional): passed as \`jarvis ask -e <engine>\` (e.g. ollama, openai)
- agent (string, optional): passed as \`jarvis ask -a <agent>\`. Leave unset to use OpenJarvis's configured default agent. Set to an empty string to force direct-to-engine mode (no agent loop).
- tools (string, optional): comma-separated tool names passed as \`jarvis ask --tools <list>\`
- noContext (boolean, optional): passed as \`jarvis ask --no-context\` to disable OpenJarvis's memory-context injection for this run
- temperature (number, optional): passed as \`jarvis ask -t <value>\`
- maxTokens (number, optional): passed as \`jarvis ask --max-tokens <value>\`
- command (string, optional): defaults to "jarvis"
- extraArgs (string[], optional): additional CLI args appended before the prompt
- env (object, optional): KEY=VALUE environment variables

Operational fields:
- timeoutSec (number, optional): run timeout in seconds
- graceSec (number, optional): SIGTERM grace period in seconds

Notes:
- Every run is \`jarvis ask --json --no-stream ... "<prompt>"\`, parsed for its \`content\` field (present in both agent-mode and direct-engine-mode JSON output).
- OpenJarvis's \`ask\` command has no per-run session/resume flag: conversational continuity comes from its own on-disk memory store, not from a Paperclip-managed session id. This adapter does not report a sessionId/sessionParams.
- There is no reliable machine-readable model listing (\`jarvis model list\` only prints a table), so models must be entered manually to match your local OpenJarvis config.
- Environment checks run \`jarvis doctor --json\` plus a short "Respond with hello." probe via \`jarvis ask\`.
`;
