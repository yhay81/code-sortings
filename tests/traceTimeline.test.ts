import { describe, expect, test } from "bun:test";
import { TraceTimeline, type TraceResult } from "../src/utils/traceTimeline";

const result: TraceResult = {
  ok: true,
  initial: [3, 1, 2],
  final: [1, 2, 3],
  comparisons: 2,
  rawSteps: 2,
  sampled: false,
  isSorted: true,
  preservesValues: true,
  events: [
    {
      line: 2,
      function: "sort",
      operations: [
        { type: "read", index: 0, value: 3 },
        { type: "read", index: 1, value: 1 },
        { type: "write", index: 0, before: 3, after: 1 },
        { type: "write", index: 1, before: 1, after: 3 },
      ],
      comparison: true,
      operators: [">"],
      comparisonCount: 1,
      branch: "right",
      notes: {},
    },
    {
      line: 3,
      function: "sort",
      operations: [
        { type: "write", index: 1, before: 3, after: 2 },
        { type: "write", index: 2, before: 2, after: 3 },
        { type: "mark", index: 2, before: false, after: true },
      ],
      comparison: true,
      operators: [">"],
      comparisonCount: 2,
      branch: "right",
      notes: { pivot: "3" },
    },
  ],
};

describe("TraceTimeline", () => {
  test("applies and reverses delta events without snapshot copies", () => {
    const timeline = new TraceTimeline(result);

    expect(timeline.picture.array).toEqual([3, 1, 2]);
    timeline.forward();
    expect(timeline.picture.array).toEqual([1, 3, 2]);
    expect(timeline.picture.reads).toEqual([0, 1]);
    timeline.forward();
    expect(timeline.picture.array).toEqual([1, 2, 3]);
    expect(timeline.picture.sorted).toEqual([2]);
    expect(timeline.picture.notes).toEqual({ pivot: "3" });

    timeline.back();
    expect(timeline.picture.array).toEqual([1, 3, 2]);
    expect(timeline.picture.sorted).toEqual([]);
    timeline.back();
    expect(timeline.picture.array).toEqual([3, 1, 2]);
  });

  test("reset returns to the initial state", () => {
    const timeline = new TraceTimeline(result);
    timeline.forward();
    timeline.forward();

    timeline.reset();

    expect(timeline.isStart).toBe(true);
    expect(timeline.picture.array).toEqual([3, 1, 2]);
    expect(timeline.picture.compares).toBe(0);
  });

  test("seek moves directly in both directions", () => {
    const timeline = new TraceTimeline(result);

    timeline.seek(2);
    expect(timeline.position).toBe(2);
    expect(timeline.picture.array).toEqual([1, 2, 3]);

    timeline.seek(1);
    expect(timeline.position).toBe(1);
    expect(timeline.picture.array).toEqual([1, 3, 2]);

    timeline.seek(999);
    expect(timeline.position).toBe(2);
  });
});
