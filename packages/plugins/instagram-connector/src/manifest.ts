import type { PaperclipPluginManifestV1 } from "@paperclipai/plugin-sdk";
import {
  DEFAULT_CONFIG,
  EXPORT_NAMES,
  JOB_KEYS,
  MAX_CAROUSEL_ITEMS,
  PLUGIN_ID,
  PLUGIN_VERSION,
  SLOT_IDS,
  TOOL_NAMES,
} from "./constants.js";

const manifest: PaperclipPluginManifestV1 = {
  id: PLUGIN_ID,
  apiVersion: 1,
  version: PLUGIN_VERSION,
  displayName: "Instagram",
  description:
    "Publishes photos and carousels to an Instagram professional account, either on a schedule or via an agent tool. Uses the Instagram Business Login API (graph.instagram.com).",
  author: "Paperclip",
  categories: ["connector"],
  capabilities: [
    "jobs.schedule",
    "http.outbound",
    "secrets.read-ref",
    "plugin.state.read",
    "plugin.state.write",
    "activity.log.write",
    "agent.tools.register",
    "ui.dashboardWidget.register",
  ],
  entrypoints: {
    worker: "./dist/worker.js",
    ui: "./dist/ui",
  },
  instanceConfigSchema: {
    type: "object",
    properties: {
      igUserId: {
        type: "string",
        title: "Instagram Business Account ID",
        description: "The numeric ID of the connected Instagram professional account (from the Meta developer dashboard).",
      },
      accessTokenRef: {
        type: "string",
        format: "secret-ref",
        title: "Instagram Access Token",
        description: "Reference to a Paperclip secret holding the Instagram Graph API access token. Set from the plugin's Settings page.",
      },
      apiVersion: {
        type: "string",
        title: "Graph API version",
        default: DEFAULT_CONFIG.apiVersion,
      },
      graphHost: {
        type: "string",
        title: "Graph API host",
        default: DEFAULT_CONFIG.graphHost,
      },
    },
  },
  jobs: [
    {
      jobKey: JOB_KEYS.publishQueue,
      displayName: "Publish due Instagram posts",
      description: "Publishes queued Instagram posts/carousels whose scheduled time has arrived. Failed items stay in the queue for manual review; nothing is retried automatically.",
      schedule: "*/15 * * * *",
    },
  ],
  tools: [
    {
      name: TOOL_NAMES.queuePost,
      displayName: "Queue Instagram Post",
      description: `Queue a photo (1 image) or carousel (2-${MAX_CAROUSEL_ITEMS} images) to publish to Instagram. Every image must already be a public https:// URL. Publishes on the next scheduled run (every 15 minutes) unless scheduledAt is in the future.`,
      parametersSchema: {
        type: "object",
        properties: {
          images: {
            type: "array",
            items: { type: "string" },
            description: `1 public https:// image URL for a single post, or 2-${MAX_CAROUSEL_ITEMS} for a carousel.`,
          },
          caption: { type: "string", description: "Post caption." },
          scheduledAt: {
            type: "string",
            description: "ISO 8601 timestamp. Omit to publish as soon as the next job run happens.",
          },
        },
        required: ["images", "caption"],
      },
    },
  ],
  ui: {
    slots: [
      {
        type: "settingsPage",
        id: SLOT_IDS.settingsPage,
        displayName: "Instagram Settings",
        exportName: EXPORT_NAMES.settingsPage,
      },
      {
        type: "dashboardWidget",
        id: SLOT_IDS.dashboardWidget,
        displayName: "Instagram",
        exportName: EXPORT_NAMES.dashboardWidget,
      },
    ],
  },
};

export default manifest;
