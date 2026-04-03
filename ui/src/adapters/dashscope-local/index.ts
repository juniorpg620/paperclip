import type { UIAdapterModule } from "../types";
import { DashScopeLocalConfigFields } from "./config-fields";

export const dashscopeLocalUIAdapter: UIAdapterModule = {
  type: "dashscope_local",
  label: "阿里云百炼 (DashScope)",
  parseStdoutLine: (line: string, ts: string) => {
    return [{ type: "stdout", ts, text: line }];
  },
  ConfigFields: DashScopeLocalConfigFields,
  buildAdapterConfig: (values) => {
    return {
      model: values.model || "qwen3.5-plus",
      temperature: values.temperature ?? 0.7,
      topP: values.topP ?? 0.8,
      maxTokens: values.maxTokens ?? 0,
      timeoutSec: values.timeoutSec ?? 120,
      env: values.env || {},
    };
  },
};
