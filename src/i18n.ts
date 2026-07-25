export type Locale = "ja" | "en";

const japanese = {
  "meta.description":
    "普通のPythonで書いたソートアルゴリズムを、一行ずつ見て学べるビジュアライザー",
  "brand.home": "Code Sortings ホーム",
  "locale.label": "表示言語",
  "engine.preparing": "Pythonを準備中",
  "engine.ready": "Python 準備完了",
  "engine.running": "コードを実行中",
  "engine.failed": "Pythonの準備に失敗",
  "settings.label": "実行設定",
  "field.algorithm": "アルゴリズム",
  "field.pattern": "入力パターン",
  "field.length": "要素数",
  "pattern.random": "ランダム",
  "pattern.nearlySorted": "ほぼ整列済み",
  "pattern.reversed": "逆順",
  "pattern.fewUnique": "重複が多い",
  "patternHint.random":
    "平均的な動きを眺めるのに向いた、順序に偏りのない入力です。",
  "patternHint.nearlySorted":
    "すでに近い位置にある値をどう扱うか見えます。挿入ソートの得意な入力です。",
  "patternHint.reversed":
    "多くの単純な手法で交換が増えます。最悪時の動きを探るのに向いています。",
  "patternHint.fewUnique":
    "同じ値をどう扱うか見えます。比較条件と安定性を考えるきっかけになります。",
  "action.run": "実行",
  "editor.label": "Pythonソートコード",
  "source.waiting": "実行待ち",
  "source.before": "実行前",
  "source.line": "{function}() · {line}行目",
  "metrics.label": "実行メトリクス",
  "metrics.comparisons": "比較",
  "metrics.frames": "フレーム",
  "timeline.label": "タイムライン",
  "transport.label": "再生操作",
  "transport.first": "先頭",
  "transport.firstTitle": "先頭へ",
  "transport.back": "戻る",
  "transport.backTitle": "1コマ戻る",
  "transport.play": "再生",
  "transport.playTitle": "再生（Space）",
  "transport.pause": "一時停止",
  "transport.pauseTitle": "一時停止（Space）",
  "transport.stop": "停止",
  "transport.forward": "進む",
  "transport.forwardTitle": "1コマ進む",
  "speed.label": "速さ",
  "speed.slow": "ゆっくり",
  "speed.normal": "ふつう",
  "speed.fast": "はやい",
  "status.enginePreparing": "Pythonエンジンを準備しています…",
  "status.executing": "Pythonコードを実行しています…",
  "status.valuesChanged":
    "実行は完了しましたが、元の配列と値の構成が変わっています",
  "status.notSorted":
    "実行は完了しましたが、配列は昇順になっていません（Python {version}）",
  "status.sampled": " · {steps}操作から間引き",
  "status.complete": "実行完了 · {frames}フレーム{sampling} · Python {version}",
  "error.loadExample": "例コードの読み込みに失敗しました",
  "error.visualizationTitle": "コードを実行できませんでした",
  "error.visualizationDetail":
    "エラーの内容を確認して、コードを修正してください。",
  "lesson.algorithm": "アルゴリズム",
  "lesson.complexity": "計算量",
  "lesson.best": "最良",
  "lesson.average": "平均",
  "lesson.worst": "最悪",
  "lesson.trait": "特徴",
  "lesson.focus": "見るポイント",
  "complexity.gapDependent": "ギャップ列に依存",
  "trait.stableInPlace": "安定・in-place",
  "trait.unstableInPlace": "不安定・in-place",
  "trait.unstableRecursive": "不安定・再帰",
  "trait.stableExtraN": "安定・追加領域 O(n)",
  "trait.nonComparisonExtraK": "非比較・追加領域 O(k)",
  "trait.stableExtraNK": "安定・追加領域 O(n+k)",
  "trait.minimumWrites": "不安定・書き込み最小",
  "operation.mark.kind": "位置を確定",
  "operation.mark.title": "{indices}{suffix} を整列済みにしました",
  "operation.mark.more": "ほか{count}件",
  "operation.swap.kind": "値を交換",
  "operation.swap.title": "array[{left}] と array[{right}] を交換しました",
  "operation.write.kind": "値を書き換え",
  "operation.write.one": "array[{index}] を更新しました",
  "operation.write.many": "{count}か所を更新しました",
  "operation.compare.kind": "値を比較",
  "operation.compare.title":
    "array[{left}] と array[{right}] を「{operator}」で比較",
  "operation.compare.fallback": "比較",
  "operation.read.kind": "値を読む",
  "operation.read.title": "array[{index}] から {value} を読み取りました",
  "operation.advance.kind": "コードを進める",
  "operation.advance.title": "{function}() の {line}行目を実行しました",
  "operation.advance.noChange": "この行では配列の値は変わりません",
  "operation.start.kind": "開始位置",
  "operation.start.title": "実行前の配列です",
  "operation.start.detail":
    "再生するか、タイムラインを動かして変化を追ってみましょう",
  "operation.boot.detail":
    "Pythonの準備ができると、自動で最初のコードを実行します。",
  "chart.label": "ソート配列。比較 {comparisons} 回、{frame} フレーム目",
  "chart.title": "配列: {values}",
  "runner.cancelled": "新しい実行を開始しました",
  "runner.stopped": "実行を停止しました",
  "runner.timeout": "実行が {seconds} 秒を超えたため停止しました",
  "runner.bootTimeout": "Pythonエンジンの起動がタイムアウトしました",
} as const;

