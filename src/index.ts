import { CodeJar } from "codejar";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import { CUSTOM_EXAMPLE_PATH, getExampleGuide } from "./guides";
import {
  formatNumber,
  getLocale,
  isLocale,
  localizeRunnerError,
  resolveInitialLocale,
  setLocale,
  t,
  translateDocument,
  type TranslationKey,
} from "./i18n";
import { createArray } from "./utils/initialArray";
import { Projector } from "./utils/projector";
import { PythonRunner } from "./utils/pythonRunner";
import { TraceTimeline } from "./utils/traceTimeline";
import "./style.css";

hljs.registerLanguage("python", python);

const PATTERN_HINT_KEYS: Record<string, TranslationKey> = {
  random: "patternHint.random",
  "nearly-sorted": "patternHint.nearlySorted",
  reversed: "patternHint.reversed",
  "few-unique": "patternHint.fewUnique",
};

const CUSTOM_STARTER = `def sort(array):
    pass
`;

const initialize = (): void => {
  setLocale(resolveInitialLocale(), false);
  translateDocument();

  const projector = new Projector();
  const runner = new PythonRunner();
  let executionGeneration = 0;
  let busy = true;

  const countInput = document.querySelector<HTMLInputElement>("#length")!;
  const speedInputElement =
    document.querySelector<HTMLSelectElement>("#speed")!;
  const statusElement = document.querySelector<HTMLDivElement>("#error-log")!;
  const patternHintElement =
    document.querySelector<HTMLParagraphElement>("#pattern-hint")!;
  const timelineRange =
    document.querySelector<HTMLInputElement>("#timeline-range")!;
  const patternSelect =
    document.querySelector<HTMLSelectElement>("#pattern-select")!;
  const editorElement = document.querySelector<HTMLDivElement>("#editor-code")!;
  const lineNumberElement =
    document.querySelector<HTMLDivElement>("#editor-lines")!;
  const activeLineElement = document.querySelector<HTMLDivElement>(
    "#editor-active-line",
  )!;
  const generateButton =
    document.querySelector<HTMLButtonElement>("#generate-button")!;
  const exampleSelect =
    document.querySelector<HTMLSelectElement>("#example-select")!;
  const newSortButton =
    document.querySelector<HTMLButtonElement>("#new-sort-button")!;
  const lessonReference =
    document.querySelector<HTMLAnchorElement>("#lesson-reference")!;
  const lessonReferenceLabel = document.querySelector<HTMLSpanElement>(
    "#lesson-reference-label",
  )!;
  const localeSelect =
    document.querySelector<HTMLSelectElement>("#locale-select")!;
  localeSelect.value = getLocale();

  type StatusState = "ok" | "error" | "working";
  type MessageRenderer = () => string;
  let statusRenderer: MessageRenderer = () => t("status.enginePreparing");

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
    renderer: MessageRenderer,
    state: StatusState = "ok",
  ): void => {
    statusRenderer = renderer;
    statusElement.textContent = renderer();
    statusElement.dataset.state = state;
  };
  const updateLesson = (path: string): void => {
    const guide = getExampleGuide(path, getLocale());
    document.querySelector("#lesson-title")!.textContent = guide.title;
    document.querySelector("#lesson-summary")!.textContent = guide.summary;
    document.querySelector("#lesson-focus")!.textContent = guide.focus;
    document.querySelector("#complexity-best")!.textContent = guide.best;
    document.querySelector("#complexity-average")!.textContent = guide.average;
    document.querySelector("#complexity-worst")!.textContent = guide.worst;
    document.querySelector("#lesson-trait")!.textContent = guide.trait;
    lessonReferenceLabel.textContent = t("lesson.learnMore");
    if (guide.referenceUrl) {
      lessonReference.href = guide.referenceUrl;
      lessonReference.setAttribute(
        "aria-label",
        t("lesson.learnMoreAria", { algorithm: guide.title }),
      );
      lessonReference.hidden = false;
    } else {
      lessonReference.removeAttribute("href");
      lessonReference.removeAttribute("aria-label");
      lessonReference.hidden = true;
    }
  };
  const updatePatternHint = (): void => {
    const hintKey =
      PATTERN_HINT_KEYS[patternSelect.value] ?? PATTERN_HINT_KEYS.random;
    patternHintElement.textContent = t(hintKey);
  };
  const setBusy = (nextBusy: boolean): void => {
    busy = nextBusy;
    generateButton.disabled = busy;
    countInput.disabled = busy;
    exampleSelect.disabled = busy;
    patternSelect.disabled = busy;
    newSortButton.disabled = busy;
  };
  const clearVisualization = (
    title = t("error.visualizationTitle"),
    detail = t("error.visualizationDetail"),
  ): void => {
    projector.stopPlay();
    projector.timeline = null;
    document.querySelector("#log svg")?.remove();
    document.querySelector("#steps")!.textContent = "0";
    document.querySelector("#frame-position")!.textContent = "0 / 0";
    document.querySelector("#editor-source-position")!.textContent =
      t("source.waiting");
    document.querySelector("#timeline-position")!.textContent = "0 / 0";
    timelineRange.max = "0";
    timelineRange.value = "0";
    timelineRange.disabled = true;
    activeLineElement.hidden = true;
    document.querySelector("#operation-kind")!.textContent =
      t("source.waiting");
    document.querySelector("#operation-explanation")!.textContent = title;
    document.querySelector("#operation-detail")!.textContent = detail;
    projector.show();
  };

  editorElement.setAttribute("role", "textbox");
  editorElement.setAttribute("aria-multiline", "true");
  editorElement.setAttribute("aria-label", t("editor.label"));
  editorElement.setAttribute("spellcheck", "false");
  const jar = CodeJar(editorElement, highlight, { tab: "    " });
  editorElement.addEventListener("scroll", () => {
    lineNumberElement.scrollTop = editorElement.scrollTop;
    activeLineElement.style.setProperty(
      "--editor-scroll",
      `${editorElement.scrollTop}px`,
    );
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
    setStatus(() => t("status.executing"), "working");

    const pattern = patternSelect.value;
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
        setStatus(
          () => `${result.errorType}: ${localizeRunnerError(result.message)}`,
          "error",
        );
        if (result.traceback) console.error(result.traceback);
        return;
      }

      projector.timeline = new TraceTimeline(result);
      if (result.events.length > 0) projector.timeline.forward();
      projector.show();
      if (!result.preservesValues) {
        setStatus(() => t("status.valuesChanged"), "error");
      } else if (!result.isSorted) {
        setStatus(
          () =>
            t("status.notSorted", {
              version: runner.pythonVersion,
            }),
          "error",
        );
      } else {
        setStatus(() => {
          const sampling = result.sampled
            ? t("status.sampled", {
                steps: formatNumber(result.rawSteps),
              })
            : "";
          return t("status.complete", {
            frames: formatNumber(result.events.length),
            sampling,
            version: runner.pythonVersion,
          });
        });
      }
    } catch (error) {
      if (generation !== executionGeneration) return;
      clearVisualization();
      const message = error instanceof Error ? error.message : String(error);
      setStatus(() => localizeRunnerError(message), "error");
    } finally {
      if (generation === executionGeneration) {
        setBusy(false);
      }
    }
  };

  const startCustomSort = (): void => {
    ++executionGeneration;
    const guide = getExampleGuide(CUSTOM_EXAMPLE_PATH, getLocale());
    projector.stopPlay();
    jar.updateCode(CUSTOM_STARTER);
    updateLineNumbers(jar.toString());
    editorElement.scrollTop = 0;
    lineNumberElement.scrollTop = 0;
    updateLesson(CUSTOM_EXAMPLE_PATH);
    clearVisualization(guide.title, guide.focus);
    setStatus(() => t("status.customReady"));
    setBusy(false);
    requestAnimationFrame(() => editorElement.focus());
  };

  const loadExample = async (): Promise<void> => {
    if (!exampleSelect.value) return;
    if (exampleSelect.value === CUSTOM_EXAMPLE_PATH) {
      startCustomSort();
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(exampleSelect.value);
      if (!response.ok) {
        throw new Error(t("error.loadExample"));
      }
      jar.updateCode(await response.text());
      updateLineNumbers(jar.toString());
      editorElement.scrollTop = 0;
      lineNumberElement.scrollTop = 0;
      updateLesson(exampleSelect.value);
      await executeSort();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus(() => localizeRunnerError(message), "error");
      console.error(error);
      setBusy(false);
    }
  };

  exampleSelect.addEventListener("change", () => {
    void loadExample();
  });
  newSortButton.addEventListener("click", () => {
    if (exampleSelect.value === CUSTOM_EXAMPLE_PATH) {
      editorElement.focus();
      return;
    }
    exampleSelect.value = CUSTOM_EXAMPLE_PATH;
    startCustomSort();
  });
  updateLesson(exampleSelect.value);
  patternSelect.addEventListener("change", updatePatternHint);
  updatePatternHint();
  localeSelect.addEventListener("change", () => {
    const nextLocale = localeSelect.value;
    if (!isLocale(nextLocale)) return;
    setLocale(nextLocale);
    translateDocument();
    editorElement.setAttribute("aria-label", t("editor.label"));
    updateLesson(exampleSelect.value);
    updatePatternHint();
    statusElement.textContent = statusRenderer();
    projector.show();
  });

  window.addEventListener("keydown", (event): void => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (!busy) void executeSort();
      return;
    }
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
    if (projector.playing) projector.stopPlay();
    else void projector.autoPlay(speedInputElement);
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

  setStatus(() => t("status.enginePreparing"), "working");
  void runner
    .warm()
    .then(() => executeSort())
    .catch((error: unknown) => {
      setBusy(false);
      const message = error instanceof Error ? error.message : String(error);
      setStatus(() => localizeRunnerError(message), "error");
    });
};

initialize();
