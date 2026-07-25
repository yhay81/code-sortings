import type { Locale } from "../i18n";

export type LocalizedText = Record<Locale, string>;

export interface ExampleGuideSource {
  title: string | LocalizedText;
  summary: LocalizedText;
  focus: LocalizedText;
  best: string | LocalizedText;
  average: string | LocalizedText;
  worst: string | LocalizedText;
  trait: LocalizedText;
}

export const CUSTOM_EXAMPLE_PATH = "custom";

export const localized = (
  ja: string,
  en: string,
  zhCN: string,
  es: string,
  ptBR: string,
  ko: string,
  fr: string,
  de: string,
): LocalizedText => ({
  ja,
  en,
  "zh-CN": zhCN,
  es,
  "pt-BR": ptBR,
  ko,
  fr,
  de,
});

export const TRAITS = {
  stableInPlace: localized(
    "安定・in-place",
    "Stable · in-place",
    "稳定 · 原地",
    "Estable · in situ",
    "Estável · in-place",
    "안정 · 제자리",
    "Stable · en place",
    "Stabil · in-place",
  ),
  unstableInPlace: localized(
    "不安定・in-place",
    "Unstable · in-place",
    "不稳定 · 原地",
    "Inestable · in situ",
    "Instável · in-place",
    "불안정 · 제자리",
    "Instable · en place",
    "Instabil · in-place",
  ),
  unstableRecursive: localized(
    "不安定・再帰",
    "Unstable · recursive",
    "不稳定 · 递归",
    "Inestable · recursivo",
    "Instável · recursivo",
    "불안정 · 재귀",
    "Instable · récursif",
    "Instabil · rekursiv",
  ),
  stableExtraN: localized(
    "安定・追加領域 O(n)",
    "Stable · O(n) extra space",
    "稳定 · 额外空间 O(n)",
    "Estable · espacio extra O(n)",
    "Estável · espaço extra O(n)",
    "안정 · 추가 공간 O(n)",
    "Stable · espace supplémentaire O(n)",
    "Stabil · O(n) Zusatzspeicher",
  ),
  nonComparisonExtraK: localized(
    "非比較・追加領域 O(k)",
    "Non-comparison · O(k) extra space",
    "非比较 · 额外空间 O(k)",
    "Sin comparaciones · espacio extra O(k)",
    "Sem comparações · espaço extra O(k)",
    "비교 없음 · 추가 공간 O(k)",
    "Sans comparaison · espace supplémentaire O(k)",
    "Ohne Vergleiche · O(k) Zusatzspeicher",
  ),
  stableExtraNK: localized(
    "安定・追加領域 O(n+k)",
    "Stable · O(n+k) extra space",
    "稳定 · 额外空间 O(n+k)",
    "Estable · espacio extra O(n+k)",
    "Estável · espaço extra O(n+k)",
    "안정 · 추가 공간 O(n+k)",
    "Stable · espace supplémentaire O(n+k)",
    "Stabil · O(n+k) Zusatzspeicher",
  ),
  minimumWrites: localized(
    "不安定・書き込み最小",
    "Unstable · minimum writes",
    "不稳定 · 最少写入",
    "Inestable · escrituras mínimas",
    "Instável · mínimo de escritas",
    "불안정 · 쓰기 최소화",
    "Instable · écritures minimales",
    "Instabil · minimale Schreibvorgänge",
  ),
};

export const GAP_DEPENDENT = localized(
  "ギャップ列に依存",
  "Depends on gaps",
  "取决于间隔序列",
  "Depende de los intervalos",
  "Depende dos intervalos",
  "간격 수열에 따라 다름",
  "Dépend des intervalles",
  "Abhängig von der Lückenfolge",
);

export const SHRINK_DEPENDENT = localized(
  "縮小率に依存",
  "Depends on shrink factor",
  "取决于缩减因子",
  "Depende del factor de reducción",
  "Depende do fator de redução",
  "축소 비율에 따라 다름",
  "Dépend du facteur de réduction",
  "Abhängig vom Verkleinerungsfaktor",
);
