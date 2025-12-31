import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/server.ts"],
  clean: true,
  format: ["cjs"],
  outDir: "dist",
  outExtension: () => ({ js: ".cjs" }),
  ...options,
}));
