import { existsSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const sitesRoot = resolve(repoRoot, "sites");
const distRoot = resolve(repoRoot, "dist");
const astroBin = resolve(repoRoot, "node_modules", "astro", "astro.js");

if (!existsSync(sitesRoot)) {
  console.error("Build error: expected a ./sites directory but none was found.");
  process.exit(1);
}

const sites = readdirSync(sitesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(resolve(sitesRoot, entry.name, "site.config.ts")))
  .map((entry) => entry.name)
  .sort();

if (sites.length === 0) {
  console.error("Build error: no valid sites found (missing site.config.ts).");
  process.exit(1);
}

if (!existsSync(astroBin)) {
  console.error("Build error: Astro CLI not found. Run npm install first.");
  process.exit(1);
}

rmSync(distRoot, { recursive: true, force: true });

for (const site of sites) {
  console.log(`Building ${site}...`);
  const result = spawnSync(
    process.execPath,
    [
      astroBin,
      "build",
      "--root",
      `sites/${site}`,
      "--outDir",
      `../../dist/${site}`
    ],
    { stdio: "inherit" }
  );

  if (result.error) {
    console.error(`Build error: failed to start astro for ${site} (${result.error.message}).`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Build complete: ${sites.length} sites -> ${distRoot}`);
