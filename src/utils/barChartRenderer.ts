import { formatNumber, t } from "../i18n";
import type { TracePicture } from "./traceTimeline";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const LABEL_LIMIT = 30;

interface ChartColors {
  base: string;
  compare: string;
  label: string;
  labelStroke: string;
  read: string;
  sorted: string;
  write: string;
}

const createSvgElement = <K extends keyof SVGElementTagNameMap>(
  name: K,
): SVGElementTagNameMap[K] =>
  document.createElementNS(SVG_NAMESPACE, name) as SVGElementTagNameMap[K];

const normalizeValue = (value: number): number =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export class BarChartRenderer {
  private readonly root: HTMLElement;

  private readonly colors: ChartColors;

  private svg: SVGSVGElement | null = null;

  private title: SVGTitleElement | null = null;

  private barsGroup: SVGGElement | null = null;

  private labelsGroup: SVGGElement | null = null;

  private bars: SVGRectElement[] = [];

  private labels: SVGTextElement[] = [];

  private barValues: number[] = [];

  private barRawValues: number[] = [];

  private barFills: string[] = [];

  private layoutDirty = true;

  private width = 240;

  private height = 160;

  private barWidth = 0;

  private maxValue = 1;

  public constructor(root: HTMLElement) {
    this.root = root;
    const style = getComputedStyle(document.documentElement);
    this.colors = {
      base: style.getPropertyValue("--bar-default").trim() || "#168c88",
      read: style.getPropertyValue("--bar-focus").trim() || "#2874a6",
      compare: style.getPropertyValue("--bar-compare").trim() || "#c54536",
      write: style.getPropertyValue("--bar-temp").trim() || "#b66b20",
      sorted: style.getPropertyValue("--bar-sorted").trim() || "#547f38",
      label: style.getPropertyValue("--bar-label").trim() || "#ffffff",
      labelStroke:
        style.getPropertyValue("--bar-label-stroke").trim() ||
        "rgba(20, 18, 14, 0.65)",
    };
  }

  public clear(): void {
    this.svg?.remove();
    this.svg = null;
    this.title = null;
    this.barsGroup = null;
    this.labelsGroup = null;
    this.bars = [];
    this.labels = [];
    this.barValues = [];
    this.barRawValues = [];
    this.barFills = [];
    this.layoutDirty = true;
    this.barWidth = 0;
    this.maxValue = 1;
  }

  public invalidateLayout(): void {
    this.layoutDirty = true;
  }

  public render(
    picture: TracePicture,
    frame: number,
    comparisons: number,
  ): void {
    if (picture.array.length === 0) {
      this.clear();
      return;
    }

    this.ensureSvg();
    const layoutChanged = this.measure();
    const elementsChanged = this.ensureDataElements(picture.array.length);
    if (layoutChanged || elementsChanged) {
      this.updateStaticGeometry(picture.array.length);
    }

    const svg = this.svg;
    const title = this.title;
    if (!svg || !title) return;

    const ariaLabel = t("chart.label", {
      comparisons: formatNumber(comparisons),
      frame: formatNumber(frame),
    });
    if (svg.getAttribute("aria-label") !== ariaLabel) {
      svg.setAttribute("aria-label", ariaLabel);
    }
    const titleText = t("chart.title", {
      values: picture.array.join(", "),
    });
    if (title.textContent !== titleText) title.textContent = titleText;

    const nextMaxValue = picture.array.reduce(
      (maximum, value) => Math.max(maximum, normalizeValue(value)),
      1,
    );
    const scaleChanged =
      layoutChanged || elementsChanged || nextMaxValue !== this.maxValue;
    this.maxValue = nextMaxValue;
    const barCount = picture.array.length;
    const barHeight = this.height / this.maxValue;
    const reads = new Set(picture.reads);
    const writes = new Set(picture.writes);
    const sorted = new Set(picture.sorted);

    for (let index = 0; index < barCount; index++) {
      const rawValue = picture.array[index];
      const value = normalizeValue(rawValue);
      const bar = this.bars[index];
      const valueChanged = this.barValues[index] !== value;
      const rawValueChanged = this.barRawValues[index] !== rawValue;
      if (scaleChanged || valueChanged) {
        bar.setAttribute("y", (this.height - value * barHeight).toString());
        bar.setAttribute("height", (value * barHeight).toString());
        this.barValues[index] = value;
      }
      this.barRawValues[index] = rawValue;
      const fill = this.colorFor(
        index,
        reads,
        writes,
        sorted,
        picture.comparison,
      );
      if (this.barFills[index] !== fill) {
        bar.setAttribute("fill", fill);
        this.barFills[index] = fill;
      }

      const label = this.labels[index];
      if (!label) continue;
      if (rawValueChanged || label.textContent === "") {
        label.textContent = rawValue.toString();
      }
      if (scaleChanged || valueChanged) {
        label.setAttribute(
          "y",
          (this.height - value * barHeight + this.barWidth / 1.5).toString(),
        );
      }
    }
  }

  private colorFor(
    index: number,
    reads: Set<number>,
    writes: Set<number>,
    sorted: Set<number>,
    comparison: boolean,
  ): string {
    if (writes.has(index)) return this.colors.write;
    if (comparison && reads.has(index)) return this.colors.compare;
    if (reads.has(index)) return this.colors.read;
    if (sorted.has(index)) return this.colors.sorted;
    return this.colors.base;
  }

  private ensureSvg(): void {
    if (this.svg?.isConnected) return;

    this.clear();
    this.svg = createSvgElement("svg");
    this.svg.setAttribute("role", "img");
    this.title = createSvgElement("title");
    this.barsGroup = createSvgElement("g");
    this.barsGroup.setAttribute("class", "chart-bars");
    this.labelsGroup = createSvgElement("g");
    this.labelsGroup.setAttribute("class", "chart-labels");
    this.svg.append(this.title, this.barsGroup, this.labelsGroup);
    this.root.append(this.svg);
  }

  private ensureDataElements(count: number): boolean {
    if (!this.barsGroup || !this.labelsGroup) return false;

    let changed = false;
    if (this.bars.length !== count) {
      this.bars = Array.from({ length: count }, () => {
        const bar = createSvgElement("rect");
        bar.setAttribute("class", "chart-bar");
        return bar;
      });
      this.barsGroup.replaceChildren(...this.bars);
      this.barValues = Array.from({ length: count }, () => Number.NaN);
      this.barRawValues = Array.from({ length: count }, () => Number.NaN);
      this.barFills = Array.from({ length: count }, () => "");
      changed = true;
    }

    const labelCount = count < LABEL_LIMIT ? count : 0;
    if (this.labels.length !== labelCount) {
      this.labels = Array.from({ length: labelCount }, () => {
        const label = createSvgElement("text");
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("fill", this.colors.label);
        label.setAttribute("stroke", this.colors.labelStroke);
        label.setAttribute("stroke-width", "1.8");
        label.setAttribute("font-weight", "700");
        label.style.paintOrder = "stroke fill";
        label.style.strokeLinejoin = "round";
        return label;
      });
      this.labelsGroup.replaceChildren(...this.labels);
      changed = true;
    }
    return changed;
  }

  private updateStaticGeometry(count: number): void {
    const svg = this.svg;
    if (!svg || count === 0) return;

    svg.setAttribute("width", this.width.toString());
    svg.setAttribute("height", this.height.toString());
    const barGap = this.width / count <= 1 ? 0 : 1;
    this.barWidth = this.width / count - barGap;
    const radius = Math.min(4, this.barWidth / 3).toString();
    const width = this.barWidth.toString();
    const fontSize = `${Math.max(10, this.barWidth / 2).toFixed(1)}px`;
    for (let index = 0; index < count; index++) {
      const x = index * (this.barWidth + barGap);
      const bar = this.bars[index];
      bar.setAttribute("x", x.toString());
      bar.setAttribute("width", width);
      bar.setAttribute("rx", radius);

      const label = this.labels[index];
      if (!label) continue;
      label.setAttribute("x", (x + this.barWidth / 2).toString());
      label.setAttribute("font-size", fontSize);
    }
  }

  private measure(): boolean {
    if (!this.layoutDirty) return false;

    const style = getComputedStyle(this.root);
    const paddingX =
      Number.parseFloat(style.paddingLeft) +
      Number.parseFloat(style.paddingRight);
    const paddingY =
      Number.parseFloat(style.paddingTop) +
      Number.parseFloat(style.paddingBottom);
    const contentWidth = this.root.clientWidth - paddingX;
    const contentHeight = this.root.clientHeight - paddingY;
    this.width = Number.isFinite(contentWidth)
      ? Math.max(240, contentWidth)
      : 240;
    this.height = Number.isFinite(contentHeight)
      ? Math.max(160, contentHeight)
      : 160;
    this.layoutDirty = false;
    return true;
  }
}
