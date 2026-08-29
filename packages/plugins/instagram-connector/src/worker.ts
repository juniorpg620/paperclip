import { randomUUID } from "node:crypto";
import {
  definePlugin,
  runWorker,
  type PaperclipPlugin,
  type PluginContext,
  type PluginHealthDiagnostics,
  type PluginJobContext,
  type ToolResult,
  type ToolRunContext,
} from "@paperclipai/plugin-sdk";
import { DEFAULT_CONFIG, JOB_KEYS, MAX_CAROUSEL_ITEMS, MAX_QUEUE_HISTORY, PLUGIN_ID, TOOL_NAMES } from "./constants.js";

type InstagramConfig = {
  igUserId?: string;
  accessTokenRef?: string;
  apiVersion?: string;
  graphHost?: string;
};

type QueueItemStatus = "pending" | "publishing" | "published" | "failed";

interface QueueItem {
  id: string;
  companyId?: string;
  images: string[];
  caption: string;
  scheduledAt: string | null;
  status: QueueItemStatus;
  createdAt: string;
  publishedAt?: string;
  postId?: string;
  error?: string;
}

let currentContext: PluginContext | null = null;

function resolvedApiConfig(config: InstagramConfig): { apiVersion: string; graphHost: string } {
  return {
    apiVersion: config.apiVersion || DEFAULT_CONFIG.apiVersion,
    graphHost: config.graphHost || DEFAULT_CONFIG.graphHost,
  };
}

async function getConfig(ctx: PluginContext): Promise<InstagramConfig> {
  return (await ctx.config.get()) as InstagramConfig;
}

async function readQueue(ctx: PluginContext): Promise<QueueItem[]> {
  const stored = await ctx.state.get({ scopeKind: "instance", stateKey: "queue" });
  return Array.isArray(stored) ? (stored as QueueItem[]) : [];
}

async function writeQueue(ctx: PluginContext, queue: QueueItem[]): Promise<void> {
  await ctx.state.set({ scopeKind: "instance", stateKey: "queue" }, queue.slice(0, MAX_QUEUE_HISTORY));
}

/** Thin wrapper around ctx.http.fetch for the Instagram Graph API: builds the URL, form-encodes POST bodies, and throws on API-level errors. */
async function graphFetch(
  ctx: PluginContext,
  api: { apiVersion: string; graphHost: string },
  resourcePath: string,
  params: Record<string, string>,
  method: "GET" | "POST" = "GET",
): Promise<Record<string, unknown>> {
  const base = `https://${api.graphHost}/${api.apiVersion}`;
  const search = new URLSearchParams(params).toString();
  const url = method === "GET" ? `${base}${resourcePath}?${search}` : `${base}${resourcePath}`;
  const response = await ctx.http.fetch(url, {
    method,
    ...(method === "POST"
      ? { headers: { "content-type": "application/x-www-form-urlencoded" }, body: search }
      : {}),
  });
  const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok || json.error) {
    const error = json.error as { message?: string } | undefined;
    throw new Error(error?.message ?? `Instagram API request failed (${response.status})`);
  }
  return json;
}

async function createMediaContainer(
  ctx: PluginContext,
  api: { apiVersion: string; graphHost: string },
  token: string,
  igUserId: string,
  imageUrl: string,
  options: { isCarouselItem?: boolean; caption?: string },
): Promise<string> {
  const params: Record<string, string> = { access_token: token, image_url: imageUrl };
  if (options.isCarouselItem) params.is_carousel_item = "true";
  if (options.caption) params.caption = options.caption;
  const result = await graphFetch(ctx, api, `/${igUserId}/media`, params, "POST");
  return result.id as string;
}

async function createCarouselContainer(
  ctx: PluginContext,
  api: { apiVersion: string; graphHost: string },
  token: string,
  igUserId: string,
  childContainerIds: string[],
  caption: string,
): Promise<string> {
  const result = await graphFetch(
    ctx,
    api,
    `/${igUserId}/media`,
    { access_token: token, media_type: "CAROUSEL", children: childContainerIds.join(","), caption },
    "POST",
  );
  return result.id as string;
}

async function waitUntilFinished(
  ctx: PluginContext,
  api: { apiVersion: string; graphHost: string },
  token: string,
  containerId: string,
): Promise<void> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const result = await graphFetch(ctx, api, `/${containerId}`, { fields: "status_code", access_token: token }, "GET");
    if (result.status_code === "FINISHED") return;
    if (result.status_code === "ERROR") throw new Error("Instagram media container failed to process");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  throw new Error("Timed out waiting for Instagram media container to finish processing");
}

