import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const dist = path.resolve(import.meta.dir, "../dist");

interface AssetBudget {
  gzip?: number;
  match: (name: string) => boolean;
  raw?: number;
}

const budgets: Record<string, AssetBudget> = {
  JavaScript: {
    match: (name) => /^index-.+\.js$/.test(name),
    gzip: 55_000,
  },
  CSS: {
    match: (name) => /^index-.+\.css$/.test(name),
    gzip: 6_000,
  },
  HTML: {
    match: (name) => name === "index.html",
    raw: 16_000,
  },
  "Python worker": {
    match: (name) => name === "runner.worker.mjs",
    raw: 5_000,
  },
  "Python tracer": {
    match: (name) => name === "python/runner.py",
    raw: 25_000,
  },
};

const files = async (directory: string, prefix = ""): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      results.push(
        ...(await files(path.join(directory, entry.name), relativePath)),
      );
    } else {
      results.push(relativePath);
    }
  }
  return results;
};

const assetNames = await files(dist);
const failures: string[] = [];

for (const [label, budget] of Object.entries(budgets)) {
  const matches = assetNames.filter(budget.match);
  if (matches.length !== 1) {
    failures.push(`${label}: expected one asset, found ${matches.length}`);
    continue;
  }
  const name = matches[0];
  const contents = await readFile(path.join(dist, name));
  const rawBytes = contents.byteLength;
  const gzipBytes = gzipSync(contents).byteLength;
  console.log(`${label}: ${rawBytes} B raw, ${gzipBytes} B gzip`);
  if (budget.raw && rawBytes > budget.raw) {
    failures.push(`${label}: ${rawBytes} B exceeds ${budget.raw} B raw budget`);
  }
  if (budget.gzip && gzipBytes > budget.gzip) {
    failures.push(
      `${label}: ${gzipBytes} B exceeds ${budget.gzip} B gzip budget`,
    );
  }
}

const totalBytes = (
  await Promise.all(
    assetNames.map(async (name) => (await stat(path.join(dist, name))).size),
  )
).reduce((total, size) => total + size, 0);
console.log(`Distribution: ${totalBytes} B raw`);
if (totalBytes > 400_000) {
  failures.push(`Distribution: ${totalBytes} B exceeds 400000 B budget`);
}

if (failures.length > 0) {
  throw new Error(`Bundle budget failed:\n${failures.join("\n")}`);
}
