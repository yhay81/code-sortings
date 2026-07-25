import { formatNumber, t } from "../i18n";
import { BarChartRenderer } from "./barChartRenderer";
import { explainOperation } from "./operationExplanation";
import type { TraceTimeline } from "./traceTimeline";

const waitForFrame = async (delay: number): Promise<void> =>
  new Promise((resolve) => {
    const startedAt = performance.now();
    const tick = (timestamp: number): void => {
      if (timestamp - startedAt >= delay) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

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
