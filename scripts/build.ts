import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const dist = path.join(root, "dist");

await rm(dist, { force: true, recursive: true });
await mkdir(path.join(dist, "python"), { recursive: true });

const result = await Bun.build({
  entrypoints: [path.join(root, "src/index.ts")],
  minify: true,
  naming: {
    asset: "[name]-[hash].[ext]",
    chunk: "[name]-[hash].[ext]",
    entry: "[name]-[hash].[ext]",
  },
  outdir: dist,
  target: "browser",
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

const outputNames = await readdir(dist);
const scriptName = outputNames.find(
  (name) => name.startsWith("index-") && name.endsWith(".js"),
);
const styleName = outputNames.find(
  (name) => name.startsWith("index-") && name.endsWith(".css"),
);

if (!scriptName || !styleName) {
  throw new Error("Bundled JavaScript or CSS output was not found");
}

const sourceHtml = await readFile(path.join(root, "src/index.html"), "utf8");
const builtHtml = sourceHtml
  .replace('src="index.js"', `src="${scriptName}"`)
  .replace('href="index.css"', `href="${styleName}"`);

await Promise.all([
  writeFile(path.join(dist, "index.html"), builtHtml),
  cp(
    path.join(root, "src/runner.worker.mjs"),
    path.join(dist, "runner.worker.mjs"),
  ),
  cp(
    path.join(root, "src/python/runner.py"),
    path.join(dist, "python/runner.py"),
  ),
  cp(path.join(root, "sort_examples"), path.join(dist, "sort_examples"), {
    recursive: true,
  }),
  cp(path.join(root, "public/favicon.svg"), path.join(dist, "favicon.svg")),
  cp(path.join(root, "public/favicon.ico"), path.join(dist, "favicon.ico")),
  cp(path.join(root, "public/_headers"), path.join(dist, "_headers")),
]);
