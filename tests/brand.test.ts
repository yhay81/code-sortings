import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

const ROOT = new URL("../", import.meta.url);

describe("brand shell", () => {
  test("uses one sorting mark for the header and favicon", async () => {
    const html = await readFile(new URL("src/index.html", ROOT), "utf8");
    const favicon = await readFile(new URL("public/favicon.svg", ROOT), "utf8");

    expect(html).toContain('class="brand-mark"');
    expect(html).toContain('src="favicon.svg"');
    expect(html).toContain('href="favicon.svg"');
    expect(favicon.match(/<rect/g)).toHaveLength(5);
  });

  test("keeps Python state in the run status only", async () => {
    const html = await readFile(new URL("src/index.html", ROOT), "utf8");
    const script = await readFile(new URL("src/index.ts", ROOT), "utf8");

    expect(html).not.toContain('id="engine-status"');
    expect(html).not.toContain('id="engine-label"');
    expect(script).not.toContain("setEngineStatus");
    expect(html).toContain('id="error-log"');
  });
});
