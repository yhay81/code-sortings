import { select } from "d3-selection";
import type { TracePicture, TraceTimeline } from "./traceTimeline";

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

interface OperationExplanation {
  kind: string;
  title: string;
  detail: string;
}

const sourceLabel = (picture: TracePicture): string =>
  picture.line > 0 ? `${picture.functionName}() · ${picture.line}行目` : "";

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
      .join("、");
    const suffix =
      newlyMarked.length > 4 ? `ほか${newlyMarked.length - 4}件` : "";
    return {
      kind: "位置を確定",
      title: `${indices}${suffix} を整列済みにしました`,
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
      kind: "値を交換",
      title: `array[${firstWrite.index}] と array[${secondWrite.index}] を交換しました`,
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
      kind: "値を書き換え",
      title:
        picture.writeOperations.length === 1
          ? `array[${firstWrite.index}] を更新しました`
          : `${picture.writeOperations.length}か所を更新しました`,
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
      const operator = picture.operators.at(-1) ?? "比較";
      return {
        kind: "値を比較",
        title: `array[${left.index}] と array[${right.index}] を「${operator}」で比較`,
        detail: `${left.value} ${operator} ${right.value}${detail ? ` · ${detail}` : ""}`,
      };
    }
  }

  const lastRead = picture.readOperations.at(-1);
  if (lastRead) {
    return {
      kind: "値を読む",
      title: `array[${lastRead.index}] から ${lastRead.value} を読み取りました`,
      detail,
    };
  }

  if (picture.line > 0) {
    return {
      kind: "コードを進める",
      title: `${picture.functionName}() の ${picture.line}行目を実行しました`,
      detail: notes || "この行では配列の値は変わりません",
    };
  }

  return {
    kind: "開始位置",
    title: "実行前の配列です",
    detail: "再生するか、タイムラインを動かして変化を追ってみましょう",
  };
};

export class Projector {
  public timeline: TraceTimeline | null;

  public playing: boolean;

  private playGeneration: number;

  constructor() {
    this.timeline = null;
    this.playing = false;
    this.playGeneration = 0;
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
      this.updateEditorLine(0, "sort");
      this.updatePlaybackState();
      return;
    }

    const totalFrames = Math.max(0, timeline.length - 1);
    const picture = timeline.picture;
    const {
      array,
      compares,
      reads,
      writes,
      sorted,
      line,
      functionName,
      comparison,
    } = picture;

    stepsNode.textContent = compares.toLocaleString();
    frameNode.textContent = `${timeline.position.toLocaleString()} / ${totalFrames.toLocaleString()}`;
    timelinePosition.textContent = `${timeline.position.toLocaleString()} / ${totalFrames.toLocaleString()}`;
    timelineRange.max = totalFrames.toString();
    timelineRange.value = timeline.position.toString();
    timelineRange.disabled = totalFrames === 0;
    if (indicesElement) {
      indicesElement.textContent =
        line > 0 ? `${functionName}() · ${line}行目` : "実行前";
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
    if (array.length === 0) {
      select("#log").select("svg").remove();
      return;
    }

    const rootStyle = getComputedStyle(document.documentElement);
    const colors = {
      base: rootStyle.getPropertyValue("--bar-default").trim() || "#168c88",
      read: rootStyle.getPropertyValue("--bar-focus").trim() || "#2874a6",
      compare: rootStyle.getPropertyValue("--bar-compare").trim() || "#c54536",
      write: rootStyle.getPropertyValue("--bar-temp").trim() || "#b66b20",
      sorted: rootStyle.getPropertyValue("--bar-sorted").trim() || "#547f38",
    };
    const labelColor =
      rootStyle.getPropertyValue("--bar-label").trim() || "#ffffff";
    const labelStroke =
      rootStyle.getPropertyValue("--bar-label-stroke").trim() ||
      "rgba(20, 18, 14, 0.65)";
    const logStyle = getComputedStyle(logElement);
    const paddingX =
      Number.parseFloat(logStyle.paddingLeft) +
      Number.parseFloat(logStyle.paddingRight);
    const paddingY =
      Number.parseFloat(logStyle.paddingTop) +
      Number.parseFloat(logStyle.paddingBottom);
    const width = Math.max(240, logElement.clientWidth - paddingX);
    const height = Math.max(160, logElement.clientHeight - paddingY);
    const barCount = array.length;
    const barGap = width / barCount <= 1 ? 0 : 1;
    const barWidth = width / barCount - barGap;
    const normalizeValue = (value: number): number =>
      Number.isFinite(value) ? Math.max(0, value) : 0;
    const maxValue = array.reduce(
      (max, value) => Math.max(max, normalizeValue(value)),
      1,
    );
    const barHeight = height / maxValue;

    const logSelection = select(logElement);
    logSelection.select("svg").remove();
    const svg = logSelection
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("role", "img")
      .attr(
        "aria-label",
        `ソート配列。比較 ${compares} 回、${timeline.position} フレーム目`,
      );
    svg.append("title").text(`配列: ${array.join(", ")}`);
    svg
      .selectAll("rect")
      .data(array)
      .enter()
      .append("rect")
      .attr("x", (_, index: number) => index * (barWidth + barGap))
      .attr("y", (value: number) => height - normalizeValue(value) * barHeight)
      .attr("width", barWidth)
      .attr("height", (value: number) => normalizeValue(value) * barHeight)
      .attr("rx", Math.min(4, barWidth / 3))
      .attr("fill", (_, index) => {
        if (writes.includes(index)) return colors.write;
        if (comparison && reads.includes(index)) return colors.compare;
        if (reads.includes(index)) return colors.read;
        if (sorted.includes(index)) return colors.sorted;
        return colors.base;
      });

    if (array.length < 30) {
      svg
        .selectAll("text")
        .data(array)
        .enter()
        .append("text")
        .text((value: number) => value)
        .attr("text-anchor", "middle")
        .attr("x", (_, index) => index * (barWidth + barGap) + barWidth / 2)
        .attr(
          "y",
          (value: number) =>
            height - normalizeValue(value) * barHeight + barWidth / 1.5,
        )
        .attr("font-size", () => `${Math.max(10, barWidth / 2).toFixed(1)}px`)
        .attr("fill", labelColor)
        .attr("stroke", labelStroke)
        .attr("stroke-width", "1.8")
        .attr("font-weight", "700")
        .style("paint-order", "stroke fill")
        .style("stroke-linejoin", "round");
    }
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
      await sleep(1000 / framesPerSecond);
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
      startButton.title = this.playing ? "一時停止（Space）" : "再生（Space）";
      startButton.setAttribute(
        "aria-label",
        this.playing ? "一時停止" : "再生",
      );
    }
    if (playLabel) playLabel.textContent = this.playing ? "停止" : "再生";
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
      if (sourcePosition) sourcePosition.textContent = "実行前";
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
      sourcePosition.textContent = `${functionName}() · Ln ${line}`;
    }
  }
}
