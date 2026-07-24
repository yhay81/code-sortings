import { CodeJar } from "codejar";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import { createArray } from "./utils/initialArray";
import { Projector } from "./utils/projector";
import { PythonRunner } from "./utils/pythonRunner";
import { TraceTimeline } from "./utils/traceTimeline";
import "./style.css";

hljs.registerLanguage("python", python);

window.addEventListener("load", () => {
  const projector = new Projector();
  const runner = new PythonRunner();
  let executionGeneration = 0;
  let busy = true;

  const countInput = document.querySelector<HTMLInputElement>("#length")!;
  const speedInputElement = document.querySelector<HTMLInputElement>("#speed")!;
  const statusElement = document.querySelector<HTMLDivElement>("#error-log")!;
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
  const updateExampleButtonState = (): void => {
    exampleLoadButton.disabled = busy || exampleSelect.value === "";
  };
  const setBusy = (nextBusy: boolean): void => {
    busy = nextBusy;
    generateButton.disabled = busy;
    countInput.disabled = busy;
    updateExampleButtonState();
  };
  const clearVisualization = (): void => {
    projector.stopPlay();
    projector.timeline = null;
    document.querySelector("#log svg")?.remove();
    document.querySelector("#steps")!.textContent = "0 / 0";
    document.querySelector("#indices")!.textContent = "実行待ち";
  };

  editorElement.setAttribute("role", "textbox");
  editorElement.setAttribute("aria-multiline", "true");
  editorElement.setAttribute("aria-label", "Python sorting editor");
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
      if (generation === executionGeneration) setBusy(false);
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
  generateButton.addEventListener("click", () => {
    void executeSort();
  });

  window.addEventListener("beforeunload", () => runner.dispose());

  setStatus("Pythonエンジンを準備しています…", "working");
  void runner
    .warm()
    .then(() => executeSort())
    .catch((error: unknown) => {
      setBusy(false);
      const message = error instanceof Error ? error.message : String(error);
      setStatus(message, "error");
    });
});
