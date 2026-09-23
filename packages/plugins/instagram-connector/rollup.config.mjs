import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { createPluginBundlerPresets } from "@paperclipai/plugin-sdk/bundlers";

const presets = createPluginBundlerPresets({ uiEntry: "src/ui/index.tsx" });

function withPlugins(config) {
  if (!config) return null;
  return {
    ...config,
    plugins: [
      nodeResolve({
        extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs"],
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
      }),
    ],
  };
}

// The manifest build is unbundled, so its relative imports must also be
// emitted into dist/ as their own files.
const constantsConfig = withPlugins({
  input: "src/constants.ts",
  output: { dir: "dist", format: "es", sourcemap: true },
});

export default [
  withPlugins(presets.rollup.manifest),
  withPlugins(presets.rollup.worker),
  withPlugins(presets.rollup.ui),
  constantsConfig,
].filter(Boolean);
