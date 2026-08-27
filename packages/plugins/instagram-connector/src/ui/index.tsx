import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import {
  useHostContext,
  usePluginAction,
  usePluginData,
  type PluginSettingsPageProps,
  type PluginWidgetProps,
} from "@paperclipai/plugin-sdk/ui";
import { DEFAULT_CONFIG, PLUGIN_ID } from "../constants.js";

type QueueItemStatus = "pending" | "publishing" | "published" | "failed";

interface QueueItem {
  id: string;
  images: string[];
  caption: string;
  scheduledAt: string | null;
  status: QueueItemStatus;
  createdAt: string;
  publishedAt?: string;
  postId?: string;
  error?: string;
}

interface StatusData {
  configured: boolean;
  igUserId: string | null;
  queue: QueueItem[];
  counts: { pending: number; publishing: number; published: number; failed: number };
}

interface ConfigJson {
  igUserId?: string;
  accessTokenRef?: string;
  apiVersion?: string;
  graphHost?: string;
}

const rowStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "8px" };
const inputStyle: CSSProperties = {
  padding: "6px 8px",
  fontSize: "13px",
  border: "1px solid var(--border, #d0d0d0)",
  borderRadius: "6px",
};
const buttonStyle: CSSProperties = {
  padding: "6px 10px",
  fontSize: "12px",
  border: "1px solid var(--border, #d0d0d0)",
  borderRadius: "6px",
  background: "transparent",
  cursor: "pointer",
};
const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "var(--primary, #2563eb)",
  color: "var(--primary-foreground, #fff)",
  border: "none",
};

function hostFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  return fetch(path, {
    credentials: "include",
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  }).then(async (response) => {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed: ${response.status}`);
    }
    return (await response.json()) as T;
  });
}

function useSettingsConfig() {
  const [configJson, setConfigJson] = useState<ConfigJson>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    hostFetchJson<{ configJson?: ConfigJson | null } | null>(`/api/plugins/${PLUGIN_ID}/config`)
      .then((result) => {
        if (cancelled) return;
        setConfigJson(result?.configJson ?? {});
        setError(null);
      })
      .catch((nextError) => {
        if (cancelled) return;
        setError(nextError instanceof Error ? nextError.message : String(nextError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(nextConfig: ConfigJson) {
    setSaving(true);
    try {
      await hostFetchJson(`/api/plugins/${PLUGIN_ID}/config`, {
        method: "POST",
        body: JSON.stringify({ configJson: nextConfig }),
      });
      setConfigJson(nextConfig);
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
      throw nextError;
    } finally {
      setSaving(false);
    }
  }

  return { configJson, setConfigJson, loading, saving, error, save };
}

/** Creates or rotates the company secret backing the Instagram access token, returning the secret id to store as accessTokenRef. */
async function storeAccessToken(companyId: string, existingRef: string | undefined, token: string): Promise<string> {
  if (existingRef) {
    const rotated = await hostFetchJson<{ id: string }>(`/api/secrets/${existingRef}/rotate`, {
      method: "POST",
      body: JSON.stringify({ value: token }),
    });
    return rotated.id;
  }
  const created = await hostFetchJson<{ id: string }>(`/api/companies/${companyId}/secrets`, {
    method: "POST",
    body: JSON.stringify({
      name: "Instagram Access Token",
      value: token,
      description: "Instagram Graph API access token (Instagram Business Login).",
    }),
  });
  return created.id;
}

export function InstagramSettingsPage({ context }: PluginSettingsPageProps) {
  const { configJson, setConfigJson, loading, saving, error, save } = useSettingsConfig();
  const [tokenInput, setTokenInput] = useState("");
  const [savingToken, setSavingToken] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ ok: boolean; username?: string; error?: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const testConnection = usePluginAction("test-connection");

  function setField(key: keyof ConfigJson, value: string) {
    setConfigJson((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaveMessage(null);
    let nextConfig = configJson;
    if (tokenInput.trim().length > 0) {
      if (!context.companyId) {
        setSaveMessage("Open this page from within a company to store the access token.");
        return;
      }
      setSavingToken(true);
      try {
        const accessTokenRef = await storeAccessToken(context.companyId, configJson.accessTokenRef, tokenInput.trim());
        nextConfig = { ...configJson, accessTokenRef };
      } catch (tokenError) {
        setSaveMessage(tokenError instanceof Error ? tokenError.message : String(tokenError));
        setSavingToken(false);
        return;
      }
      setSavingToken(false);
    }
    await save(nextConfig);
    setTokenInput("");
    setSaveMessage("Saved");
    window.setTimeout(() => setSaveMessage(null), 2000);
  }

  async function onTestConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const result = (await testConnection({})) as { ok: boolean; username?: string; error?: string };
      setTestResult(result);
    } catch (testError) {
      setTestResult({ ok: false, error: testError instanceof Error ? testError.message : String(testError) });
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return <div style={{ fontSize: "12px", opacity: 0.7 }}>Loading plugin config…</div>;
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "18px", maxWidth: "560px" }}>
      <div style={{ fontSize: "13px", lineHeight: 1.5 }}>
        Connects a Paperclip agent to an Instagram professional account via the Instagram Business Login API. Get
        the Account ID and Access Token from the "Instagram API" use case in your Meta app dashboard.
      </div>

      <label style={{ display: "grid", gap: "6px" }}>
        <span style={{ fontSize: "12px" }}>Instagram Business Account ID</span>
        <input
          style={inputStyle}
          value={configJson.igUserId ?? ""}
          onChange={(event) => setField("igUserId", event.target.value)}
          placeholder="17841450721254831"
        />
      </label>

      <label style={{ display: "grid", gap: "6px" }}>
        <span style={{ fontSize: "12px" }}>
          Access Token {configJson.accessTokenRef ? "(a token is currently stored)" : "(none stored yet)"}
        </span>
        <input
          style={inputStyle}
          type="password"
          value={tokenInput}
          onChange={(event) => setTokenInput(event.target.value)}
          placeholder={configJson.accessTokenRef ? "Paste a new token to replace it, or leave blank" : "IGAA..."}
        />
        <span style={{ fontSize: "11px", opacity: 0.7 }}>
          Stored as a Paperclip secret, never written to plugin config in plain text.
        </span>
      </label>

      <label style={{ display: "grid", gap: "6px" }}>
        <span style={{ fontSize: "12px" }}>Graph API version</span>
        <input
          style={inputStyle}
          value={configJson.apiVersion ?? DEFAULT_CONFIG.apiVersion}
          onChange={(event) => setField("apiVersion", event.target.value)}
        />
      </label>

      {error ? <div style={{ color: "var(--destructive, #c00)", fontSize: "12px" }}>{error}</div> : null}
      {saveMessage ? <div style={{ fontSize: "12px", opacity: 0.7 }}>{saveMessage}</div> : null}

      <div style={rowStyle}>
        <button type="submit" style={primaryButtonStyle} disabled={saving || savingToken}>
          {saving || savingToken ? "Saving…" : "Save settings"}
        </button>
        <button type="button" style={buttonStyle} onClick={() => void onTestConnection()} disabled={testing || !configJson.accessTokenRef}>
          {testing ? "Testing…" : "Test connection"}
        </button>
      </div>

      {testResult ? (
        <div style={{ fontSize: "12px", color: testResult.ok ? "var(--success, #16a34a)" : "var(--destructive, #c00)" }}>
          {testResult.ok ? `Connected as @${testResult.username ?? "unknown"}` : testResult.error}
        </div>
      ) : null}
    </form>
  );
}

function statusColor(status: QueueItemStatus): string {
  switch (status) {
    case "published":
      return "var(--success, #16a34a)";
    case "failed":
      return "var(--destructive, #c00)";
    case "publishing":
      return "var(--warning, #d97706)";
    default:
      return "inherit";
  }
}

export function InstagramDashboardWidget({ context }: PluginWidgetProps) {
  const { data, loading, error, refresh } = usePluginData<StatusData>("status");
  const publishNow = usePluginAction("publish-now");
  const removeItem = usePluginAction("remove-queue-item");
  const [busy, setBusy] = useState(false);

  async function onPublishNow() {
    setBusy(true);
    try {
      await publishNow({});
      refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(id: string) {
    await removeItem({ id });
    refresh();
  }

  if (loading) return <div style={{ fontSize: "12px", opacity: 0.7 }}>Loading…</div>;
  if (error) return <div style={{ fontSize: "12px", color: "var(--destructive, #c00)" }}>{error.message}</div>;

  const counts = data?.counts ?? { pending: 0, publishing: 0, published: 0, failed: 0 };

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      <div style={rowStyle}>
        <strong>Instagram</strong>
        {!data?.configured ? (
          <span style={{ fontSize: "11px", opacity: 0.7 }}>Not configured — open plugin Settings</span>
        ) : null}
      </div>
      <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
        <span>Pending: {counts.pending}</span>
        <span>Published: {counts.published}</span>
        <span>Failed: {counts.failed}</span>
      </div>
      <div style={rowStyle}>
        <button type="button" style={buttonStyle} onClick={() => void onPublishNow()} disabled={busy || counts.pending === 0}>
          {busy ? "Publishing…" : "Publish due now"}
        </button>
      </div>
      {data && data.queue.length > 0 ? (
        <div style={{ display: "grid", gap: "6px", maxHeight: "220px", overflowY: "auto" }}>
          {data.queue.map((item) => (
            <div key={item.id} style={{ ...rowStyle, justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "260px" }}>
                {item.images.length > 1 ? `Carousel (${item.images.length})` : "Photo"} — {item.caption || "(no caption)"}
              </span>
              <span style={{ color: statusColor(item.status) }}>{item.status}</span>
              {item.status === "pending" || item.status === "failed" ? (
                <button type="button" style={buttonStyle} onClick={() => void onRemove(item.id)}>
                  Remove
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: "12px", opacity: 0.7 }}>No queued posts.</div>
      )}
      {context.companyId ? null : (
        <div style={{ fontSize: "11px", opacity: 0.6 }}>Posts queued by agent tools outside a company context won't log activity.</div>
      )}
    </div>
  );
}
