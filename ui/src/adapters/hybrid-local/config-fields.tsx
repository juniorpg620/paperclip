import type { AdapterConfigFieldsProps } from "../types";
import { ClaudeLocalConfigFields } from "../claude-local/config-fields";
import {
  Field,
  ToggleField,
  DraftInput,
  help,
} from "../../components/agent-config-primitives";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

const selectClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40 appearance-none cursor-pointer";

export function HybridLocalConfigFields(props: AdapterConfigFieldsProps) {
  const { isCreate, config, eff, mark, models } = props;

  if (isCreate) {
    return (
      <>
        {/* Reuse all Claude config fields (model, cwd, instructions, workspace, etc.) */}
        <ClaudeLocalConfigFields {...props} />
        <Field
          label="Hybrid extras"
          hint="Local endpoint URL, quota threshold, allow extra credit, and fallback model can be configured after creating the agent."
        >
          <div className="text-xs text-muted-foreground">
            Save the agent first, then edit it to configure hybrid-specific routing fields.
          </div>
        </Field>
      </>
    );
  }

  const currentFallback = eff("adapterConfig", "fallbackModel", String(config.fallbackModel ?? ""));

  return (
    <>
      {/* Reuse all Claude config fields (model, cwd, instructions, workspace, etc.) */}
      <ClaudeLocalConfigFields {...props} />

      <Field
        label="Local endpoint URL"
        hint="OpenAI-compatible API endpoint. Defaults to Ollama on 11434 (LM Studio: 1234, LiteLLM: 4000)"
      >
        <DraftInput
          value={
            eff(
              "adapterConfig",
              "localBaseUrl",
              String(config.localBaseUrl ?? "http://127.0.0.1:11434/v1"),
            )
          }
          onCommit={(v) => mark("adapterConfig", "localBaseUrl", v || undefined)}
          immediate
          className={inputClass}
          placeholder="http://127.0.0.1:11434/v1"
        />
      </Field>

      <Field
        label="Quota threshold %"
        hint="Skip Claude and use local when Claude quota exceeds this %. Default: 80. Set to 0 to disable."
      >
        <input
          type="number"
          min={0}
          max={100}
          className={inputClass}
          value={
            eff("adapterConfig", "quotaThresholdPercent", Number(config.quotaThresholdPercent ?? 80))
          }
          onChange={(e) => {
            const v = Number(e.target.value);
            mark("adapterConfig", "quotaThresholdPercent", v);
          }}
        />
      </Field>

      <Field
        label="Max total tokens"
        hint={help.maxTotalTokens}
      >
        {isCreate ? (
          <input
            type="number"
            min={1}
            className={inputClass}
            value={props.values!.maxTotalTokens}
            onChange={(e) => props.set!({ maxTotalTokens: Number(e.target.value) })}
          />
        ) : (
          <DraftInput
            value={String(
              eff(
                "adapterConfig",
                "maxTotalTokens",
                Number(config.maxTotalTokens ?? 300000),
              ),
            )}
            onCommit={(v) => mark("adapterConfig", "maxTotalTokens", Number(v) || 300000)}
            immediate
            className={inputClass}
            placeholder="300000"
          />
        )}
      </Field>

      <ToggleField
        label="Allow extra credit"
        hint="When off (recommended), Claude is blocked once quota reaches the threshold and Paperclip fails closed if quota status is unavailable."
        checked={
          eff("adapterConfig", "allowExtraCredit", config.allowExtraCredit === true)
        }
        onChange={(v) => mark("adapterConfig", "allowExtraCredit", v)}
      />

      <Field
        label="Fallback model"
        hint="Fallback when primary is unavailable. For local models: qwen2.5-coder best for tools, llama3.1 for long context. Leave as 'None' to disable fallback."
      >
        <select
          className={selectClass}
          value={currentFallback}
          onChange={(e) => {
            const v = e.target.value;
            mark("adapterConfig", "fallbackModel", v || undefined);
          }}
        >
          <option value="">None (no fallback)</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </Field>
    </>
  );
}
