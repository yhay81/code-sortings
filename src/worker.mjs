export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Cloudflare-CDN-Cache-Control", "no-store");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
