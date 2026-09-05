import type { UIAdapterModule } from "../types";
import { parseJarvisStdoutLine, buildJarvisLocalConfig } from "@paperclipai/adapter-jarvis-local/ui";
import { JarvisLocalConfigFields } from "./config-fields";

export const jarvisLocalUIAdapter: UIAdapterModule = {
  type: "jarvis_local",
  label: "OpenJarvis (local)",
  parseStdoutLine: parseJarvisStdoutLine,
  ConfigFields: JarvisLocalConfigFields,
  buildAdapterConfig: buildJarvisLocalConfig,
};
