import esbuild from "esbuild";
import { createPluginBundlerPresets } from "@paperclipai/plugin-sdk/bundlers";

const presets = createPluginBundlerPresets({ uiEntry: "src/ui/index.tsx" });
const watch = process.argv.includes("--watch");

const workerCtx = await esbuild.context(presets.esbuild.worker);
const manifestCtx = await esbuild.context(presets.esbuild.manifest);
const uiCtx = await esbuild.context(presets.esbuild.ui);
// The manifest build is unbundled (see @paperclipai/plugin-sdk/bundlers), so its
// relative imports must also be emitted into dist/ as their own files.
const constantsCtx = await esbuild.context({
  entryPoints: ["src/constants.ts"],
  outdir: "dist",
  bundle: false,
  format: "esm",
  platform: "node",
  target: "node20",
  sourcemap: true,
});

if (watch) {
  await Promise.all([workerCtx.watch(), manifestCtx.watch(), uiCtx.watch(), constantsCtx.watch()]);
  console.log("esbuild watch mode enabled for worker, manifest, ui, and constants");
} else {
  await Promise.all([workerCtx.rebuild(), manifestCtx.rebuild(), uiCtx.rebuild(), constantsCtx.rebuild()]);
  await Promise.all([workerCtx.dispose(), manifestCtx.dispose(), uiCtx.dispose(), constantsCtx.dispose()]);
}
