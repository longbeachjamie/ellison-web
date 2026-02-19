import { existsSync, mkdirSync, readdirSync, rmSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const sitesRoot = resolve(repoRoot, "sites");
const distDir = resolve(repoRoot, "dist");
const site = (process.env.SITE || "").trim().toLowerCase();

if (!existsSync(sitesRoot)) {
  console.error("Build error: expected a ./sites directory but none was found.");
  process.exit(1);
}

const availableSites = readdirSync(sitesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(resolve(sitesRoot, entry.name, "site.config.ts")))
  .map((entry) => entry.name)
  .sort();

if (!site) {
  console.error("Build error: SITE is required.");
  console.error(`Set SITE to one of: ${availableSites.join(", ")}`);
  process.exit(1);
}

if (!availableSites.includes(site)) {
  console.error(`Build error: invalid SITE "${site}".`);
  console.error(`Expected one of: ${availableSites.join(", ")}`);
  process.exit(1);
}

const siteRoot = resolve(sitesRoot, site);
const sitePublicDir = resolve(siteRoot, "public");
const headersTemplate = resolve(repoRoot, "shared", "templates", "_headers");
const redirectsTemplate = resolve(repoRoot, "shared", "templates", "_redirects");

mkdirSync(sitePublicDir, { recursive: true });
copyFileSync(headersTemplate, resolve(sitePublicDir, "_headers"));
copyFileSync(redirectsTemplate, resolve(sitePublicDir, "_redirects"));

rmSync(distDir, { recursive: true, force: true });

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const args = [
  "exec",
  "--",
  "astro",
  "build",
  "--root",
  `sites/${site}`,
  "--outDir",
  "../../dist",
  "--config",
  "astro.config.mjs"
];

const result = spawnSync(npmCmd, args, { stdio: "inherit" });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Build complete: ${site} -> ${distDir}`);