export type TranslationKey = keyof typeof japanese;

const english: Record<TranslationKey, string> = {
  "meta.description":
    "A visualizer for learning sorting algorithms written in ordinary Python, one line at a time",
  "brand.home": "Code Sortings home",
  "locale.label": "Display language",
  "engine.preparing": "Preparing Python",
  "engine.ready": "Python ready",
  "engine.running": "Running code",
  "engine.failed": "Python failed to start",
  "settings.label": "Run settings",
  "field.algorithm": "Algorithm",
  "field.pattern": "Input pattern",
  "field.length": "Items",
  "pattern.random": "Random",
  "pattern.nearlySorted": "Nearly sorted",
  "pattern.reversed": "Reversed",
  "pattern.fewUnique": "Few unique",
  "patternHint.random":
    "An unbiased input that is useful for observing typical behavior.",
  "patternHint.nearlySorted":
    "Shows how values already near their destination are handled. Insertion Sort excels here.",
  "patternHint.reversed":
    "Many simple methods perform more swaps here. Use it to explore worst-case behavior.",
  "patternHint.fewUnique":
    "Shows how equal values are handled and invites questions about comparisons and stability.",
  "action.run": "Run",
  "editor.label": "Python sorting code",
  "source.waiting": "Waiting to run",
  "source.before": "Before run",
  "source.line": "{function}() · line {line}",
  "metrics.label": "Run metrics",
  "metrics.comparisons": "Comparisons",
  "metrics.frames": "Frame",
  "timeline.label": "Timeline",
  "transport.label": "Playback controls",
  "transport.first": "First",
  "transport.firstTitle": "Go to first frame",
  "transport.back": "Back",
  "transport.backTitle": "Back one frame",
  "transport.play": "Play",
  "transport.playTitle": "Play (Space)",
  "transport.pause": "Pause",
  "transport.pauseTitle": "Pause (Space)",
  "transport.stop": "Stop",
  "transport.forward": "Next",
  "transport.forwardTitle": "Forward one frame",
  "speed.label": "Speed",
  "speed.slow": "Slow",
  "speed.normal": "Normal",
  "speed.fast": "Fast",
  "status.enginePreparing": "Preparing the Python engine…",
  "status.executing": "Running Python code…",
  "status.valuesChanged":
    "Run complete, but the values in the original array were changed",
  "status.notSorted":
    "Run complete, but the array is not in ascending order (Python {version})",
  "status.sampled": " · sampled from {steps} operations",
  "status.complete": "Complete · {frames} frames{sampling} · Python {version}",
  "error.loadExample": "Could not load the example code",
  "error.visualizationTitle": "The code could not be run",
  "error.visualizationDetail":
    "Review the error, then edit the code and retry.",
  "lesson.algorithm": "Algorithm",
  "lesson.complexity": "Complexity",
  "lesson.best": "Best",
  "lesson.average": "Average",
  "lesson.worst": "Worst",
  "lesson.trait": "Traits",
  "lesson.focus": "What to watch",
  "complexity.gapDependent": "Depends on gaps",
  "trait.stableInPlace": "Stable · in-place",
  "trait.unstableInPlace": "Unstable · in-place",
  "trait.unstableRecursive": "Unstable · recursive",
  "trait.stableExtraN": "Stable · O(n) extra space",
  "trait.nonComparisonExtraK": "Non-comparison · O(k) extra space",
  "trait.stableExtraNK": "Stable · O(n+k) extra space",
  "trait.minimumWrites": "Unstable · minimum writes",
  "operation.mark.kind": "Position settled",
  "operation.mark.title": "Marked {indices}{suffix} as sorted",
  "operation.mark.more": " and {count} more",
  "operation.swap.kind": "Swap values",
  "operation.swap.title": "Swapped array[{left}] and array[{right}]",
  "operation.write.kind": "Write value",
  "operation.write.one": "Updated array[{index}]",
  "operation.write.many": "Updated {count} positions",
  "operation.compare.kind": "Compare values",
  "operation.compare.title":
    "Compared array[{left}] and array[{right}] with “{operator}”",
  "operation.compare.fallback": "compare",
  "operation.read.kind": "Read value",
  "operation.read.title": "Read {value} from array[{index}]",
  "operation.advance.kind": "Advance code",
  "operation.advance.title": "Ran line {line} of {function}()",
  "operation.advance.noChange": "This line does not change any array values",
  "operation.start.kind": "Starting point",
  "operation.start.title": "This is the array before execution",
  "operation.start.detail":
    "Press Play or move the timeline to follow each change.",
  "operation.boot.detail":
    "The first example will run automatically when Python is ready.",
  "chart.label": "Sorting array. {comparisons} comparisons, frame {frame}",
  "chart.title": "Array: {values}",
  "runner.cancelled": "Started a new run",
  "runner.stopped": "Run stopped",
  "runner.timeout": "Stopped after the run exceeded {seconds} seconds",
  "runner.bootTimeout": "The Python engine timed out while starting",
};

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  ja: japanese,
  en: english,
};

