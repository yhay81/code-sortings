import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const dist = path.join(root, "dist");

await rm(dist, { force: true, recursive: true });
await mkdir(path.join(dist, "python"), { recursive: true });
await Promise.all([
  cp(path.join(root, "src/index.html"), path.join(dist, "index.html")),
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
]);

const builder = Bun.spawn(
  [
    "bun",
    "build",
    "src/index.ts",
    "--outdir",
    "dist",
    "--watch",
    "--target",
    "browser",
  ],
  {
    cwd: root,
    stderr: "inherit",
    stdout: "inherit",
  },
);
const server = Bun.spawn(["bun", "run", "dev-server.ts"], {
  cwd: root,
  stderr: "inherit",
  stdout: "inherit",
});

let stopping = false;
const stop = (): void => {
  if (stopping) return;
  stopping = true;
  builder.kill();
  server.kill();
};

process.once("SIGINT", stop);
process.once("SIGTERM", stop);

const exitCode = await Promise.race([builder.exited, server.exited]);
stop();
process.exit(exitCode);
