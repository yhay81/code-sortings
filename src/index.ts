import {
  CUSTOM_STARTER,
  DEFAULT_SOURCE,
  SortingCodeEditor,
} from "./app/codeEditor";
import { bindAppElements } from "./app/elements";
import { renderLesson } from "./app/lessonView";
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

declare const __BUILD_VERSION__: string;

const PATTERN_HINT_KEYS: Record<string, TranslationKey> = {
  random: "patternHint.random",
  "nearly-sorted": "patternHint.nearlySorted",
  reversed: "patternHint.reversed",
  "few-unique": "patternHint.fewUnique",
};

const initialize = (): void => {
  document.documentElement.dataset.build =
    typeof __BUILD_VERSION__ === "string" ? __BUILD_VERSION__ : "development";
  setLocale(resolveInitialLocale(), false);
  translateDocument();

  const elements = bindAppElements();
  const projector = new Projector();
  const runner = new PythonRunner();
  const editor = new SortingCodeEditor(
    elements.editor,
    elements.lineNumbers,
    elements.activeLine,
  );
  let executionGeneration = 0;
  let busy = true;

  const {
    activeLine: activeLineElement,
    countInput,
    exampleSelect,
    generateButton,
    localeSelect,
    newSortButton,
    patternHint: patternHintElement,
    patternSelect,
    speedSelect: speedInputElement,
    status: statusElement,
    timelineRange,
  } = elements;
  localeSelect.value = getLocale();

  type StatusState = "ok" | "error" | "working";
  type MessageRenderer = () => string;
  let statusRenderer: MessageRenderer = () => t("status.enginePreparing");

  const setStatus = (
    renderer: MessageRenderer,
    state: StatusState = "ok",
  ): void => {
    statusRenderer = renderer;
    statusElement.textContent = renderer();
    statusElement.dataset.state = state;
  };
  const updateLesson = (path: string): void => {
    renderLesson(elements, path, getLocale());
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
    elements.steps.textContent = "0";
    elements.framePosition.textContent = "0 / 0";
    elements.sourcePosition.textContent = t("source.waiting");
    elements.timelinePosition.textContent = "0 / 0";
    timelineRange.max = "0";
    timelineRange.value = "0";
    timelineRange.disabled = true;
    activeLineElement.hidden = true;
    elements.operationKind.textContent = t("source.waiting");
    elements.operationTitle.textContent = title;
    elements.operationDetail.textContent = detail;
    projector.show();
  };

  editor.setCode(DEFAULT_SOURCE);

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
      const result = await runner.run(editor.code, array);
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
    editor.setCode(CUSTOM_STARTER);
    updateLesson(CUSTOM_EXAMPLE_PATH);
    clearVisualization(guide.title, guide.focus);
    setStatus(() => t("status.customReady"));
    setBusy(false);
    requestAnimationFrame(() => editor.focus());
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
      editor.setCode(await response.text());
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
      editor.focus();
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
    editor.updateAccessibility();
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

  elements.startButton.addEventListener("click", () => {
    if (projector.playing) projector.stopPlay();
    else void projector.autoPlay(speedInputElement);
  });
  elements.backButton.addEventListener("click", () => {
    projector.back();
  });
  elements.forwardButton.addEventListener("click", () => {
    projector.forward();
  });
  elements.resetButton.addEventListener("click", () => {
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
  const resizeObserver = new ResizeObserver(() => projector.resize());
  resizeObserver.observe(elements.log);

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
