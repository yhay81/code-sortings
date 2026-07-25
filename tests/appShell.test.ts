import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseHTML } from "linkedom";
import { bindAppElements } from "../src/app/elements";
import { renderLesson } from "../src/app/lessonView";
import { setLocale } from "../src/i18n";

const html = readFileSync(
  path.resolve(import.meta.dir, "../src/index.html"),
  "utf8",
);
const originalDocument = globalThis.document;

describe("app shell", () => {
  beforeEach(() => {
    const parsed = parseHTML(html);
    globalThis.document = parsed.document as unknown as Document;
  });

  afterEach(() => {
    globalThis.document = originalDocument;
    setLocale("ja", false);
  });

  test("binds every element required by the app", () => {
    const elements = bindAppElements();

    expect(elements.editor.id).toBe("editor-code");
    expect(elements.log.id).toBe("log");
    expect(elements.generateButton.textContent).toContain("実行");
  });

  test("fails early when the HTML and controller contracts diverge", () => {
    document.querySelector("#timeline-range")?.remove();

    expect(() => bindAppElements()).toThrow("#timeline-range");
  });

  test("renders localized lesson content and references", () => {
    const elements = bindAppElements();
    setLocale("en", false);
    renderLesson(elements, "sort_examples/insertion_sort.py", "en");

    expect(elements.lessonTitle.textContent).toBe("Insertion Sort");
    expect(elements.lessonSummary.textContent).toContain("sorted left side");
    expect(elements.lessonReference.href).toStartWith(
      "https://en.wikipedia.org/wiki/",
    );

    setLocale("ja", false);
    renderLesson(elements, "custom", "ja");
    expect(elements.lessonTitle.textContent).toBe("自分のソート");
    expect(elements.lessonReference.hidden).toBe(true);
  });
});