let currentLocale: Locale = "ja";

export const getLocale = (): Locale => currentLocale;

export const resolveInitialLocale = (): Locale => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "ja";
  }
  try {
    const savedLocale = window.localStorage.getItem("code-sortings-locale");
    if (savedLocale === "ja" || savedLocale === "en") return savedLocale;
  } catch {
    // The app still works when storage is unavailable.
  }
  return navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en";
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
  value.toLocaleString(currentLocale === "ja" ? "ja-JP" : "en-US");

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
  if (currentLocale === "ja") return message;

  const exactMessages: Record<string, string> = {
    配列には有限の数値だけを代入できます:
      "Only finite numbers can be assigned to the array",
    ソート中に配列の長さを変更することはできません:
      "The array length cannot be changed while sorting",
    "配列の長さは3〜300にしてください":
      "The array length must be between 3 and 300",
    "def sort(array): を定義してください": "Define def sort(array): first",
    Pythonランナーを読み込めませんでした:
      "The Python runner could not be loaded",
    Pythonエンジンの準備が完了していません: "The Python engine is not ready",
  };
  if (exactMessages[message]) return exactMessages[message];

  const traceLimit = message.match(
    /^可視化ステップ数が上限の ([\d,]+) を超えました$/,
  );
  if (traceLimit) {
    return `The visualization exceeded its ${traceLimit[1]}-step limit`;
  }
  return message;
};
