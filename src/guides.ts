import type { Locale } from "./i18n";

interface LocalizedText {
  ja: string;
  en: string;
}

interface ExampleGuideSource {
  title: string;
  summary: LocalizedText;
  focus: LocalizedText;
  best: LocalizedText;
  average: LocalizedText;
  worst: LocalizedText;
  trait: LocalizedText;
}

export interface ExampleGuide {
  title: string;
  summary: string;
  focus: string;
  best: string;
  average: string;
  worst: string;
  trait: string;
}

const same = (value: string): LocalizedText => ({ ja: value, en: value });

const EXAMPLE_GUIDES: Record<string, ExampleGuideSource> = {
  "sort_examples/insertion_sort.py": {
    title: "Insertion Sort",
    summary: {
      ja: "左側の整列済み部分へ、次の値を正しい位置まで差し込みます。",
      en: "Inserts each next value into its correct position in the sorted left side.",
    },
    focus: {
      ja: "「ほぼ整列済み」に変えると、値をずらす回数が少なくなることに注目しましょう。",
      en: "Try “Nearly sorted” and notice how few values need to move.",
    },
    best: same("O(n)"),
    average: same("O(n²)"),
    worst: same("O(n²)"),
    trait: {
      ja: "安定・in-place",
      en: "Stable · in-place",
    },
  },
  "sort_examples/bubble_sort.py": {
    title: "Bubble Sort",
    summary: {
      ja: "隣り合う値を比べ、大きい値を右端へ少しずつ運びます。",
      en: "Compares neighbors and gradually carries larger values to the right.",
    },
    focus: {
      ja: "一周するたび右端が確定色に変わります。「逆順」で交換の多さを比べてみましょう。",
      en: "The right edge settles after each pass. Try “Reversed” to see the swaps multiply.",
    },
    best: same("O(n²)"),
    average: same("O(n²)"),
    worst: same("O(n²)"),
    trait: {
      ja: "安定・in-place",
      en: "Stable · in-place",
    },
  },
  "sort_examples/selection_sort.py": {
    title: "Selection Sort",
    summary: {
      ja: "未整列部分の最小値を探し、先頭の値と入れ替えます。",
      en: "Finds the smallest unsorted value and swaps it into the first open position.",
    },
    focus: {
      ja: "入力の並び方を変えても、最小値を探す比較回数がほぼ変わらない点が特徴です。",
      en: "Change the input pattern and notice that the number of comparisons barely changes.",
    },
    best: same("O(n²)"),
    average: same("O(n²)"),
    worst: same("O(n²)"),
    trait: {
      ja: "不安定・in-place",
      en: "Unstable · in-place",
    },
  },
  "sort_examples/cocktail_sort.py": {
    title: "Cocktail Sort",
    summary: {
      ja: "左右へ交互に走査し、大きい値と小さい値を両端へ運びます。",
      en: "Alternates directions, carrying large and small values toward both ends.",
    },
    focus: {
      ja: "確定色が右端と左端から交互に増える様子を、Bubble Sortと比べましょう。",
      en: "Compare its alternating settled edges with Bubble Sort’s one-way passes.",
    },
    best: same("O(n)"),
    average: same("O(n²)"),
    worst: same("O(n²)"),
    trait: {
      ja: "安定・in-place",
      en: "Stable · in-place",
    },
  },
  "sort_examples/gnome_sort.py": {
    title: "Gnome Sort",
    summary: {
      ja: "順序が正しければ前へ進み、逆なら交換して一歩戻ります。",
      en: "Walks forward when neighbors are ordered, or swaps and steps back when they are not.",
    },
    focus: {
      ja: "値が正しい場所へ戻るまで、同じ要素が左へ歩く様子を追ってみましょう。",
      en: "Follow one value as it walks left until it reaches the correct position.",
    },
    best: same("O(n)"),
    average: same("O(n²)"),
    worst: same("O(n²)"),
    trait: {
      ja: "安定・in-place",
      en: "Stable · in-place",
    },
  },
  "sort_examples/odd_even_sort.py": {
    title: "Odd-Even Sort",
    summary: {
      ja: "奇数位置の組と偶数位置の組を交互に比べ、隣接交換を繰り返します。",
      en: "Alternates odd and even pairs, repeatedly swapping neighboring values.",
    },
    focus: {
      ja: "同時に処理できる比較の組が、奇数側と偶数側で切り替わる点に注目しましょう。",
      en: "Notice how independent comparison pairs alternate between odd and even phases.",
    },
    best: same("O(n)"),
    average: same("O(n²)"),
    worst: same("O(n²)"),
    trait: {
      ja: "安定・in-place",
      en: "Stable · in-place",
    },
  },
  "sort_examples/shell_sort.py": {
    title: "Shell Sort",
    summary: {
      ja: "離れた要素を先に整え、間隔を縮めながら挿入ソートへ近づけます。",
      en: "Orders distant values first, then shrinks the gap toward Insertion Sort.",
    },
    focus: {
      ja: "note「gap」が小さくなるたび、比較する距離がどう変わるか見てみましょう。",
      en: "Follow the “gap” note and watch the comparison distance shrink.",
    },
    best: {
      ja: "ギャップ列に依存",
      en: "Depends on gaps",
    },
    average: {
      ja: "ギャップ列に依存",
      en: "Depends on gaps",
    },
    worst: same("O(n²)"),
    trait: {
      ja: "不安定・in-place",
      en: "Unstable · in-place",
    },
  },
  "sort_examples/comb_sort.py": {
    title: "Comb Sort",
    summary: {
      ja: "大きな間隔の比較で遠くの逆転を直し、間隔を1まで縮めます。",
      en: "Fixes distant inversions with a large gap, then shrinks that gap to one.",
    },
    focus: {
      ja: "note「gap」を追い、離れた小さい値が一度に大きく動く様子を見てみましょう。",
      en: "Follow the “gap” note and watch small values make large jumps.",
    },
    best: {
      ja: "縮小率に依存",
      en: "Depends on shrink factor",
    },
    average: {
      ja: "縮小率に依存",
      en: "Depends on shrink factor",
    },
    worst: same("O(n²)"),
    trait: {
      ja: "不安定・in-place",
      en: "Unstable · in-place",
    },
  },
  "sort_examples/merge_sort.py": {
    title: "Merge Sort",
    summary: {
      ja: "配列を半分ずつに分け、整列済みの小さな列として結合します。",
      en: "Splits the array into halves, then merges small sorted sequences.",
    },
    focus: {
      ja: "書き換えが連続する区間に注目すると、左右の列を一つに戻す過程が見えてきます。",
      en: "Watch each continuous write region as the left and right halves merge.",
    },
    best: same("O(n log n)"),
    average: same("O(n log n)"),
    worst: same("O(n log n)"),
    trait: {
      ja: "安定・追加領域 O(n)",
      en: "Stable · O(n) extra space",
    },
  },
  "sort_examples/quick_sort.py": {
    title: "Quick Sort",
    summary: {
      ja: "基準値 pivot より小さい側と大きい側に分け、同じ処理を再帰します。",
      en: "Partitions values around a pivot, then recursively repeats on both sides.",
    },
    focus: {
      ja: "note「pivot」を追い、基準値の選び方で分割の偏りがどう変わるか観察しましょう。",
      en: "Follow the “pivot” note and observe how its choice affects partition balance.",
    },
    best: same("O(n log n)"),
    average: same("O(n log n)"),
    worst: same("O(n²)"),
    trait: {
      ja: "不安定・再帰",
      en: "Unstable · recursive",
    },
  },
  "sort_examples/heap_sort.py": {
    title: "Heap Sort",
    summary: {
      ja: "最大値を取り出しやすいヒープを作り、末尾へ一つずつ確定します。",
      en: "Builds a heap for fast maximum extraction, settling one value at the end each time.",
    },
    focus: {
      ja: "先頭の最大値が末尾へ移動した後、ヒープがどのように修復されるかを追いましょう。",
      en: "After the maximum moves to the end, follow how the heap repairs itself.",
    },
    best: same("O(n log n)"),
    average: same("O(n log n)"),
    worst: same("O(n log n)"),
    trait: {
      ja: "不安定・in-place",
      en: "Unstable · in-place",
    },
  },
  "sort_examples/counting_sort.py": {
    title: "Counting Sort",
    summary: {
      ja: "値ごとの個数を数え、その個数ぶん小さい順に配列へ書き戻します。",
      en: "Counts each value, then writes values back in order according to those counts.",
    },
    focus: {
      ja: "要素同士を一度も比較せず、書き戻しだけで整列する点に注目しましょう。",
      en: "Notice that it sorts by writing counts back, without comparing array elements.",
    },
    best: same("O(n+k)"),
    average: same("O(n+k)"),
    worst: same("O(n+k)"),
    trait: {
      ja: "非比較・追加領域 O(k)",
      en: "Non-comparison · O(k) extra space",
    },
  },
  "sort_examples/radix_sort.py": {
    title: "Radix Sort",
    summary: {
      ja: "1の位、10の位と桁ごとに安定な並べ替えを繰り返します。",
      en: "Repeatedly performs a stable ordering by ones, tens, and higher digit places.",
    },
    focus: {
      ja: "note「place」が変わるたび、同じ値が桁の違いでどう移動するか見てみましょう。",
      en: "As the “place” note changes, watch values move according to each digit.",
    },
    best: same("O(d(n+k))"),
    average: same("O(d(n+k))"),
    worst: same("O(d(n+k))"),
    trait: {
      ja: "安定・追加領域 O(n+k)",
      en: "Stable · O(n+k) extra space",
    },
  },
  "sort_examples/cycle_sort.py": {
    title: "Cycle Sort",
    summary: {
      ja: "各値の最終位置を数えて直接置き、循環する値を順番に入れ替えます。",
      en: "Counts each value’s final position, places it directly, then follows the resulting cycle.",
    },
    focus: {
      ja: "比較は多くても、配列への書き込み回数が少なく抑えられる点を観察しましょう。",
      en: "Observe how it keeps array writes low even though it performs many comparisons.",
    },
    best: same("O(n²)"),
    average: same("O(n²)"),
    worst: same("O(n²)"),
    trait: {
      ja: "不安定・書き込み最小",
      en: "Unstable · minimum writes",
    },
  },
};

export const getExampleGuide = (path: string, locale: Locale): ExampleGuide => {
  const source =
    EXAMPLE_GUIDES[path] ?? EXAMPLE_GUIDES["sort_examples/insertion_sort.py"];
  return {
    title: source.title,
    summary: source.summary[locale],
    focus: source.focus[locale],
    best: source.best[locale],
    average: source.average[locale],
    worst: source.worst[locale],
    trait: source.trait[locale],
  };
};
