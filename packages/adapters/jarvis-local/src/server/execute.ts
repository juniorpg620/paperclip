import fs from "node:fs/promises";
import path from "node:path";
import type { AdapterExecutionContext, AdapterExecutionResult } from "@paperclipai/adapter-utils";
import {
  asString,
  asNumber,
  asBoolean,
  asStringArray,
  parseObject,
  buildPaperclipEnv,
  joinPromptSections,
  buildInvocationEnvForLogs,
  ensureAbsoluteDirectory,
  ensureCommandResolvable,
  ensurePathInEnv,
  renderTemplate,
  resolveCommandForLogs,
  runChildProcess,
} from "@paperclipai/adapter-utils/server-utils";
import { firstNonEmptyLine, parseJarvisAskOutput } from "./parse.js";

/** Builds the `jarvis ask` argv, mirroring OpenJarvis's own `ask` CLI flags. */
function buildAskArgs(
  config: Record<string, unknown>,
  prompt: string,
): { args: string[]; agentName: string | null } {
  const args: string[] = ["ask", "--json", "--no-stream"];

  const model = asString(config.model, "").trim();
  if (model) args.push("-m", model);

  const engine = asString(config.engine, "").trim();
  if (engine) args.push("-e", engine);

  // OpenJarvis distinguishes "flag omitted" (use configured default agent)
  // from "--agent ''" (force direct-to-engine mode), so only pass -a when
  // the operator actually configured this field, empty string included.
  const agentConfigured = typeof config.agent === "string";
  const agentName = agentConfigured ? (config.agent as string).trim() : null;
  if (agentConfigured) args.push("-a", agentName ?? "");

  const tools = asString(config.tools, "").trim();
  if (tools) args.push("--tools", tools);

  if (asBoolean(config.noContext, false)) args.push("--no-context");

  const persona = asString(config.persona, "").trim();
  if (persona) args.push("--persona", persona);

  const temperature = config.temperature;
  if (typeof temperature === "number" && Number.isFinite(temperature)) {
    args.push("-t", String(temperature));
  }

  const maxTokens = config.maxTokens;
  if (typeof maxTokens === "number" && Number.isFinite(maxTokens)) {
    args.push("--max-tokens", String(maxTokens));
  }

  const extraArgs = (() => {
    const fromExtraArgs = asStringArray(config.extraArgs);
    if (fromExtraArgs.length > 0) return fromExtraArgs;
    return asStringArray(config.args);
  })();
  if (extraArgs.length > 0) args.push(...extraArgs);

  // OpenJarvis joins `nargs=-1` argv tokens with a single space, so passing
  // the whole (possibly multi-line) prompt as one argv element round-trips
  // it unchanged.
  args.push(prompt);

  return { args, agentName };
}

