export const PLUGIN_ID = "paperclip-instagram-connector";
export const PLUGIN_VERSION = "0.1.0";

export const MAX_CAROUSEL_ITEMS = 10;
export const MAX_QUEUE_HISTORY = 200;

export const JOB_KEYS = {
  publishQueue: "publish-queue",
} as const;

export const TOOL_NAMES = {
  queuePost: "queue-post",
} as const;

export const SLOT_IDS = {
  settingsPage: "instagram-settings-page",
  dashboardWidget: "instagram-dashboard-widget",
} as const;

export const EXPORT_NAMES = {
  settingsPage: "InstagramSettingsPage",
  dashboardWidget: "InstagramDashboardWidget",
} as const;

export const DEFAULT_CONFIG = {
  apiVersion: "v23.0",
  graphHost: "graph.instagram.com",
} as const;
