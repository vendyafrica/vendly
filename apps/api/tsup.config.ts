import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/server.ts"],
  clean: true,
  format: ["esm"],
  outDir: "dist",
  outExtension: () => ({ js: ".mjs" }),
  external: ["better-auth/node"],
  ...options,
}));
