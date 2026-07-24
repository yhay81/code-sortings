import { CodeJar } from "codejar";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import { createArray } from "./utils/initialArray";
import { Projector } from "./utils/projector";
import { PythonRunner } from "./utils/pythonRunner";
import { TraceTimeline } from "./utils/traceTimeline";
import "./style.css";

hljs.registerLanguage("python", python);

interface ExampleGuide {
  title: string;
  summary: string;
  focus: string;
  best: string;
  average: string;
  worst: string;
  trait: string;
}

const EXAMPLE_GUIDES: Record<string, ExampleGuide> = {
  "sort_examples/insertion_sort.py": {
    title: "Insertion Sort",
    summary: "左側の整列済み部分へ、次の値を正しい位置まで差し込みます。",
    focus:
      "「ほぼ整列済み」に変えると、値をずらす回数が少なくなることに注目しましょう。",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    trait: "安定・in-place",
  },
  "sort_examples/shell_sort.py": {
    title: "Shell Sort",
    summary: "離れた要素を先に整え、間隔を縮めながら挿入ソートへ近づけます。",
    focus:
      "グラフ上の note「gap」が小さくなるたび、比較する距離がどう変わるか見てみましょう。",
    best: "ギャップ列に依存",
    average: "ギャップ列に依存",
    worst: "O(n²)",
    trait: "不安定・in-place",
  },
  "sort_examples/bubble_sort.py": {
    title: "Bubble Sort",
    summary: "隣り合う値を比べ、大きい値を右端へ少しずつ運びます。",
    focus:
      "一周するたび右端が確定色に変わります。「逆順」で交換の多さを比べてみましょう。",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    trait: "安定・in-place",
  },
  "sort_examples/selection_sort.py": {
    title: "Selection Sort",
    summary: "未整列部分の最小値を探し、先頭の値と入れ替えます。",
    focus:
      "入力の並び方を変えても、最小値を探す比較回数がほぼ変わらない点が特徴です。",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    trait: "不安定・in-place",
  },
  "sort_examples/quick_sort.py": {
    title: "Quick Sort",
    summary:
      "基準値 pivot より小さい側と大きい側に分け、同じ処理を再帰します。",
    focus:
      "note「pivot」を追い、基準値の選び方で分割の偏りがどう変わるか観察しましょう。",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    trait: "不安定・再帰",
  },
  "sort_examples/merge_sort.py": {
    title: "Merge Sort",
    summary: "配列を半分ずつに分け、整列済みの小さな列として結合します。",
    focus:
      "書き換えが連続する区間に注目すると、左右の列を一つに戻す過程が見えてきます。",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    trait: "安定・追加領域 O(n)",
  },
  "sort_examples/heap_sort.py": {
    title: "Heap Sort",
    summary: "最大値を取り出しやすいヒープを作り、末尾へ一つずつ確定します。",
    focus:
      "先頭の最大値が末尾へ移動した後、ヒープがどのように修復されるかを追いましょう。",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    trait: "不安定・in-place",
  },
  "sort_examples/cocktail_sort.py": {
    title: "Cocktail Sort",
    summary: "左右へ交互に走査し、大きい値と小さい値を両端へ運びます。",
    focus:
      "確定色が右端と左端から交互に増える様子を、通常のBubble Sortと比べましょう。",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    trait: "安定・in-place",
  },
};

const PATTERN_HINTS: Record<string, string> = {
  random: "平均的な動きを眺めるのに向いた、順序に偏りのない入力です。",
  "nearly-sorted":
    "すでに近い位置にある値をどう扱うか見えます。挿入ソートの得意な入力です。",
  reversed:
    "多くの単純な手法で交換が増えます。最悪時の動きを探るのに向いています。",
  "few-unique":
    "同じ値をどう扱うか見えます。比較条件と安定性を考えるきっかけになります。",
};

