import type { AdapterConfigFieldsProps } from "../types";
import {
  Field,
  DraftInput,
  DraftNumberInput,
  DraftSelect,
  help,
} from "../../components/agent-config-primitives";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

export function DashScopeLocalConfigFields({
  isCreate,
  values,
  set,
  config,
  eff,
  mark,
  models,
}: AdapterConfigFieldsProps) {
  const dashscopeModels = [
    { id: "qwen3.5-plus", label: "✨ Qwen 3.5 Plus (推荐)" },
    { id: "qwen3-max", label: "✨ Qwen 3 Max (最强)" },
    { id: "qwen-max", label: "Qwen Max" },
    { id: "qwen-plus", label: "Qwen Plus" },
    { id: "qwen-turbo", label: "Qwen Turbo (快速)" },
    { id: "qwen-long", label: "Qwen Long (长文本)" },
    { id: "qwen-vl-max", label: "Qwen VL Max (多模态)" },
    { id: "qwen-vl-plus", label: "Qwen VL Plus (多模态)" },
    { id: "qwen-coder-plus", label: "Qwen Coder Plus (代码)" },
    { id: "qwen-coder-turbo", label: "Qwen Coder Turbo (代码)" },
    { id: "qwen-math-plus", label: "Qwen Math Plus (数学)" },
    { id: "qwen-math-turbo", label: "Qwen Math Turbo (数学)" },
  ];

  return (
    <>
      <Field
        label="Model"
        hint="Choose the DashScope model to use"
      >
        <DraftSelect
          value={
            isCreate
              ? values!.model ?? "qwen3.5-plus"
              : eff("adapterConfig", "model", String(config.model ?? "qwen3.5-plus"))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ model: v })
              : mark("adapterConfig", "model", v || undefined)
          }
          options={dashscopeModels}
          className={inputClass}
        />
      </Field>

      <Field
        label="Temperature"
        hint={help("Sampling temperature (0.0-2.0)", "Higher values make output more random, lower values more deterministic")}
      >
        <DraftNumberInput
          value={
            isCreate
              ? values!.temperature ?? 0.7
              : eff("adapterConfig", "temperature", Number(config.temperature ?? 0.7))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ temperature: v })
              : mark("adapterConfig", "temperature", v ?? 0.7)
          }
          min={0}
          max={2}
          step={0.1}
          className={inputClass}
        />
      </Field>

      <Field
        label="Top P"
        hint={help("Nucleus sampling threshold (0.0-1.0)", "Lower values focus on high probability tokens")}
      >
        <DraftNumberInput
          value={
            isCreate
              ? values!.topP ?? 0.8
              : eff("adapterConfig", "topP", Number(config.topP ?? 0.8))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ topP: v })
              : mark("adapterConfig", "topP", v ?? 0.8)
          }
          min={0}
          max={1}
          step={0.1}
          className={inputClass}
        />
      </Field>

      <Field
        label="Max Tokens"
        hint="Maximum tokens to generate (0 = unlimited)"
      >
        <DraftNumberInput
          value={
            isCreate
              ? values!.maxTokens ?? 0
              : eff("adapterConfig", "maxTokens", Number(config.maxTokens ?? 0))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ maxTokens: v })
              : mark("adapterConfig", "maxTokens", v ?? 0)
          }
          min={0}
          className={inputClass}
        />
      </Field>

      <Field
        label="Timeout (seconds)"
        hint="Request timeout in seconds"
      >
        <DraftNumberInput
          value={
            isCreate
              ? values!.timeoutSec ?? 120
              : eff("adapterConfig", "timeoutSec", Number(config.timeoutSec ?? 120))
          }
          onCommit={(v) =>
            isCreate
              ? set!({ timeoutSec: v })
              : mark("adapterConfig", "timeoutSec", v ?? 120)
          }
          min={1}
          className={inputClass}
        />
      </Field>

      <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
        <p className="font-medium mb-1">Notes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Requires DASHSCOPE_API_KEY environment variable</li>
          <li>API endpoint: https://coding.dashscope.aliyuncs.com/v1/chat/completions (OpenAI-compatible)</li>
          <li>Uses OpenAI-compatible API format (阿里云百炼专属套餐)</li>
        </ul>
      </div>
    </>
  );
}