async function publishContainer(
  ctx: PluginContext,
  api: { apiVersion: string; graphHost: string },
  token: string,
  igUserId: string,
  containerId: string,
): Promise<string> {
  const result = await graphFetch(
    ctx,
    api,
    `/${igUserId}/media_publish`,
    { access_token: token, creation_id: containerId },
    "POST",
  );
  return result.id as string;
}

async function publishQueueItem(
  ctx: PluginContext,
  api: { apiVersion: string; graphHost: string },
  token: string,
  igUserId: string,
  item: QueueItem,
): Promise<string> {
  if (item.images.length > 1) {
    const childIds: string[] = [];
    for (const imageUrl of item.images) {
      childIds.push(await createMediaContainer(ctx, api, token, igUserId, imageUrl, { isCarouselItem: true }));
    }
    const carouselId = await createCarouselContainer(ctx, api, token, igUserId, childIds, item.caption);
    await waitUntilFinished(ctx, api, token, carouselId);
    return await publishContainer(ctx, api, token, igUserId, carouselId);
  }
  const containerId = await createMediaContainer(ctx, api, token, igUserId, item.images[0], { caption: item.caption });
  await waitUntilFinished(ctx, api, token, containerId);
  return await publishContainer(ctx, api, token, igUserId, containerId);
}

function normalizeImages(input: unknown): string[] {
  const list = Array.isArray(input) ? input : typeof input === "string" ? [input] : [];
  return list.filter((value): value is string => typeof value === "string" && value.startsWith("https://"));
}

