import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseHTML } from "linkedom";
import { bindAppElements } from "../src/app/elements";
import { setLocale } from "../src/i18n";
import { Projector } from "../src/utils/projector";
import { TraceTimeline, type TraceResult } from "../src/utils/traceTimeline";

const html = readFileSync(
  path.resolve(import.meta.dir, "../src/index.html"),
  "utf8",
);
const originalDocument = globalThis.document;
const originalGetComputedStyle = globalThis.getComputedStyle;

const result: TraceResult = {
  ok: true,
  initial: [2, 1],
  final: [1, 2],
  events: [
    {
      line: 2,
      function: "sort",
      operations: [
        { type: "write", index: 0, before: 2, after: 1 },
        { type: "write", index: 1, before: 1, after: 2 },
      ],
      comparison: false,
      operators: [],
      comparisonCount: 0,
      branch: null,
      notes: {},
    },
  ],
  comparisons: 0,
  rawSteps: 1,
  sampled: false,
  isSorted: true,
  preservesValues: true,
};

describe("Projector", () => {
  beforeEach(() => {
    const parsed = parseHTML(html);
    globalThis.document = parsed.document as unknown as Document;
    globalThis.getComputedStyle = (() =>
      ({
        getPropertyValue: () => "",
        lineHeight: "24",
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

  test("renders frames without querying the document again", () => {
    const elements = bindAppElements();
    const projector = new Projector(elements);
    const timeline = new TraceTimeline(result);
    timeline.forward();
    projector.timeline = timeline;

    const querySelector = document.querySelector.bind(document);
    let queryCount = 0;
    document.querySelector = ((selector: string) => {
      queryCount++;
      return querySelector(selector);
    }) as typeof document.querySelector;

    projector.show();

    expect(queryCount).toBe(0);
    expect(elements.framePosition.textContent).toBe("1 / 1");
    expect(elements.log.querySelectorAll("rect")).toHaveLength(2);
  });
});
