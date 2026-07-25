import { formatNumber, t } from "../i18n";
import { BarChartRenderer } from "./barChartRenderer";
import type { TracePicture, TraceTimeline } from "./traceTimeline";

const waitForFrame = async (delay: number): Promise<void> =>
  new Promise((resolve) => {
    const startedAt = performance.now();
    const tick = (timestamp: number): void => {
      if (timestamp - startedAt >= delay) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

interface OperationExplanation {
  kind: string;
  title: string;
  detail: string;
}

const sourceLabel = (picture: TracePicture): string =>
  picture.line > 0
    ? t("source.line", {
        function: picture.functionName,
        line: picture.line,
      })
    : "";

const notesLabel = (picture: TracePicture): string =>
  Object.entries(picture.notes)
    .map(([name, value]) => `${name} = ${value}`)
    .join(" · ");

const explainOperation = (picture: TracePicture): OperationExplanation => {
  const source = sourceLabel(picture);
  const notes = notesLabel(picture);
  const detail = [source, notes].filter(Boolean).join(" · ");
  const newlyMarked = picture.markOperations.filter(
    (operation) => operation.after,
  );

  if (newlyMarked.length > 0) {
    const indices = newlyMarked
      .slice(0, 4)
      .map((operation) => `array[${operation.index}]`)
      .join(", ");
    const suffix =
      newlyMarked.length > 4
        ? t("operation.mark.more", { count: newlyMarked.length - 4 })
        : "";
    return {
      kind: t("operation.mark.kind"),
      title: t("operation.mark.title", { indices, suffix }),
      detail,
    };
  }

  const [firstWrite, secondWrite] = picture.writeOperations;
  const isSwap =
    picture.writeOperations.length === 2 &&
    firstWrite.before === secondWrite.after &&
    firstWrite.after === secondWrite.before;
  if (isSwap) {
    return {
      kind: t("operation.swap.kind"),
      title: t("operation.swap.title", {
        left: firstWrite.index,
        right: secondWrite.index,
      }),
      detail: `${firstWrite.before} ↔ ${secondWrite.before}${detail ? ` · ${detail}` : ""}`,
    };
  }
  if (picture.writeOperations.length > 0) {
    const changes = picture.writeOperations
      .slice(0, 3)
      .map(
        (operation) =>
          `array[${operation.index}]: ${operation.before} → ${operation.after}`,
      )
      .join(" · ");
    return {
      kind: t("operation.write.kind"),
      title:
        picture.writeOperations.length === 1
          ? t("operation.write.one", { index: firstWrite.index })
          : t("operation.write.many", {
              count: picture.writeOperations.length,
            }),
      detail: [changes, detail].filter(Boolean).join(" · "),
    };
  }

  if (picture.comparison && picture.readOperations.length >= 2) {
    const uniqueReads = [
      ...new Map(
        picture.readOperations.map((operation) => [operation.index, operation]),
      ).values(),
    ];
    const [left, right] = uniqueReads.slice(-2);
    if (left && right) {
      const operator =
        picture.operators.at(-1) ?? t("operation.compare.fallback");
      return {
        kind: t("operation.compare.kind"),
        title: t("operation.compare.title", {
          left: left.index,
          right: right.index,
          operator,
        }),
        detail: `${left.value} ${operator} ${right.value}${detail ? ` · ${detail}` : ""}`,
      };
    }
  }

  const lastRead = picture.readOperations.at(-1);
  if (lastRead) {
    return {
      kind: t("operation.read.kind"),
      title: t("operation.read.title", {
        index: lastRead.index,
        value: lastRead.value,
      }),
      detail,
    };
  }

  if (picture.line > 0) {
    return {
      kind: t("operation.advance.kind"),
      title: t("operation.advance.title", {
        function: picture.functionName,
        line: picture.line,
      }),
      detail: notes || t("operation.advance.noChange"),
    };
  }

  return {
    kind: t("operation.start.kind"),
    title: t("operation.start.title"),
    detail: t("operation.start.detail"),
  };
};

export class Projector {
  public timeline: TraceTimeline | null;

  public playing: boolean;

  private playGeneration: number;

  private readonly chart: BarChartRenderer | null;

  constructor() {
    this.timeline = null;
    this.playing = false;
    this.playGeneration = 0;
    const logElement = document.querySelector<HTMLElement>("#log");
    this.chart = logElement ? new BarChartRenderer(logElement) : null;
  }

  show(): void {
    const timeline = this.timeline;
    const stepsNode = document.querySelector("#steps");
    const frameNode = document.querySelector("#frame-position");
    const indicesElement = document.querySelector<HTMLSpanElement>("#indices");
    const timelineRange =
      document.querySelector<HTMLInputElement>("#timeline-range");
    const timelinePosition = document.querySelector("#timeline-position");
    const logElement = document.querySelector<HTMLDivElement>("#log");
    if (
      !timeline ||
      !stepsNode ||
      !frameNode ||
      !timelineRange ||
      !timelinePosition ||
      !logElement
    ) {
      this.chart?.clear();
      this.updateEditorLine(0, "sort");
      this.updatePlaybackState();
      return;
    }

    const totalFrames = Math.max(0, timeline.length - 1);
    const picture = timeline.picture;
    const { compares, line, functionName } = picture;

    stepsNode.textContent = formatNumber(compares);
    frameNode.textContent = `${formatNumber(timeline.position)} / ${formatNumber(totalFrames)}`;
    timelinePosition.textContent = `${formatNumber(timeline.position)} / ${formatNumber(totalFrames)}`;
    timelineRange.max = totalFrames.toString();
    timelineRange.value = timeline.position.toString();
    timelineRange.disabled = totalFrames === 0;
    if (indicesElement) {
      indicesElement.textContent =
        line > 0
          ? t("source.line", { function: functionName, line })
          : t("source.before");
    }
    this.updateEditorLine(line, functionName);

    const explanation = explainOperation(picture);
    const operationKind = document.querySelector("#operation-kind");
    const operationTitle = document.querySelector("#operation-explanation");
    const operationDetail = document.querySelector("#operation-detail");
    if (operationKind) operationKind.textContent = explanation.kind;
    if (operationTitle) operationTitle.textContent = explanation.title;
    if (operationDetail) operationDetail.textContent = explanation.detail;

    this.updatePlaybackState();
    this.chart?.render(picture, timeline.position, compares);
  }

  async autoPlay(
    speedInputElement: HTMLInputElement | HTMLSelectElement,
  ): Promise<void> {
    if (this.timeline === null || this.playing || this.timeline.length === 0) {
      return;
    }
    const generation = ++this.playGeneration;
    this.playing = true;
    const currentTimeline = this.timeline;
    if (currentTimeline.isEnd) currentTimeline.reset();
    this.show();
    while (
      this.playing &&
      this.timeline === currentTimeline &&
      generation === this.playGeneration
    ) {
      if (currentTimeline.isEnd) break;
      const speed = Number.parseInt(speedInputElement.value, 10);
      const framesPerSecond =
        Number.isFinite(speed) && speed > 0
          ? Math.min(120, Math.max(1, speed))
          : 10;
      await waitForFrame(1000 / framesPerSecond);
      if (
        !this.playing ||
        this.timeline !== currentTimeline ||
        generation !== this.playGeneration
      ) {
        break;
      }
      currentTimeline.forward();
      this.show();
    }
    if (generation === this.playGeneration) {
      this.playing = false;
      this.show();
    }
  }

  stopPlay(): void {
    this.playing = false;
    this.playGeneration++;
    this.updatePlaybackState();
  }

  resize(): void {
    this.chart?.invalidateLayout();
    this.show();
  }

  back(): void {
    if (this.timeline === null || this.timeline.isStart) return;
    this.timeline.back();
    this.show();
  }

  forward(): void {
    if (this.timeline === null || this.timeline.isEnd) return;
    this.timeline.forward();
    this.show();
  }

  seek(position: number): void {
    if (!this.timeline) return;
    this.stopPlay();
    this.timeline.seek(position);
    this.show();
  }

  private updatePlaybackState(): void {
    const hasTimeline = this.timeline !== null && this.timeline.length > 1;
    const startButton =
      document.querySelector<HTMLButtonElement>("#start-button");
    const playLabel = document.querySelector("#play-label");
    const playIcon = document.querySelector("#play-icon");
    const backButton =
      document.querySelector<HTMLButtonElement>("#back-button");
    const forwardButton =
      document.querySelector<HTMLButtonElement>("#forward-button");
    const resetButton =
      document.querySelector<HTMLButtonElement>("#reset-button");

    if (startButton) {
      startButton.disabled = !hasTimeline;
      startButton.title = this.playing
        ? t("transport.pauseTitle")
        : t("transport.playTitle");
      startButton.setAttribute(
        "aria-label",
        this.playing ? t("transport.pause") : t("transport.play"),
      );
    }
    if (playLabel) {
      playLabel.textContent = this.playing
        ? t("transport.stop")
        : t("transport.play");
    }
    if (playIcon) playIcon.textContent = this.playing ? "Ⅱ" : "▶";
    if (backButton) {
      backButton.disabled =
        !hasTimeline || this.playing || Boolean(this.timeline?.isStart);
    }
    if (forwardButton) {
      forwardButton.disabled =
        !hasTimeline || this.playing || Boolean(this.timeline?.isEnd);
    }
    if (resetButton) {
      resetButton.disabled =
        !hasTimeline || this.playing || Boolean(this.timeline?.isStart);
    }
  }

  private updateEditorLine(line: number, functionName: string): void {
    const activeLine = document.querySelector<HTMLDivElement>(
      "#editor-active-line",
    );
    const editor = document.querySelector<HTMLDivElement>("#editor-code");
    const sourcePosition = document.querySelector("#editor-source-position");
    if (!activeLine || !editor) return;

    if (line <= 0) {
      activeLine.hidden = true;
      if (sourcePosition) sourcePosition.textContent = t("source.before");
      return;
    }

    activeLine.hidden = false;
    const editorStyle = getComputedStyle(editor);
    const lineHeight = Number.parseFloat(editorStyle.lineHeight);
    const paddingTop = Number.parseFloat(editorStyle.paddingTop);
    const lineTop = paddingTop + (line - 1) * lineHeight;
    const lineBottom = lineTop + lineHeight;
    if (
      lineTop < editor.scrollTop ||
      lineBottom > editor.scrollTop + editor.clientHeight
    ) {
      editor.scrollTop = Math.max(0, lineTop - editor.clientHeight / 2);
      const lineNumbers =
        document.querySelector<HTMLDivElement>("#editor-lines");
      if (lineNumbers) lineNumbers.scrollTop = editor.scrollTop;
    }
    activeLine.style.setProperty("--line-index", (line - 1).toString());
    activeLine.style.setProperty("--editor-scroll", `${editor.scrollTop}px`);
    if (sourcePosition) {
      sourcePosition.textContent = t("source.line", {
        function: functionName,
        line,
      });
    }
  }
}