async function enqueuePost(
  ctx: PluginContext,
  params: { images?: unknown; caption?: unknown; scheduledAt?: unknown; companyId?: string },
): Promise<QueueItem> {
  const images = normalizeImages(params.images);
  if (images.length === 0) {
    throw new Error("images must contain at least one public https:// image URL");
  }
  if (images.length > MAX_CAROUSEL_ITEMS) {
    throw new Error(`A carousel supports at most ${MAX_CAROUSEL_ITEMS} images`);
  }
  const caption = typeof params.caption === "string" ? params.caption : "";
  const scheduledAt = typeof params.scheduledAt === "string" && params.scheduledAt.length > 0 ? params.scheduledAt : null;

  const item: QueueItem = {
    id: randomUUID(),
    companyId: params.companyId,
    images,
    caption,
    scheduledAt,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const queue = await readQueue(ctx);
  queue.unshift(item);
  await writeQueue(ctx, queue);
  return item;
}

/** Publishes every pending queue item that is due (no scheduledAt, or scheduledAt in the past). */
async function publishDueItems(ctx: PluginContext): Promise<{ published: number; failed: number }> {
  const config = await getConfig(ctx);
  if (!config.igUserId || !config.accessTokenRef) {
    ctx.logger.warn("Instagram connector is not configured (missing igUserId or accessTokenRef); skipping run");
    return { published: 0, failed: 0 };
  }

  const queue = await readQueue(ctx);
  const now = Date.now();
  const due = queue.filter((item) => item.status === "pending" && (!item.scheduledAt || new Date(item.scheduledAt).getTime() <= now));
  if (due.length === 0) return { published: 0, failed: 0 };

  const api = resolvedApiConfig(config);
  const token = await ctx.secrets.resolve(config.accessTokenRef);
  let published = 0;
  let failed = 0;

  for (const item of due) {
    item.status = "publishing";
    await writeQueue(ctx, queue);
    try {
      const postId = await publishQueueItem(ctx, api, token, config.igUserId, item);
      item.status = "published";
      item.postId = postId;
      item.publishedAt = new Date().toISOString();
      published += 1;
      ctx.logger.info("Published Instagram post", { queueItemId: item.id, postId });
      if (item.companyId) {
        await ctx.activity.log({
          companyId: item.companyId,
          entityType: "instagram_post",
          entityId: postId,
          message: `Published to Instagram (${item.images.length > 1 ? "carousel" : "photo"})`,
          metadata: { pluginId: PLUGIN_ID, queueItemId: item.id, postId },
        });
      }
    } catch (error) {
      item.status = "failed";
      item.error = error instanceof Error ? error.message : String(error);
      failed += 1;
      ctx.logger.error("Failed to publish Instagram post", { queueItemId: item.id, error: item.error });
    }
    await writeQueue(ctx, queue);
  }

  return { published, failed };
}

async function testConnection(ctx: PluginContext): Promise<{ ok: boolean; username?: string; name?: string; error?: string }> {
  const config = await getConfig(ctx);
  if (!config.igUserId || !config.accessTokenRef) {
    return { ok: false, error: "Set the Instagram Business Account ID and Access Token first." };
  }
  try {
    const api = resolvedApiConfig(config);
    const token = await ctx.secrets.resolve(config.accessTokenRef);
    const result = await graphFetch(ctx, api, `/${config.igUserId}`, { fields: "id,username,name", access_token: token }, "GET");
    return { ok: true, username: result.username as string | undefined, name: result.name as string | undefined };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

const plugin: PaperclipPlugin = definePlugin({
  async setup(ctx) {
    currentContext = ctx;

    ctx.data.register("status", async () => {
      const config = await getConfig(ctx);
      const queue = await readQueue(ctx);
      return {
        configured: Boolean(config.igUserId && config.accessTokenRef),
        igUserId: config.igUserId ?? null,
        queue: queue.slice(0, 25),
        counts: {
          pending: queue.filter((item) => item.status === "pending").length,
          publishing: queue.filter((item) => item.status === "publishing").length,
          published: queue.filter((item) => item.status === "published").length,
          failed: queue.filter((item) => item.status === "failed").length,
        },
      };
    });

    ctx.actions.register("queue-post", async (params) => {
      const companyId = typeof params.companyId === "string" && params.companyId.length > 0 ? params.companyId : undefined;
      return await enqueuePost(ctx, { ...params, companyId });
    });

    ctx.actions.register("remove-queue-item", async (params) => {
      const id = typeof params.id === "string" ? params.id : "";
      if (!id) throw new Error("id is required");
      const queue = await readQueue(ctx);
      const next = queue.filter((item) => item.id !== id || item.status === "publishing");
      await writeQueue(ctx, next);
      return { ok: true };
    });

    ctx.actions.register("publish-now", async () => {
      return await publishDueItems(ctx);
    });

    ctx.actions.register("test-connection", async () => {
      return await testConnection(ctx);
    });

    ctx.tools.register(
      TOOL_NAMES.queuePost,
      {
        displayName: "Queue Instagram Post",
        description: "Queue a photo or carousel to publish to Instagram.",
        parametersSchema: {
          type: "object",
          properties: {
            images: { type: "array", items: { type: "string" } },
            caption: { type: "string" },
            scheduledAt: { type: "string" },
          },
          required: ["images", "caption"],
        },
      },
      async (params, runCtx: ToolRunContext): Promise<ToolResult> => {
        const payload = params as { images?: unknown; caption?: unknown; scheduledAt?: unknown };
        try {
          const item = await enqueuePost(ctx, { ...payload, companyId: runCtx.companyId });
          return {
            content: `Queued ${item.images.length > 1 ? "carousel" : "post"} ${item.id} (${item.scheduledAt ? `scheduled for ${item.scheduledAt}` : "publishes on the next run"}).`,
            data: item,
          };
        } catch (error) {
          return { error: error instanceof Error ? error.message : String(error) };
        }
      },
    );

    ctx.jobs.register(JOB_KEYS.publishQueue, async (job: PluginJobContext) => {
      const result = await publishDueItems(ctx);
      ctx.logger.info("Instagram publish-queue job finished", { trigger: job.trigger, ...result });
    });
  },

  async onHealth(): Promise<PluginHealthDiagnostics> {
    if (!currentContext) return { status: "error", message: "Plugin not initialized" };
    const config = await getConfig(currentContext);
    return {
      status: config.igUserId && config.accessTokenRef ? "ok" : "degraded",
      message: config.igUserId && config.accessTokenRef ? "Instagram connector ready" : "Instagram connector not configured yet",
    };
  },

  async onValidateConfig(config) {
    const typed = config as InstagramConfig;
    const errors: string[] = [];
    if (!typed.igUserId) errors.push("Instagram Business Account ID is required");
    if (!typed.accessTokenRef) errors.push("Instagram Access Token is required");
    if (errors.length > 0) {
      return { ok: false, errors };
    }
    if (!currentContext) {
      return { ok: true, warnings: ["Could not run a live connection test (plugin not initialized)."] };
    }
    const check = await testConnection(currentContext);
    if (!check.ok) {
      return { ok: false, errors: [check.error ?? "Could not connect to the Instagram API"] };
    }
    return { ok: true, warnings: [`Connected as @${check.username ?? "unknown"}`] };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
