import { describe, expect, it } from "vitest";
import { processAdapter } from "./index.js";

describe("process adapter environment checks", () => {
  it("passes validation when command and args are configured", async () => {
    const result = await processAdapter.testEnvironment({
      companyId: "tremor",
      adapterType: "process",
      config: {
        command: process.execPath,
        args: ["--version"],
      },
    });

    expect(result.status).toBe("pass");
    expect(result.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "process_command_present" }),
      expect.objectContaining({ code: "process_cwd_valid" }),
      expect.objectContaining({ code: "process_command_resolvable" }),
    ]));
  });

  it("reports a missing command as a validation error", async () => {
    const result = await processAdapter.testEnvironment({
      companyId: "tremor",
      adapterType: "process",
      config: {
        args: ["--version"],
      },
    });

    expect(result.status).toBe("fail");
    expect(result.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({
        code: "process_command_missing",
        level: "error",
      }),
    ]));
  });
});
