import { createArray } from "./utils/initialArray";
import { Projector } from "./utils/projector";
import { Film } from "./utils/film";
import "./style.css";
import { CodeJar } from "codejar";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);

window.addEventListener("load", () => {
  const projector = new Projector();
  let sort: (array: number[], film: Film) => void = () => {
    throw new Error("sort 関数が未定義です");
  }; // sortは事前に一度行う（撮影）

  const countInput = document.querySelector<HTMLInputElement>("#length")!;
  const speedInputElement = document.querySelector<HTMLInputElement>("#speed")!;
  const errorLogElement = document.querySelector<HTMLDivElement>("#error-log")!;

  const editorElement = document.querySelector<HTMLDivElement>("#editor-code")!;
  const lineNumberElement =
    document.querySelector<HTMLDivElement>("#editor-lines")!;
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
      ? hljs.highlight(code, { language: "javascript" }).value
      : "";
    updateLineNumbers(code);
  };
  const setErrorLog = (message?: string): void => {
    if (!message) {
      errorLogElement.textContent = "エラー: なし";
      errorLogElement.dataset.state = "ok";
      return;
    }
    errorLogElement.textContent = `エラー: ${message}`;
    errorLogElement.dataset.state = "error";
  };
  const compileSort = (
    code: string,
  ): ((array: number[], film: Film) => void) => {
    const factory = new Function(
      `"use strict"; let sort; ${code}; return sort;`,
    );
    const compiled = factory();
    if (typeof compiled !== "function") {
      throw new Error("sort 関数が未定義です");
    }
    return compiled as (array: number[], film: Film) => void;
  };
  const jar = CodeJar(editorElement, highlight, { tab: "  " });
  editorElement.addEventListener("scroll", () => {
    lineNumberElement.scrollTop = editorElement.scrollTop;
  });
  jar.updateCode(`sort = (array, film) => {
  let compares = 0
  for (let i = 0; i < array.length; i++) {
    const temp = array[i]
    let j
    for (j = i; j >= 1; j -= 1) {
      film.rec({ array, i, j, temp, compares })
      compares++
      if (array[j - 1] > temp) {
        array[j] = array[j - 1]
        film.rec({ array, i, j, temp, compares })
      } else {
        break;
      }
    }
    array[j] = temp
    film.rec({ array, i, j, temp, compares })
  }
}
  `);
  updateLineNumbers(jar.toString());

  const reset = (): void => {
    sort = () => {
      throw new Error("sort 関数が未定義です");
    };
    const pattern = document.querySelector<HTMLInputElement>(
      'input[name="array-pattern"]:checked',
    )!.value;
    const parsedCount = Number.parseInt(countInput.value || "20", 10);
    const normalizedCount = Number.isNaN(parsedCount) ? 20 : parsedCount;
    const count = Math.min(300, Math.max(3, normalizedCount));
    countInput.value = count.toString();
    const film = new Film();
    const array = createArray(count, pattern);
    try {
      sort = compileSort(jar.toString());
      sort(array, film);
      setErrorLog();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      window.alert(
        "コードの実行に失敗しました。エラー内容は下のログとコンソールを確認してください。",
      );
      setErrorLog(message);
      console.error(error);
      projector.stopPlay();
      projector.film = null;
      const stepsElement = document.querySelector("#steps");
      if (stepsElement) stepsElement.textContent = "0 / 0";
      document.querySelector("#log svg")?.remove();
      return;
    }
    projector.film = film;
    projector.show();
  };

  const exampleSelect =
    document.querySelector<HTMLSelectElement>("#example-select")!;
  const exampleLoadButton = document.querySelector<HTMLButtonElement>(
    "#example-load-button",
  )!;
  const updateExampleButtonState = (): void => {
    exampleLoadButton.disabled = exampleSelect.value === "";
  };
  const loadExample = async (): Promise<void> => {
    if (!exampleSelect.value) return;
    try {
      const response = await fetch(exampleSelect.value, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("例コードの読み込みに失敗しました");
      }
      const code = await response.text();
      jar.updateCode(code);
      updateLineNumbers(jar.toString());
      editorElement.scrollTop = 0;
      lineNumberElement.scrollTop = 0;
      projector.stopPlay();
      reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorLog(message);
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
    const [SPACE, LEFT, RIGHT] = [" ", "ArrowLeft", "ArrowRight"];
    if (event.key === SPACE || event.key === LEFT || event.key === RIGHT) {
      event.preventDefault();
    }
    switch (event.key) {
      case SPACE:
        if (projector.playing) projector.stopPlay();
        else void projector.autoPlay(speedInputElement);
        break;
      case LEFT:
        projector.back();
        break;
      case RIGHT:
        projector.forward();
        break;
    }
  });

  const startButton = document.querySelector("#start-button")!;
  startButton.addEventListener("click", () => {
    void projector.autoPlay(speedInputElement);
  });

  const stopButton = document.querySelector("#stop-button")!;
  stopButton.addEventListener("click", () => {
    projector.stopPlay();
  });

  const backButton = document.querySelector("#back-button")!;
  backButton.addEventListener("click", () => {
    projector.back();
  });

  const forwardButton = document.querySelector("#forward-button")!;
  forwardButton.addEventListener("click", () => {
    projector.forward();
  });

  const resetButton = document.querySelector("#reset-button")!;
  resetButton.addEventListener("click", () => {
    projector.stopPlay();
    if (projector.film) projector.film.reset();
    projector.show();
  });

  const generateButton = document.querySelector("#generate-button")!;
  generateButton.addEventListener("click", () => {
    projector.stopPlay();
    reset();
  });

  setErrorLog();
  reset();
});
