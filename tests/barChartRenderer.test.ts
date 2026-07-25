import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { parseHTML } from "linkedom";
import { setLocale } from "../src/i18n";
import { BarChartRenderer } from "../src/utils/barChartRenderer";
import type { TracePicture } from "../src/utils/traceTimeline";

const originalDocument = globalThis.document;
const originalGetComputedStyle = globalThis.getComputedStyle;

const picture = (
  array: number[],
  overrides: Partial<TracePicture> = {},
): TracePicture => ({
  array,
  reads: [],
  writes: [],
  readOperations: [],
  writeOperations: [],
  markOperations: [],
  sorted: [],
  line: 0,
  functionName: "sort",
  compares: 0,
  comparison: false,
  operators: [],
  notes: {},
  ...overrides,
});

describe("BarChartRenderer", () => {
  beforeEach(() => {
    const parsed = parseHTML("<html><body><div id='log'></div></body></html>");
    globalThis.document = parsed.document as unknown as Document;
    globalThis.getComputedStyle = (() =>
      ({
        getPropertyValue: (name: string) =>
          ({
            "--bar-default": "#111111",
            "--bar-focus": "#222222",
            "--bar-compare": "#333333",
            "--bar-temp": "#444444",
            "--bar-sorted": "#555555",
            "--bar-label": "#ffffff",
            "--bar-label-stroke": "#000000",
          })[name] ?? "",
        paddingBottom: "16",
        paddingLeft: "16",
        paddingRight: "16",
        paddingTop: "16",
      }) as unknown as CSSStyleDeclaration) as typeof getComputedStyle;
    setLocale("en", false);
  });

  afterEach(() => {
    globalThis.document = originalDocument;
    globalThis.getComputedStyle = originalGetComputedStyle;
    setLocale("ja", false);
  });

  test("reuses the SVG and bar nodes between frames", () => {
    const root = document.querySelector<HTMLElement>("#log");
    if (!root) throw new Error("test root missing");
    const renderer = new BarChartRenderer(root);

    renderer.render(picture([3, 1, 2]), 1, 0);
    const firstSvg = root.querySelector("svg");
    const firstBar = root.querySelector("rect");

    renderer.render(
      picture([1, 3, 2], {
        writes: [0],
        writeOperations: [{ type: "write", index: 0, before: 3, after: 1 }],
      }),
      2,
      1,
    );

    expect(root.querySelector("svg")).toBe(firstSvg);
    expect(root.querySelector("rect")).toBe(firstBar);
    expect(root.querySelectorAll("svg")).toHaveLength(1);
    expect(root.querySelectorAll("rect")).toHaveLength(3);
    expect(firstBar?.getAttribute("fill")).toBe("#444444");
  });

  test("changes bar count without replacing the chart", () => {
    const root = document.querySelector<HTMLElement>("#log");
    if (!root) throw new Error("test root missing");
    const renderer = new BarChartRenderer(root);

    renderer.render(picture([2, 1]), 1, 0);
    const svg = root.querySelector("svg");
    renderer.render(picture([4, 3, 2, 1]), 2, 0);

    expect(root.querySelector("svg")).toBe(svg);
    expect(root.querySelectorAll("rect")).toHaveLength(4);
    expect(root.querySelectorAll("text")).toHaveLength(4);
  });

  test("removes labels for large arrays and clears empty charts", () => {
    const root = document.querySelector<HTMLElement>("#log");
    if (!root) throw new Error("test root missing");
    const renderer = new BarChartRenderer(root);

    renderer.render(
      picture(Array.from({ length: 30 }, (_, index) => index)),
      1,
      0,
    );
    expect(root.querySelectorAll("text")).toHaveLength(0);

    renderer.render(picture([]), 2, 0);
    expect(root.querySelector("svg")).toBeNull();
  });
});
