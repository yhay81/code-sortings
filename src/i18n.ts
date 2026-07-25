import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { ja, type TranslationKey } from "./locales/ja";
import { ko } from "./locales/ko";
import { ptBR } from "./locales/pt-BR";
import { zhCN } from "./locales/zh-CN";

export type { TranslationKey } from "./locales/ja";
export const SUPPORTED_LOCALES = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "es", label: "Español" },
  { code: "pt-BR", label: "Português" },
  { code: "ko", label: "한국어" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number]["code"];

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  ja,
  en,
  "zh-CN": zhCN,
  es,
  "pt-BR": ptBR,
  ko,
  fr,
  de,
};

let currentLocale: Locale = "ja";

export const getLocale = (): Locale => currentLocale;

export const normalizeLocale = (
  candidate: string | null | undefined,
): Locale | null => {
  if (!candidate) return null;
  const normalized = candidate.trim().toLowerCase();
  const exact = SUPPORTED_LOCALES.find(
    ({ code }) => code.toLowerCase() === normalized,
  );
  if (exact) return exact.code;
  if (normalized.startsWith("zh")) return "zh-CN";
  if (normalized.startsWith("pt")) return "pt-BR";
  const language = normalized.split("-")[0];
  const match = SUPPORTED_LOCALES.find(({ code }) => code === language);
  return match?.code ?? null;
};

export const isLocale = (candidate: string): candidate is Locale =>
  normalizeLocale(candidate) === candidate;

export const resolveInitialLocale = (): Locale => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "ja";
  }
  try {
    const savedLocale = window.localStorage.getItem("code-sortings-locale");
    const normalizedSavedLocale = normalizeLocale(savedLocale);
    if (normalizedSavedLocale) return normalizedSavedLocale;
  } catch {
    // The app still works when storage is unavailable.
  }
  const browserLocales = navigator.languages.length
    ? navigator.languages
    : [navigator.language];
  for (const browserLocale of browserLocales) {
    const normalizedBrowserLocale = normalizeLocale(browserLocale);
    if (normalizedBrowserLocale) return normalizedBrowserLocale;
  }
  return "en";
};

export const setLocale = (locale: Locale, persist = true): void => {
  currentLocale = locale;
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
  if (!persist || typeof window === "undefined") return;
  try {
    window.localStorage.setItem("code-sortings-locale", locale);
  } catch {
    // The selected locale remains active for the current page.
  }
};

export const t = (
  key: TranslationKey,
  parameters: Record<string, string | number> = {},
): string =>
  dictionaries[currentLocale][key].replace(
    /\{(\w+)\}/g,
    (placeholder, name: string) =>
      Object.hasOwn(parameters, name) ? String(parameters[name]) : placeholder,
  );

export const formatNumber = (value: number): string =>
  value.toLocaleString(currentLocale);

export const translateDocument = (root: ParentNode = document): void => {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n as TranslationKey;
    element.textContent = t(key);
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((element) => {
    const key = element.dataset.i18nTitle as TranslationKey;
    element.title = t(key);
  });
  root
    .querySelectorAll<HTMLElement>("[data-i18n-aria-label]")
    .forEach((element) => {
      const key = element.dataset.i18nAriaLabel as TranslationKey;
      element.setAttribute("aria-label", t(key));
    });
  const description = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );
  if (description) description.content = t("meta.description");
};

export const localizeRunnerError = (message: string): string => {
  const exactMessages: Record<string, TranslationKey> = {
    配列には有限の数値だけを代入できます: "runnerError.finite",
    ソート中に配列の長さを変更することはできません: "runnerError.fixedLength",
    "配列の長さは3〜300にしてください": "runnerError.inputLength",
    "def sort(array): を定義してください": "runnerError.defineSort",
    Pythonランナーを読み込めませんでした: "runnerError.load",
    Pythonエンジンの準備が完了していません: "runnerError.notReady",
  };
  const exactMessageKey = exactMessages[message];
  if (exactMessageKey) return t(exactMessageKey);

  const traceLimit = message.match(
    /^可視化ステップ数が上限の ([\d,]+) を超えました$/,
  );
  if (traceLimit) {
    return t("runnerError.traceLimit", { steps: traceLimit[1] });
  }
  return message;
};