window.addEventListener("load", () => {
  const projector = new Projector();
  const runner = new PythonRunner();
  let executionGeneration = 0;
  let busy = true;

  const countInput = document.querySelector<HTMLInputElement>("#length")!;
  const speedInputElement = document.querySelector<HTMLInputElement>("#speed")!;
  const statusElement = document.querySelector<HTMLDivElement>("#error-log")!;
  const engineStatusElement =
    document.querySelector<HTMLDivElement>("#engine-status")!;
  const engineLabelElement =
    document.querySelector<HTMLSpanElement>("#engine-label")!;
  const patternHintElement =
    document.querySelector<HTMLParagraphElement>("#pattern-hint")!;
  const timelineRange =
    document.querySelector<HTMLInputElement>("#timeline-range")!;
  const editorElement = document.querySelector<HTMLDivElement>("#editor-code")!;
  const lineNumberElement =
    document.querySelector<HTMLDivElement>("#editor-lines")!;
  const generateButton =
    document.querySelector<HTMLButtonElement>("#generate-button")!;
  const exampleSelect =
    document.querySelector<HTMLSelectElement>("#example-select")!;
  const exampleLoadButton = document.querySelector<HTMLButtonElement>(
    "#example-load-button",
  )!;

  const updateLineNumbers = (code: string): void => {
    const lines = code.split("\n").length;
    lineNumberElement.textContent = new Array(lines)
      .fill(null)
      .map((_, index) => (index + 1).toString())
      .join("\n");
  };
  const highlight = (editor: HTMLElement): void => {
    const code = editor.textContent ?? "";
    editor.innerHTML = code.length
      ? hljs.highlight(code, { language: "python" }).value
      : "";
    updateLineNumbers(code);
  };
  const setStatus = (
    message: string,
    state: "ok" | "error" | "working" = "ok",
  ): void => {
    statusElement.textContent = message;
    statusElement.dataset.state = state;
  };
  const setEngineStatus = (
    message: string,
    state: "ok" | "error" | "working" = "ok",
  ): void => {
    engineLabelElement.textContent = message;
    engineStatusElement.dataset.state = state;
  };
  const updateLesson = (path: string): void => {
    const guide =
      EXAMPLE_GUIDES[path] ?? EXAMPLE_GUIDES["sort_examples/insertion_sort.py"];
    document.querySelector("#lesson-title")!.textContent = guide.title;
    document.querySelector("#lesson-summary")!.textContent = guide.summary;
    document.querySelector("#lesson-focus")!.textContent = guide.focus;
    document.querySelector("#complexity-best")!.textContent = guide.best;
    document.querySelector("#complexity-average")!.textContent = guide.average;
    document.querySelector("#complexity-worst")!.textContent = guide.worst;
    document.querySelector("#lesson-trait")!.textContent = guide.trait;
  };
  const updatePatternHint = (): void => {
    const selectedPattern = document.querySelector<HTMLInputElement>(
      'input[name="array-pattern"]:checked',
    )!.value;
    patternHintElement.textContent =
      PATTERN_HINTS[selectedPattern] ?? PATTERN_HINTS.random;
  };
  const updateExampleButtonState = (): void => {
    exampleLoadButton.disabled = busy;
  };
  const setBusy = (nextBusy: boolean): void => {
    busy = nextBusy;
    generateButton.disabled = busy;
    countInput.disabled = busy;
    exampleSelect.disabled = busy;
    document
      .querySelectorAll<HTMLInputElement>('input[name="array-pattern"]')
      .forEach((input) => {
        input.disabled = busy;
      });
    updateExampleButtonState();
  };
  const clearVisualization = (): void => {
    projector.stopPlay();
    projector.timeline = null;
    document.querySelector("#log svg")?.remove();
    document.querySelector("#steps")!.textContent = "0";
    document.querySelector("#frame-position")!.textContent = "0 / 0";
    document.querySelector("#indices")!.textContent = "実行待ち";
    document.querySelector("#timeline-position")!.textContent =
      "フレーム 0 / 0";
    timelineRange.max = "0";
    timelineRange.value = "0";
    timelineRange.disabled = true;
    document.querySelector("#operation-kind")!.textContent = "実行待ち";
    document.querySelector("#operation-explanation")!.textContent =
      "コードを実行できませんでした";
    document.querySelector("#operation-detail")!.textContent =
      "エラーの内容を確認して、コードを修正してください。";
    projector.show();
  };

  editorElement.setAttribute("role", "textbox");
  editorElement.setAttribute("aria-multiline", "true");
  editorElement.setAttribute("aria-label", "Pythonソートコード");
  editorElement.setAttribute("spellcheck", "false");
  const jar = CodeJar(editorElement, highlight, { tab: "    " });
  editorElement.addEventListener("scroll", () => {
    lineNumberElement.scrollTop = editorElement.scrollTop;
  });
  jar.updateCode(`def sort(array):
    for i in range(1, len(array)):
        temp = array[i]
        j = i
        while j >= 1 and array[j - 1] > temp:
            array[j] = array[j - 1]
            j -= 1
        array[j] = temp
`);
  updateLineNumbers(jar.toString());

  const executeSort = async (): Promise<void> => {
    const generation = ++executionGeneration;
    projector.stopPlay();
    setBusy(true);
    setStatus("Pythonコードを実行しています…", "working");
    setEngineStatus("コードを実行中", "working");

    const pattern = document.querySelector<HTMLInputElement>(
      'input[name="array-pattern"]:checked',
    )!.value;
    const parsedCount = Number.parseInt(countInput.value || "20", 10);
    const normalizedCount = Number.isNaN(parsedCount) ? 20 : parsedCount;
    const count = Math.min(300, Math.max(3, normalizedCount));
    countInput.value = count.toString();
    const array = createArray(count, pattern);

    try {
      const result = await runner.run(jar.toString(), array);
      if (generation !== executionGeneration) return;
      if (!result.ok) {
        clearVisualization();
        setStatus(`${result.errorType}: ${result.message}`, "error");
        if (result.traceback) console.error(result.traceback);
        return;
      }

      projector.timeline = new TraceTimeline(result);
      if (result.events.length > 0) projector.timeline.forward();
      projector.show();
      if (!result.preservesValues) {
        setStatus(
          "実行は完了しましたが、元の配列と値の構成が変わっています",
          "error",
        );
      } else if (!result.isSorted) {
        setStatus(
          `実行は完了しましたが、配列は昇順になっていません（Python ${runner.pythonVersion}）`,
          "error",
        );
      } else {
        const samplingLabel = result.sampled
          ? ` · ${result.rawSteps.toLocaleString()}操作から間引き`
          : "";
        setStatus(
          `実行完了 · ${result.events.length.toLocaleString()}フレーム${samplingLabel} · Python ${runner.pythonVersion}`,
        );
      }
    } catch (error) {
      if (generation !== executionGeneration) return;
      clearVisualization();
      const message = error instanceof Error ? error.message : String(error);
      setStatus(message, "error");
    } finally {
      if (generation === executionGeneration) {
        setBusy(false);
        setEngineStatus(
          runner.pythonVersion
            ? `Python ${runner.pythonVersion} 準備完了`
            : "Python 準備完了",
        );
      }
    }
  };

  const loadExample = async (): Promise<void> => {
    if (!exampleSelect.value) return;
    try {
      const response = await fetch(exampleSelect.value, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("例コードの読み込みに失敗しました");
      }
      jar.updateCode(await response.text());
      updateLineNumbers(jar.toString());
      editorElement.scrollTop = 0;
      lineNumberElement.scrollTop = 0;
      updateLesson(exampleSelect.value);
      await executeSort();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus(message, "error");
      console.error(error);
    }
  };

  exampleSelect.addEventListener("change", updateExampleButtonState);
  exampleLoadButton.addEventListener("click", () => {
    void loadExample();
  });
  updateExampleButtonState();
  updateLesson(exampleSelect.value);
  document
    .querySelectorAll<HTMLInputElement>('input[name="array-pattern"]')
    .forEach((input) => {
      input.addEventListener("change", updatePatternHint);
    });
  updatePatternHint();

  window.addEventListener("keydown", (event): void => {
    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }
    const [space, left, right] = [" ", "ArrowLeft", "ArrowRight"];
    if (event.key === space || event.key === left || event.key === right) {
      event.preventDefault();
    }
    switch (event.key) {
      case space:
        if (projector.playing) projector.stopPlay();
        else void projector.autoPlay(speedInputElement);
        break;
      case left:
        projector.back();
        break;
      case right:
        projector.forward();
        break;
    }
  });

  document.querySelector("#start-button")!.addEventListener("click", () => {
    void projector.autoPlay(speedInputElement);
  });
  document.querySelector("#stop-button")!.addEventListener("click", () => {
    projector.stopPlay();
  });
  document.querySelector("#back-button")!.addEventListener("click", () => {
    projector.back();
  });
  document.querySelector("#forward-button")!.addEventListener("click", () => {
    projector.forward();
  });
  document.querySelector("#reset-button")!.addEventListener("click", () => {
    projector.stopPlay();
    projector.timeline?.reset();
    projector.show();
  });
  timelineRange.addEventListener("input", () => {
    projector.seek(Number.parseInt(timelineRange.value, 10));
  });
  generateButton.addEventListener("click", () => {
    void executeSort();
  });

  window.addEventListener("beforeunload", () => runner.dispose());
  const resizeObserver = new ResizeObserver(() => projector.show());
  resizeObserver.observe(document.querySelector("#log")!);

  setStatus("Pythonエンジンを準備しています…", "working");
  setEngineStatus("Pythonを準備中", "working");
  void runner
    .warm()
    .then(() => {
      setEngineStatus(`Python ${runner.pythonVersion} 準備完了`);
      return executeSort();
    })
    .catch((error: unknown) => {
      setBusy(false);
      const message = error instanceof Error ? error.message : String(error);
      setStatus(message, "error");
      setEngineStatus("Pythonの準備に失敗", "error");
    });
});
