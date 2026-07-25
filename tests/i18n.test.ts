import { afterEach, describe, expect, test } from "bun:test";
import { getExampleGuide } from "../src/guides";
import { setLocale, t } from "../src/i18n";

describe("internationalization", () => {
  afterEach(() => setLocale("ja", false));

  test("switches interface text between Japanese and English", () => {
    setLocale("ja", false);
    expect(t("field.algorithm")).toBe("アルゴリズム");

    setLocale("en", false);
    expect(t("field.algorithm")).toBe("Algorithm");
    expect(
      t("status.complete", {
        frames: 120,
        sampling: "",
        version: "3.13",
      }),
    ).toBe("Complete · 120 frames · Python 3.13");
  });

  test("provides lessons for newly added algorithms in both languages", () => {
    const japanese = getExampleGuide("sort_examples/radix_sort.py", "ja");
    const english = getExampleGuide("sort_examples/radix_sort.py", "en");

    expect(japanese.title).toBe("Radix Sort");
    expect(japanese.summary).toContain("桁");
    expect(english.summary).toContain("digit");
    expect(english.worst).toBe("O(d(n+k))");
  });
});
