import { afterEach, describe, expect, test } from "bun:test";
import { CUSTOM_EXAMPLE_PATH, getExampleGuide } from "../src/guides";
import {
  localizeRunnerError,
  normalizeLocale,
  setLocale,
  SUPPORTED_LOCALES,
  t,
  type Locale,
} from "../src/i18n";

const ALGORITHM_LABELS: Record<Locale, string> = {
  ja: "アルゴリズム",
  en: "Algorithm",
  "zh-CN": "算法",
  es: "Algoritmo",
  "pt-BR": "Algoritmo",
  ko: "알고리즘",
  fr: "Algorithme",
  de: "Algorithmus",
};

const EXAMPLES = [
  "insertion_sort",
  "bubble_sort",
  "selection_sort",
  "cocktail_sort",
  "gnome_sort",
  "odd_even_sort",
  "shell_sort",
  "comb_sort",
  "merge_sort",
  "quick_sort",
  "heap_sort",
  "counting_sort",
  "radix_sort",
  "cycle_sort",
].map((name) => `sort_examples/${name}.py`);

describe("internationalization", () => {
  afterEach(() => setLocale("ja", false));

  test("provides complete interface text in all eight languages", () => {
    expect(SUPPORTED_LOCALES).toHaveLength(8);

    for (const { code } of SUPPORTED_LOCALES) {
      setLocale(code, false);
      expect(t("field.algorithm")).toBe(ALGORITHM_LABELS[code]);
      expect(
        t("status.complete", {
          frames: 120,
          sampling: "",
          version: "3.13",
        }),
      ).not.toMatch(/\{(?:frames|sampling|version)\}/);
      expect(
        localizeRunnerError("配列には有限の数値だけを代入できます"),
      ).not.toBe("");
    }
  });

  test("normalizes common browser locale variants", () => {
    expect(normalizeLocale("ja-JP")).toBe("ja");
    expect(normalizeLocale("en-GB")).toBe("en");
    expect(normalizeLocale("zh-TW")).toBe("zh-CN");
    expect(normalizeLocale("es-MX")).toBe("es");
    expect(normalizeLocale("pt-PT")).toBe("pt-BR");
    expect(normalizeLocale("ko-KR")).toBe("ko");
    expect(normalizeLocale("fr-CA")).toBe("fr");
    expect(normalizeLocale("de-AT")).toBe("de");
    expect(normalizeLocale("it-IT")).toBeNull();
  });

  test("provides every lesson in every supported language", () => {
    for (const path of EXAMPLES) {
      for (const { code } of SUPPORTED_LOCALES) {
        const guide = getExampleGuide(path, code);
        expect(guide.title).not.toBe("");
        expect(guide.summary.length).toBeGreaterThan(10);
        expect(guide.focus.length).toBeGreaterThan(10);
        expect(guide.best).not.toBe("");
        expect(guide.average).not.toBe("");
        expect(guide.worst).not.toBe("");
        expect(guide.trait).not.toBe("");
        expect(guide.referenceUrl).toMatch(
          /^https:\/\/[a-z]+\.wikipedia\.org\/wiki\//,
        );
      }
    }
  });

  test("provides a distinct external reference for every example", () => {
    const references = new Set(
      EXAMPLES.map((path) => getExampleGuide(path, "ja").referenceUrl),
    );

    expect(references.size).toBe(EXAMPLES.length);
    expect(
      getExampleGuide("sort_examples/insertion_sort.py", "ja").referenceUrl,
    ).toStartWith("https://ja.wikipedia.org/wiki/");
    expect(
      getExampleGuide("sort_examples/cycle_sort.py", "ja").referenceUrl,
    ).toStartWith("https://en.wikipedia.org/wiki/");
  });

  test("explains the from-scratch mode in every language", () => {
    for (const { code } of SUPPORTED_LOCALES) {
      const guide = getExampleGuide(CUSTOM_EXAMPLE_PATH, code);
      expect(guide.title).not.toBe("");
      expect(guide.summary.length).toBeGreaterThan(10);
      expect(guide.focus.length).toBeGreaterThan(10);
      expect(guide.referenceUrl).toBeNull();
    }
  });
});
