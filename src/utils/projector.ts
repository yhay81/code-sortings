import { select } from "d3-selection";
import type { TraceTimeline } from "./traceTimeline";

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

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
    if (this.timeline === null) return;
    const stepsNode = document.querySelector("#steps")!;
    const indicesElement = document.querySelector<HTMLSpanElement>("#indices");
    const logElement = document.querySelector<HTMLDivElement>("#log");
    if (!logElement) return;
    const rootStyle = getComputedStyle(document.documentElement);
    const colors = {
      base: rootStyle.getPropertyValue("--bar-default").trim() || "#47c6bd",
      read: rootStyle.getPropertyValue("--bar-focus").trim() || "#8fe28a",
      compare: rootStyle.getPropertyValue("--bar-compare").trim() || "#e8645a",
      write: rootStyle.getPropertyValue("--bar-temp").trim() || "#f3b562",
      sorted: rootStyle.getPropertyValue("--bar-sorted").trim() || "#7fbf7f",
    };
    const labelColor =
      rootStyle.getPropertyValue("--bar-label").trim() || "#fefbf6";
    const labelStroke =
      rootStyle.getPropertyValue("--bar-label-stroke").trim() ||
      "rgba(20, 18, 14, 0.65)";
    if (this.timeline.length === 0) {
      stepsNode.textContent = "0 / 0";
      if (indicesElement) indicesElement.textContent = "実行待ち";
      select("#log").select("svg").remove();
      return;
    }

    const {
      array,
      compares,
      reads,
      writes,
      sorted,
      line,
      functionName,
      comparison,
      operators,
      notes,
    } = this.timeline.picture;
    stepsNode.textContent = `${compares} / ${this.timeline.totalCompares}`;
    if (indicesElement) {
      const readLabel = reads.length ? reads.join(",") : "-";
      const writeLabel = writes.length ? writes.join(",") : "-";
      const operatorLabel =
        comparison && operators.length ? ` · ${operators.join(" ")}` : "";
      const notesLabel = Object.entries(notes)
        .map(([name, value]) => `${name}=${value}`)
        .join(", ");
      indicesElement.textContent =
        line > 0
          ? `${functionName}:${line} · read[${readLabel}] · write[${writeLabel}]${operatorLabel}${notesLabel ? ` · ${notesLabel}` : ""}`
          : "初期状態";
    }
    if (array.length === 0) {
      select("#log").select("svg").remove();
      return;
    }
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
        `ソート配列。比較 ${compares} 回、${this.timeline.position} ステップ目`,
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

  async autoPlay(speedInputElement: HTMLInputElement): Promise<void> {
    if (this.timeline === null || this.playing || this.timeline.length === 0) {
      return;
    }
    const generation = ++this.playGeneration;
    this.playing = true;
    const currentTimeline = this.timeline;
    while (
      this.playing &&
      this.timeline === currentTimeline &&
      generation === this.playGeneration
    ) {
      this.show();
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
    }
    if (generation === this.playGeneration) this.playing = false;
  }

  stopPlay(): void {
    this.playing = false;
    this.playGeneration++;
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
}
