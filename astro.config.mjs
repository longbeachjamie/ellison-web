import { defineConfig } from "astro/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: "static",
  vite: {
    resolve: {
      alias: {
        "@shared": resolve(rootDir, "shared")
      }
    }
  }
});
