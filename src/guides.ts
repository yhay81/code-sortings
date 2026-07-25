import type { Locale } from "./i18n";
import { EXAMPLE_GUIDES } from "./content/guideCatalog";
import { REFERENCE_URLS } from "./content/guideReferences";
import type { LocalizedText } from "./content/guideShared";

export { CUSTOM_EXAMPLE_PATH } from "./content/guideShared";

export interface ExampleGuide {
  title: string;
  summary: string;
  focus: string;
  best: string;
  average: string;
  worst: string;
  trait: string;
  referenceUrl: string | null;
}

const resolveText = (value: string | LocalizedText, locale: Locale): string =>
  typeof value === "string" ? value : value[locale];

export const getExampleGuide = (path: string, locale: Locale): ExampleGuide => {
  const resolvedPath = EXAMPLE_GUIDES[path]
    ? path
    : "sort_examples/insertion_sort.py";
  const source = EXAMPLE_GUIDES[resolvedPath];
  return {
    title: resolveText(source.title, locale),
    summary: source.summary[locale],
    focus: source.focus[locale],
    best: resolveText(source.best, locale),
    average: resolveText(source.average, locale),
    worst: resolveText(source.worst, locale),
    trait: source.trait[locale],
    referenceUrl: REFERENCE_URLS[resolvedPath]?.[locale] ?? null,
  };
};