export async function execute(ctx: AdapterExecutionContext): Promise<AdapterExecutionResult> {
  const { runId, agent, config, context, onLog, onMeta, onSpawn, authToken } = ctx;

  const promptTemplate = asString(
    config.promptTemplate,
    "You are agent {{agent.id}} ({{agent.name}}). Continue your Paperclip work.",
  );
  const command = asString(config.command, "jarvis");

  const cwd = asString(config.cwd, "") || process.cwd();
  await ensureAbsoluteDirectory(cwd, { createIfMissing: true });

  const envConfig = parseObject(config.env);
  const hasExplicitApiKey =
    typeof envConfig.PAPERCLIP_API_KEY === "string" && envConfig.PAPERCLIP_API_KEY.trim().length > 0;
  const env: Record<string, string> = { ...buildPaperclipEnv(agent) };
  env.PAPERCLIP_RUN_ID = runId;

  const wakeTaskId =
    (typeof context.taskId === "string" && context.taskId.trim().length > 0 && context.taskId.trim()) ||
    (typeof context.issueId === "string" && context.issueId.trim().length > 0 && context.issueId.trim()) ||
    null;
  const wakeReason =
    typeof context.wakeReason === "string" && context.wakeReason.trim().length > 0
      ? context.wakeReason.trim()
      : null;

  if (wakeTaskId) env.PAPERCLIP_TASK_ID = wakeTaskId;
  if (wakeReason) env.PAPERCLIP_WAKE_REASON = wakeReason;

  for (const [key, value] of Object.entries(envConfig)) {
    if (typeof value === "string") env[key] = value;
  }
  if (!hasExplicitApiKey && authToken) {
    env.PAPERCLIP_API_KEY = authToken;
  }

  const runtimeEnv = Object.fromEntries(
    Object.entries(ensurePathInEnv({ ...process.env, ...env })).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
  await ensureCommandResolvable(command, cwd, runtimeEnv);
  const resolvedCommand = await resolveCommandForLogs(command, cwd, runtimeEnv);
  const loggedEnv = buildInvocationEnvForLogs(env, {
    runtimeEnv,
    includeRuntimeKeys: ["HOME"],
    resolvedCommand,
  });

  const timeoutSec = asNumber(config.timeoutSec, 0);
  const graceSec = asNumber(config.graceSec, 20);

  const instructionsFilePath = asString(config.instructionsFilePath, "").trim();
  const resolvedInstructionsFilePath = instructionsFilePath
    ? path.resolve(cwd, instructionsFilePath)
    : "";
  const instructionsFileDir = instructionsFilePath ? `${path.dirname(instructionsFilePath)}/` : "";

  let instructionsPreamble = "";
  let instructionsReadFailed = false;
  if (resolvedInstructionsFilePath) {
    try {
      const instructionsContents = await fs.readFile(resolvedInstructionsFilePath, "utf8");
      instructionsPreamble =
        `${instructionsContents}\n\n` +
        `The above agent instructions were loaded from ${resolvedInstructionsFilePath}. ` +
        `Resolve any relative file references from ${instructionsFileDir}.`;
    } catch (err) {
      instructionsReadFailed = true;
      const reason = err instanceof Error ? err.message : String(err);
      await onLog(
        "stdout",
        `[paperclip] Warning: could not read agent instructions file "${resolvedInstructionsFilePath}": ${reason}\n`,
      );
    }
  }

  const bootstrapPromptTemplate = asString(config.bootstrapPromptTemplate, "");
  const templateData = {
    agentId: agent.id,
    companyId: agent.companyId,
    runId,
    company: { id: agent.companyId },
    agent,
    run: { id: runId, source: "on_demand" },
    context,
  };
  const renderedHeartbeatPrompt = renderTemplate(promptTemplate, templateData);
  const renderedBootstrapPrompt =
    bootstrapPromptTemplate.trim().length > 0
      ? renderTemplate(bootstrapPromptTemplate, templateData).trim()
      : "";
  const sessionHandoffNote = asString(context.paperclipSessionHandoffMarkdown, "").trim();
  const prompt = joinPromptSections([
    instructionsPreamble,
    renderedBootstrapPrompt,
    sessionHandoffNote,
    renderedHeartbeatPrompt,
  ]);
  const promptMetrics = {
    promptChars: prompt.length,
    bootstrapPromptChars: renderedBootstrapPrompt.length,
    sessionHandoffChars: sessionHandoffNote.length,
    heartbeatPromptChars: renderedHeartbeatPrompt.length,
  };

  const commandNotes = resolvedInstructionsFilePath
    ? instructionsReadFailed
      ? [
          `Configured instructionsFilePath ${resolvedInstructionsFilePath}, but file could not be read; continuing without injected instructions.`,
        ]
      : [
          `Loaded agent instructions from ${resolvedInstructionsFilePath}`,
          `Prepended instructions + path directive to the prompt sent to \`jarvis ask\`.`,
        ]
    : [];

  const { args } = buildAskArgs(config, prompt);

  if (onMeta) {
    await onMeta({
      adapterType: "jarvis_local",
      command: resolvedCommand,
      cwd,
      commandNotes,
      commandArgs: args,
      env: loggedEnv,
      prompt,
      promptMetrics,
      context,
    });
  }

  const proc = await runChildProcess(runId, command, args, {
    cwd,
    env: runtimeEnv,
    timeoutSec,
    graceSec,
    onSpawn,
    onLog,
  });

  if (proc.timedOut) {
    return {
      exitCode: proc.exitCode,
      signal: proc.signal,
      timedOut: true,
      errorMessage: `Timed out after ${timeoutSec}s`,
    };
  }

  const parsed = parseJarvisAskOutput(proc.stdout);
  const exitCode = proc.exitCode;
  const succeeded = (exitCode ?? 0) === 0;

  const errorMessage = succeeded
    ? parsed.parseError
      ? `jarvis exited 0 but ${parsed.parseError}`
      : null
    : firstNonEmptyLine(proc.stderr) || `jarvis exited with code ${exitCode ?? -1}`;

  return {
    exitCode,
    signal: proc.signal,
    timedOut: false,
    errorMessage,
    usage:
      parsed.usage.inputTokens !== undefined || parsed.usage.outputTokens !== undefined
        ? {
            inputTokens: parsed.usage.inputTokens ?? 0,
            outputTokens: parsed.usage.outputTokens ?? 0,
          }
        : undefined,
    // OpenJarvis's `ask` command has no per-run session/resume flag: it
    // carries conversational continuity itself via on-disk memory
    // (SOUL.md / MEMORY.md / the knowledge store), so there is no
    // Paperclip-managed session id to report here.
    sessionId: null,
    sessionParams: null,
    model: asString(config.model, "").trim() || null,
    billingType: "unknown",
    resultJson: {
      stdout: proc.stdout,
      stderr: proc.stderr,
    },
    summary: parsed.content ?? (succeeded ? null : errorMessage),
  };
}
