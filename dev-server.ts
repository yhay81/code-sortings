import path from "node:path";

const dist = path.resolve(import.meta.dir, "dist");
const port = Number.parseInt(Bun.env.PORT ?? "4000", 10);

const server = Bun.serve({
  port: Number.isFinite(port) ? port : 4000,
  async fetch(request) {
    const url = new URL(request.url);
    const requestedPath =
      url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname);
    const absolutePath = path.resolve(dist, requestedPath.replace(/^\/+/, ""));
    if (
      absolutePath !== dist &&
      !absolutePath.startsWith(`${dist}${path.sep}`)
    ) {
      return new Response("Forbidden", { status: 403 });
    }

    const file = Bun.file(absolutePath);
    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(file);
  },
});

console.log(`running on ${server.url}`);
