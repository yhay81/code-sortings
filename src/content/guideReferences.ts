import type { Locale } from "../i18n";
import type { LocalizedText } from "./guideShared";

const wikipediaUrl = (locale: Locale, title: string): string => {
  const language =
    locale === "zh-CN" ? "zh" : locale === "pt-BR" ? "pt" : locale;
  return `https://${language}.wikipedia.org/wiki/${encodeURIComponent(
    title.replaceAll(" ", "_"),
  )}`;
};

const wikipedia = (
  englishTitle: string,
  translatedTitles: Partial<Record<Exclude<Locale, "en">, string>>,
): LocalizedText => {
  const englishUrl = wikipediaUrl("en", englishTitle);
  const resolve = (locale: Exclude<Locale, "en">): string => {
    const title = translatedTitles[locale];
    return title ? wikipediaUrl(locale, title) : englishUrl;
  };
  return {
    ja: resolve("ja"),
    en: englishUrl,
    "zh-CN": resolve("zh-CN"),
    es: resolve("es"),
    "pt-BR": resolve("pt-BR"),
    ko: resolve("ko"),
    fr: resolve("fr"),
    de: resolve("de"),
  };
};

export const REFERENCE_URLS: Record<string, LocalizedText> = {
  "sort_examples/insertion_sort.py": wikipedia("Insertion sort", {
    ja: "挿入ソート",
    "zh-CN": "插入排序",
    es: "Ordenamiento por inserción",
    "pt-BR": "Insertion sort",
    ko: "삽입 정렬",
    fr: "Tri par insertion",
    de: "Insertionsort",
  }),
  "sort_examples/bubble_sort.py": wikipedia("Bubble sort", {
    ja: "バブルソート",
    "zh-CN": "冒泡排序",
    es: "Ordenamiento de burbuja",
    "pt-BR": "Bubble sort",
    ko: "버블 정렬",
    fr: "Tri à bulles",
    de: "Bubblesort",
  }),
  "sort_examples/selection_sort.py": wikipedia("Selection sort", {
    ja: "選択ソート",
    "zh-CN": "选择排序",
    es: "Ordenamiento por selección",
    "pt-BR": "Selection sort",
    ko: "선택 정렬",
    fr: "Tri par sélection",
    de: "Selectionsort",
  }),
  "sort_examples/cocktail_sort.py": wikipedia("Cocktail shaker sort", {
    ja: "シェーカーソート",
    "zh-CN": "鸡尾酒排序",
    es: "Ordenamiento de burbuja bidireccional",
    "pt-BR": "Cocktail sort",
    ko: "칵테일 정렬",
    fr: "Tri cocktail",
    de: "Shakersort",
  }),
  "sort_examples/gnome_sort.py": wikipedia("Gnome sort", {
    ja: "ノームソート",
    "zh-CN": "侏儒排序",
    es: "Gnome sort",
    "pt-BR": "Gnome sort",
    ko: "난쟁이 정렬",
    de: "Gnomesort",
  }),
  "sort_examples/odd_even_sort.py": wikipedia("Odd–even sort", {
    ja: "奇偶転置ソート",
    "zh-CN": "奇偶排序",
    es: "Ordenamiento impar-par",
    "pt-BR": "Odd-even sort",
    ko: "홀짝 정렬",
    fr: "Tri pair-impair",
  }),
  "sort_examples/shell_sort.py": wikipedia("Shellsort", {
    ja: "シェルソート",
    "zh-CN": "希尔排序",
    es: "Ordenamiento Shell",
    "pt-BR": "Shell sort",
    ko: "셸 정렬",
    fr: "Tri de Shell",
    de: "Shellsort",
  }),
  "sort_examples/comb_sort.py": wikipedia("Comb sort", {
    ja: "コムソート",
    "zh-CN": "梳排序",
    es: "Comb sort",
    "pt-BR": "Comb sort",
    ko: "빗질 정렬",
    fr: "Tri à peigne",
    de: "Combsort",
  }),
  "sort_examples/merge_sort.py": wikipedia("Merge sort", {
    ja: "マージソート",
    "zh-CN": "归并排序",
    es: "Ordenamiento por mezcla",
    "pt-BR": "Merge sort",
    ko: "합병 정렬",
    fr: "Tri fusion",
    de: "Mergesort",
  }),
  "sort_examples/quick_sort.py": wikipedia("Quicksort", {
    ja: "クイックソート",
    "zh-CN": "快速排序",
    es: "Quicksort",
    "pt-BR": "Quicksort",
    ko: "퀵 정렬",
    fr: "Tri rapide",
    de: "Quicksort",
  }),
  "sort_examples/heap_sort.py": wikipedia("Heapsort", {
    ja: "ヒープソート",
    "zh-CN": "堆排序",
    es: "Heapsort",
    "pt-BR": "Heapsort",
    ko: "힙 정렬",
    fr: "Tri par tas",
    de: "Heapsort",
  }),
  "sort_examples/counting_sort.py": wikipedia("Counting sort", {
    "zh-CN": "计数排序",
    es: "Ordenamiento por cuentas",
    "pt-BR": "Counting sort",
    ko: "계수 정렬",
    fr: "Tri comptage",
    de: "Countingsort",
  }),
  "sort_examples/radix_sort.py": wikipedia("Radix sort", {
    ja: "基数ソート",
    "zh-CN": "基数排序",
    es: "Ordenamiento Radix",
    "pt-BR": "Radix sort",
    ko: "기수 정렬",
    fr: "Tri par base",
    de: "Radixsort",
  }),
  "sort_examples/cycle_sort.py": wikipedia("Cycle sort", {}),
};
