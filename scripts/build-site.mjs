import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  copyFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const sitesRoot = resolve(repoRoot, "sites");
const distDir = resolve(repoRoot, "dist");
const astroBin = resolve(repoRoot, "node_modules", "astro", "astro.js");
const site = (process.env.SITE || "").trim().toLowerCase();

if (!existsSync(sitesRoot)) {
  console.error(
    "Build error: expected a ./sites directory but none was found.",
  );
  process.exit(1);
}

const availableSites = readdirSync(sitesRoot, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      existsSync(resolve(sitesRoot, entry.name, "site.config.ts")),
  )
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
const redirectsTemplate = resolve(
  repoRoot,
  "shared",
  "templates",
  "_redirects",
);

mkdirSync(sitePublicDir, { recursive: true });
copyFileSync(headersTemplate, resolve(sitePublicDir, "_headers"));
copyFileSync(redirectsTemplate, resolve(sitePublicDir, "_redirects"));

rmSync(distDir, { recursive: true, force: true });

if (!existsSync(astroBin)) {
  console.error("Build error: Astro CLI not found. Run npm install first.");
  process.exit(1);
}

const args = [
  astroBin,
  "build",
  "--root",
  `sites/${site}`,
  "--outDir",
  "../../dist"
];

const result = spawnSync(process.execPath, args, { stdio: "inherit" });
if (result.error) {
  console.error(`Build error: failed to start astro (${result.error.message}).`);
  process.exit(1);
}
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Build complete: ${site} -> ${distDir}`);
