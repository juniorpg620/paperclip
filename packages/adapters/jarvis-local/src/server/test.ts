import path from "node:path";
import type {
  AdapterEnvironmentCheck,
  AdapterEnvironmentTestContext,
  AdapterEnvironmentTestResult,
} from "@paperclipai/adapter-utils";
import {
  ensureAbsoluteDirectory,
  ensureCommandResolvable,
  ensurePathInEnv,
  parseObject,
  runChildProcess,
  asString,
} from "@paperclipai/adapter-utils/server-utils";
import { firstNonEmptyLine, parseJarvisAskOutput, parseJarvisDoctorOutput } from "./parse.js";

function summarizeStatus(checks: AdapterEnvironmentCheck[]): AdapterEnvironmentTestResult["status"] {
  if (checks.some((check) => check.level === "error")) return "fail";
  if (checks.some((check) => check.level === "warn")) return "warn";
  return "pass";
}

function commandLooksLike(command: string, expected: string): boolean {
  const base = path.basename(command).toLowerCase();
  return base === expected || base === `${expected}.cmd` || base === `${expected}.exe`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function testEnvironment(
  ctx: AdapterEnvironmentTestContext,
): Promise<AdapterEnvironmentTestResult> {
  const checks: AdapterEnvironmentCheck[] = [];
  const config = parseObject(ctx.config);
  const command = asString(config.command, "jarvis");
  const cwd = asString(config.cwd, "") || process.cwd();

  try {
    await ensureAbsoluteDirectory(cwd, { createIfMissing: true });
    checks.push({
      code: "jarvis_cwd_valid",
      level: "info",
      message: `Working directory is valid: ${cwd}`,
    });
  } catch (err) {
    checks.push({
      code: "jarvis_cwd_invalid",
      level: "error",
      message: err instanceof Error ? err.message : "Invalid working directory",
      detail: cwd,
    });
  }

  const envConfig = parseObject(config.env);
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(envConfig)) {
    if (typeof value === "string") env[key] = value;
  }
  const runtimeEnv = ensurePathInEnv({ ...process.env, ...env });

  try {
    await ensureCommandResolvable(command, cwd, runtimeEnv);
    checks.push({
      code: "jarvis_command_resolvable",
      level: "info",
      message: `Command is executable: ${command}`,
    });
  } catch (err) {
    checks.push({
      code: "jarvis_command_unresolvable",
      level: "error",
      message: err instanceof Error ? err.message : "Command is not executable",
      detail: command,
      hint: "Install OpenJarvis (see https://github.com/open-jarvis/OpenJarvis) and confirm `jarvis` is on PATH.",
    });
  }

  const canRunProbes = checks.every(
    (check) => check.code !== "jarvis_cwd_invalid" && check.code !== "jarvis_command_unresolvable",
  );

  if (canRunProbes && !commandLooksLike(command, "jarvis")) {
    checks.push({
      code: "jarvis_probes_skipped_custom_command",
      level: "info",
      message: "Skipped `jarvis doctor` and hello probes because command is not `jarvis`.",
      detail: command,
    });
  } else if (canRunProbes) {
    const doctorProbe = await runChildProcess(
      `jarvis-envtest-doctor-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      command,
      ["doctor", "--json"],
      {
        cwd,
        env,
        timeoutSec: 20,
        graceSec: 5,
        onLog: async () => {},
      },
    );
    const doctorChecks = parseJarvisDoctorOutput(doctorProbe.stdout);
    if (doctorProbe.timedOut) {
      checks.push({
        code: "jarvis_doctor_timed_out",
        level: "warn",
        message: "`jarvis doctor --json` timed out.",
        hint: "Run `jarvis doctor` manually to inspect the installation.",
      });
    } else if (!doctorChecks) {
      checks.push({
        code: "jarvis_doctor_unparseable",
        level: "warn",
        message: "`jarvis doctor --json` did not return a parseable checklist.",
        detail: firstNonEmptyLine(doctorProbe.stderr) || firstNonEmptyLine(doctorProbe.stdout) || null,
      });
    } else {
      for (const check of doctorChecks) {
        checks.push({
          code: `jarvis_doctor_${slugify(check.name) || "check"}`,
          level: check.status === "fail" ? "error" : check.status === "warn" ? "warn" : "info",
          message: `${check.name}: ${check.message}`,
          detail: check.details ?? null,
        });
      }
    }

    const helloProbeTimeoutSec = 20;
    const model = asString(config.model, "").trim();
    const engine = asString(config.engine, "").trim();
    const helloArgs = ["ask", "--json", "--no-stream", "-a", ""];
    if (model) helloArgs.push("-m", model);
    if (engine) helloArgs.push("-e", engine);
    helloArgs.push("Respond with the single word: hello");

    const helloProbe = await runChildProcess(
      `jarvis-envtest-hello-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      command,
      helloArgs,
      {
        cwd,
        env,
        timeoutSec: helloProbeTimeoutSec,
        graceSec: 5,
        onLog: async () => {},
      },
    );
    const parsed = parseJarvisAskOutput(helloProbe.stdout);
    const detail = firstNonEmptyLine(helloProbe.stderr) || firstNonEmptyLine(helloProbe.stdout) || null;

    if (helloProbe.timedOut) {
      checks.push({
        code: "jarvis_hello_probe_timed_out",
        level: "warn",
        message: "OpenJarvis hello probe timed out.",
        hint: "Retry the probe. If this persists, run `jarvis ask \"Respond with hello\"` manually from this directory.",
      });
    } else if ((helloProbe.exitCode ?? 1) !== 0) {
      checks.push({
        code: "jarvis_hello_probe_failed",
        level: "error",
        message: "OpenJarvis hello probe failed.",
        ...(detail ? { detail } : {}),
        hint: "Run `jarvis doctor` and `jarvis ask \"Respond with hello\"` manually to debug (engine reachable? model configured?).",
      });
    } else {
      const hasHello = /\bhello\b/i.test(parsed.content ?? "");
      checks.push({
        code: hasHello ? "jarvis_hello_probe_passed" : "jarvis_hello_probe_unexpected_output",
        level: hasHello ? "info" : "warn",
        message: hasHello
          ? "OpenJarvis hello probe succeeded."
          : "OpenJarvis probe ran but did not return `hello` as expected.",
        ...(parsed.content ? { detail: parsed.content.replace(/\s+/g, " ").trim().slice(0, 240) } : {}),
      });
    }
  }

  return {
    adapterType: ctx.adapterType,
    status: summarizeStatus(checks),
    checks,
    testedAt: new Date().toISOString(),
  };
}
