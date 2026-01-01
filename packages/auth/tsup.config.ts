import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
  },
  {
    entry: ["src/server.ts"],
    format: ["esm"],
    dts: true,
  },
  {
    entry: ["src/client.ts"],
    format: ["esm"],
    dts: true,
  },
]);
