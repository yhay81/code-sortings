import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { setLocale } from "../src/i18n";
import { explainOperation } from "../src/utils/operationExplanation";
import type { TracePicture } from "../src/utils/traceTimeline";

const picture = (overrides: Partial<TracePicture> = {}): TracePicture => ({
  array: [3, 1, 2],
  reads: [],
  writes: [],
  readOperations: [],
  writeOperations: [],
  markOperations: [],
  sorted: [],
  line: 0,
  functionName: "sort",
  compares: 0,
  comparison: false,
  operators: [],
  notes: {},
  ...overrides,
});

describe("operation explanations", () => {
  beforeEach(() => setLocale("en", false));
  afterEach(() => setLocale("ja", false));

  test("describes the initial array", () => {
    expect(explainOperation(picture())).toEqual({
      kind: "Starting point",
      title: "This is the array before execution",
      detail: "Press Play or move the timeline to follow each change.",
    });
  });

  test("recognizes a two-write swap", () => {
    const explanation = explainOperation(
      picture({
        line: 4,
        writes: [0, 1],
        writeOperations: [
          { type: "write", index: 0, before: 3, after: 1 },
          { type: "write", index: 1, before: 1, after: 3 },
        ],
      }),
    );

    expect(explanation.kind).toBe("Swap values");
    expect(explanation.title).toBe("Swapped array[0] and array[1]");
    expect(explanation.detail).toContain("3 ↔ 1");
    expect(explanation.detail).toContain("sort() · line 4");
  });

  test("includes comparison values and notes", () => {
    const explanation = explainOperation(
      picture({
        line: 7,
        comparison: true,
        operators: [">"],
        notes: { pivot: "2" },
        reads: [0, 2],
        readOperations: [
          { type: "read", index: 0, value: 3 },
          { type: "read", index: 2, value: 2 },
        ],
      }),
    );

    expect(explanation.kind).toBe("Compare values");
    expect(explanation.title).toBe("Compared array[0] and array[2] with “>”");
    expect(explanation.detail).toContain("3 > 2");
    expect(explanation.detail).toContain("pivot = 2");
  });

  test("prioritizes newly sorted positions", () => {
    const explanation = explainOperation(
      picture({
        line: 8,
        markOperations: [
          { type: "mark", index: 2, before: false, after: true },
        ],
        sorted: [2],
      }),
    );

    expect(explanation.kind).toBe("Position settled");
    expect(explanation.title).toBe("Marked array[2] as sorted");
  });
});
