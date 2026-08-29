import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestHarness } from "@paperclipai/plugin-sdk/testing";
import manifest from "../src/manifest.js";
import plugin from "../src/worker.js";

function jsonResponse(body: unknown, init: { status?: number } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json" },
  });
}

describe("instagram connector", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function buildHarness(config: Record<string, unknown> = {}) {
    return createTestHarness({
      manifest,
      config: { igUserId: "17841450721254831", accessTokenRef: "secret-1", ...config },
    });
  }

  it("queues a single-image post via the agent tool and publishes it on the scheduled job", async () => {
    const harness = buildHarness();
    await plugin.definition.setup(harness.ctx);

    const queued = await harness.executeTool("queue-post", {
      images: ["https://example.com/photo.png"],
      caption: "hello world",
    });
    expect(queued.data).toMatchObject({ status: "pending" });

    fetchMock
      .mockResolvedValueOnce(jsonResponse({ id: "container-1" }))
      .mockResolvedValueOnce(jsonResponse({ status_code: "FINISHED" }))
      .mockResolvedValueOnce(jsonResponse({ id: "post-1" }));

    await harness.runJob("publish-queue");

    const status = await harness.getData<{ counts: { published: number; pending: number } } >("status");
    expect(status.counts.published).toBe(1);
    expect(status.counts.pending).toBe(0);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("publishes a carousel by creating one container per image before the carousel container", async () => {
    const harness = buildHarness();
    await plugin.definition.setup(harness.ctx);

    await harness.performAction("queue-post", {
      companyId: "company-test",
      images: ["https://example.com/a.png", "https://example.com/b.png"],
      caption: "carousel",
    });

    fetchMock
      .mockResolvedValueOnce(jsonResponse({ id: "child-1" }))
      .mockResolvedValueOnce(jsonResponse({ id: "child-2" }))
      .mockResolvedValueOnce(jsonResponse({ id: "carousel-1" }))
      .mockResolvedValueOnce(jsonResponse({ status_code: "FINISHED" }))
      .mockResolvedValueOnce(jsonResponse({ id: "post-2" }));

    await harness.runJob("publish-queue");

    const status = await harness.getData<{ counts: { published: number } }>("status");
    expect(status.counts.published).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(harness.activity[0]).toMatchObject({ entityId: "post-2" });
  });

  it("rejects a queue-post call with no images", async () => {
    const harness = buildHarness();
    await plugin.definition.setup(harness.ctx);
    const result = await harness.executeTool("queue-post", { images: [], caption: "x" });
    expect(result.error).toMatch(/at least one/);
  });

  it("marks an item failed and keeps it in the queue when the API call errors", async () => {
    const harness = buildHarness();
    await plugin.definition.setup(harness.ctx);
    await harness.executeTool("queue-post", { images: ["https://example.com/photo.png"], caption: "x" });

    fetchMock.mockResolvedValueOnce(jsonResponse({ error: { message: "Invalid token" } }, { status: 401 }));

    await harness.runJob("publish-queue");

    const status = await harness.getData<{ counts: { failed: number }; queue: Array<{ status: string; error?: string }> }>("status");
    expect(status.counts.failed).toBe(1);
    expect(status.queue[0].error).toMatch(/Invalid token/);
  });

  it("skips the job silently when the plugin is not configured", async () => {
    const harness = createTestHarness({ manifest, config: {} });
    await plugin.definition.setup(harness.ctx);
    await harness.executeTool("queue-post", { images: ["https://example.com/photo.png"], caption: "x" });

    await harness.runJob("publish-queue");

    expect(fetchMock).not.toHaveBeenCalled();
    const status = await harness.getData<{ counts: { pending: number } }>("status");
    expect(status.counts.pending).toBe(1);
  });

  it("reports a failed connection test when the API call fails", async () => {
    const harness = buildHarness();
    await plugin.definition.setup(harness.ctx);
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: { message: "Invalid token" } }, { status: 401 }));
    const result = await harness.performAction<{ ok: boolean; error?: string }>("test-connection");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Invalid token/);
  });

  it("reports a successful connection test with the account username", async () => {
    const harness = buildHarness();
    await plugin.definition.setup(harness.ctx);
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: "17841450721254831", username: "rctech_ia" }));
    const result = await harness.performAction<{ ok: boolean; username?: string }>("test-connection");
    expect(result.ok).toBe(true);
    expect(result.username).toBe("rctech_ia");
  });
});
