import type { AppElements } from "../app/elements";
import { formatNumber, t } from "../i18n";
import { BarChartRenderer } from "./barChartRenderer";
import { explainOperation } from "./operationExplanation";
import type { TraceTimeline } from "./traceTimeline";

type ProjectorElements = Pick<
  AppElements,
  | "activeLine"
  | "backButton"
  | "editor"
  | "forwardButton"
  | "framePosition"
  | "lineNumbers"
  | "log"
  | "operationDetail"
  | "operationKind"
  | "operationTitle"
  | "playIcon"
  | "playLabel"
  | "resetButton"
  | "sourcePosition"
  | "startButton"
  | "steps"
  | "timelinePosition"
  | "timelineRange"
>;

const waitForFrame = async (delay: number): Promise<void> =>
  new Promise((resolve) => {
    const startedAt = performance.now();
    const tick = (timestamp: number): void => {
      if (timestamp - startedAt >= delay) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

const updateText = (element: Element, text: string): void => {
  if (element.textContent !== text) element.textContent = text;
};

export class Projector {
  public timeline: TraceTimeline | null;

  public playing: boolean;

  private playGeneration: number;

  private readonly chart: BarChartRenderer;

  private editorLayoutDirty = true;

  private editorLineHeight = 0;

  private editorPaddingTop = 0;

  private playbackStateKey = "";

  constructor(private readonly elements: ProjectorElements) {
    this.timeline = null;
    this.playing = false;
    this.playGeneration = 0;
    this.chart = new BarChartRenderer(elements.log);
  }

  show(): void {
    const timeline = this.timeline;
    const {
      framePosition,
      operationDetail,
      operationKind,
      operationTitle,
      steps,
      timelinePosition,
      timelineRange,
    } = this.elements;
    if (!timeline) {
      this.chart.clear();
      this.updateEditorLine(0, "sort");
      this.updatePlaybackState();
      return;
    }

    const totalFrames = Math.max(0, timeline.length - 1);
    const picture = timeline.picture;
    const { compares, line, functionName } = picture;

    const formattedPosition = formatNumber(timeline.position);
    const formattedTotal = formatNumber(totalFrames);
    const positionText = `${formattedPosition} / ${formattedTotal}`;
    updateText(steps, formatNumber(compares));
    updateText(framePosition, positionText);
    updateText(timelinePosition, positionText);
    const rangeMax = totalFrames.toString();
    const rangeValue = timeline.position.toString();
    if (timelineRange.max !== rangeMax) timelineRange.max = rangeMax;
    if (timelineRange.value !== rangeValue) timelineRange.value = rangeValue;
    const rangeDisabled = totalFrames === 0;
    if (timelineRange.disabled !== rangeDisabled) {
      timelineRange.disabled = rangeDisabled;
    }
    this.updateEditorLine(line, functionName);

    const explanation = explainOperation(picture);
    updateText(operationKind, explanation.kind);
    updateText(operationTitle, explanation.title);
    updateText(operationDetail, explanation.detail);

    this.updatePlaybackState();
    this.chart.render(picture, timeline.position, compares);
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
    this.editorLayoutDirty = true;
    this.chart.invalidateLayout();
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
    const isStart = Boolean(this.timeline?.isStart);
    const isEnd = Boolean(this.timeline?.isEnd);
    const playTitle = this.playing
      ? t("transport.pauseTitle")
      : t("transport.playTitle");
    const playAriaLabel = this.playing
      ? t("transport.pause")
      : t("transport.play");
    const playText = this.playing ? t("transport.stop") : t("transport.play");
    const nextStateKey = [
      hasTimeline,
      this.playing,
      isStart,
      isEnd,
      playTitle,
      playAriaLabel,
      playText,
    ].join("|");
    if (this.playbackStateKey === nextStateKey) return;
    this.playbackStateKey = nextStateKey;

    const {
      backButton,
      forwardButton,
      playIcon,
      playLabel,
      resetButton,
      startButton,
    } = this.elements;
    startButton.disabled = !hasTimeline;
    startButton.title = playTitle;
    startButton.setAttribute("aria-label", playAriaLabel);
    updateText(playLabel, playText);
    updateText(playIcon, this.playing ? "Ⅱ" : "▶");
    backButton.disabled = !hasTimeline || this.playing || isStart;
    forwardButton.disabled = !hasTimeline || this.playing || isEnd;
    resetButton.disabled = !hasTimeline || this.playing || isStart;
  }

  private updateEditorLine(line: number, functionName: string): void {
    const { activeLine, editor, lineNumbers, sourcePosition } = this.elements;

    if (line <= 0) {
      if (!activeLine.hidden) activeLine.hidden = true;
      updateText(sourcePosition, t("source.before"));
      return;
    }

    if (activeLine.hidden) activeLine.hidden = false;
    if (this.editorLayoutDirty) {
      const editorStyle = getComputedStyle(editor);
      const lineHeight = Number.parseFloat(editorStyle.lineHeight);
      const paddingTop = Number.parseFloat(editorStyle.paddingTop);
      this.editorLineHeight =
        Number.isFinite(lineHeight) && lineHeight > 0 ? lineHeight : 0;
      this.editorPaddingTop = Number.isFinite(paddingTop) ? paddingTop : 0;
      this.editorLayoutDirty = false;
    }

    const lineTop = this.editorPaddingTop + (line - 1) * this.editorLineHeight;
    const lineBottom = lineTop + this.editorLineHeight;
    const scrollTop = editor.scrollTop;
    const editorHeight = editor.clientHeight;
    if (
      this.editorLineHeight > 0 &&
      (lineTop < scrollTop || lineBottom > scrollTop + editorHeight)
    ) {
      editor.scrollTop = Math.max(0, lineTop - editorHeight / 2);
      lineNumbers.scrollTop = editor.scrollTop;
    }
    const lineIndex = (line - 1).toString();
    const editorScroll = `${editor.scrollTop}px`;
    if (activeLine.style.getPropertyValue("--line-index") !== lineIndex) {
      activeLine.style.setProperty("--line-index", lineIndex);
    }
    if (activeLine.style.getPropertyValue("--editor-scroll") !== editorScroll) {
      activeLine.style.setProperty("--editor-scroll", editorScroll);
    }
    updateText(
      sourcePosition,
      t("source.line", {
        function: functionName,
        line,
      }),
    );
  }
}
