import { describe, expect, test } from "bun:test";
import { decodePythonRunResult } from "../src/utils/traceWire";

describe("trace wire format", () => {
  test("decodes compact worker results", () => {
    const result = decodePythonRunResult({
      v: 1,
      ok: 1,
      i: [2, 1],
      f: [1, 2],
      e: [
        [
          2,
          "sort",
          [
            [0, 0, 2],
            [1, 0, 2, 1],
            [2, 1, 0, 1],
          ],
          1,
          [">"],
          1,
          2,
          [["pivot", "2"]],
        ],
      ],
      c: 1,
      r: 3,
      s: 1,
      o: 1,
      p: 1,
    });

    expect(result).toEqual({
      ok: true,
      initial: [2, 1],
      final: [1, 2],
      events: [
        {
          line: 2,
          function: "sort",
          operations: [
            { type: "read", index: 0, value: 2 },
            { type: "write", index: 0, before: 2, after: 1 },
            { type: "mark", index: 1, before: false, after: true },
          ],
          comparison: true,
          operators: [">"],
          comparisonCount: 1,
          branch: "right",
          notes: { pivot: "2" },
        },
      ],
      comparisons: 1,
      rawSteps: 3,
      sampled: true,
      isSorted: true,
      preservesValues: true,
    });
  });

  test("rejects malformed results", () => {
    expect(decodePythonRunResult({ ok: 1, v: 1, e: "invalid" })).toBeNull();
    expect(
      decodePythonRunResult({ ok: false, message: "missing type" }),
    ).toBeNull();
  });
});
