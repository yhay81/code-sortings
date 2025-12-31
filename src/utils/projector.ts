import { select } from "d3-selection";
import type { Film } from "./film";

const sleep = async (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

export class Projector {
  public film: Film | null;

  public playing: boolean;

  constructor() {
    this.film = null;
    this.playing = false;
  }

  show(): void {
    if (this.film === null) return;
    const stepsNode = document.querySelector("#steps")!;
    const indicesElement = document.querySelector<HTMLSpanElement>("#indices");
    const logElement = document.querySelector<HTMLDivElement>("#log");
    if (!logElement) return;
    const rootStyle = getComputedStyle(document.documentElement);
    const colors = {
      base: rootStyle.getPropertyValue("--bar-default").trim() || "#47c6bd",
      focus: rootStyle.getPropertyValue("--bar-focus").trim() || "#8fe28a",
      compare: rootStyle.getPropertyValue("--bar-compare").trim() || "#e8645a",
      temp: rootStyle.getPropertyValue("--bar-temp").trim() || "#f3b562",
      sorted: rootStyle.getPropertyValue("--bar-sorted").trim() || "#7fbf7f",
    };
    const labelColor =
      rootStyle.getPropertyValue("--bar-label").trim() || "#fefbf6";
    const labelStroke =
      rootStyle.getPropertyValue("--bar-label-stroke").trim() ||
      "rgba(20, 18, 14, 0.65)";
    if (this.film.length === 0) {
      stepsNode.textContent = "0 / 0";
      if (indicesElement) indicesElement.textContent = "i=-, j=-, temp=-";
      select("#log").select("svg").remove();
      return;
    }

    const { array, compares, i, j, temp, greens = [] } = this.film.picture;
    stepsNode.textContent = `${compares} / ${this.film.totalCompares}`;
    if (indicesElement) {
      indicesElement.textContent = `i=${i}, j=${j}, temp=${temp}`;
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
    const W = Math.max(240, logElement.clientWidth - paddingX);
    const H = Math.max(160, logElement.clientHeight - paddingY);
    const arrayPlus = [...array, temp];
    const barCount = arrayPlus.length;
    let barGap = 1;
    if (W / barCount <= barGap) {
      barGap = 0;
    }
    const BAR_W = W / barCount - barGap;
    const normalizeValue = (value: number): number =>
      Number.isFinite(value) ? Math.max(0, value) : 0;
    const maxValue = arrayPlus.reduce(
      (max, value) => Math.max(max, normalizeValue(value)),
      1,
    );
    const BAR_H = H / maxValue;

    const logSelection = select(logElement);
    logSelection.select("svg").remove();
    const svg = logSelection.append("svg").attr("width", W).attr("height", H);
    svg
      .selectAll("rect")
      .data(arrayPlus)
      .enter()
      .append("rect")
      .attr("x", (_, n: number) => n * (BAR_W + barGap))
      .attr("y", (d: number) => H - normalizeValue(d) * BAR_H)
      .attr("width", BAR_W)
      .attr("height", (d: number) => normalizeValue(d) * BAR_H)
      .attr("fill", (_, n) => {
        if (n === arrayPlus.length - 1) {
          return colors.temp;
        } else if (n == j) {
          return colors.compare;
        } else if (n == i) {
          return colors.focus;
        } else if (greens.includes(n)) {
          return colors.sorted;
        } else {
          return colors.base;
        }
      });

    if (arrayPlus.length < 30) {
      svg
        .selectAll("text")
        .data(arrayPlus)
        .enter()
        .append("text")
        .text((d: number) => d)
        .attr("text-anchor", "middle")
        .attr("x", (_, n) => n * (BAR_W + barGap) + BAR_W / 2)
        .attr("y", (d: number) => H - normalizeValue(d) * BAR_H + BAR_W / 1.5)
        .attr("font-size", () => `${Math.max(10, BAR_W / 2).toFixed(1)}px`)
        .attr("fill", labelColor)
        .attr("stroke", labelStroke)
        .attr("stroke-width", "1.8")
        .attr("font-weight", "700")
        .style("paint-order", "stroke fill")
        .style("stroke-linejoin", "round");
    }
  }

  async autoPlay(speedInputElement: HTMLInputElement): Promise<void> {
    if (this.film === null || this.playing || this.film.length === 0) return;
    this.playing = true;
    const currentFilm = this.film;
    while (this.playing && this.film === currentFilm) {
      this.show();
      if (currentFilm.isEnd) break;
      const speed = Number.parseInt(speedInputElement.value, 10);
      const normalizedSpeed = Number.isFinite(speed) && speed > 0 ? speed : 1;
      await sleep(2000 / Math.sqrt(normalizedSpeed));
      if (!this.playing || this.film !== currentFilm) break;
      currentFilm.forward();
    }
    this.playing = false;
  }

  stopPlay(): void {
    this.playing = false;
  }

  back(): void {
    if (this.film === null || this.film.isStart) return;
    this.film.back();
    this.show();
  }

  forward(): void {
    if (this.film === null || this.film.isEnd) return;
    this.film.forward();
    this.show();
  }
}
