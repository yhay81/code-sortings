import type {
  MarkOperation,
  PythonRunResult,
  ReadOperation,
  TraceEvent,
  TraceFailure,
  TraceOperation,
  TraceResult,
  WriteOperation,
} from "./traceTimeline";

type EncodedRead = [0, number, number];
type EncodedWrite = [1, number, number, number];
type EncodedMark = [2, number, 0 | 1, 0 | 1];
type EncodedOperation = EncodedRead | EncodedWrite | EncodedMark;
type EncodedBranch = 0 | 1 | 2;
type EncodedEvent = [
  number,
  string,
  EncodedOperation[],
  0 | 1,
  string[],
  number,
  EncodedBranch,
  [string, string][],
];

interface EncodedTraceResult {
  v: 1;
  ok: 1;
  i: number[];
  f: number[];
  e: EncodedEvent[];
  c: number;
  r: number;
  s: 0 | 1;
  o: 0 | 1;
  p: 0 | 1;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === "number");

const decodeOperation = (value: unknown): TraceOperation | null => {
  if (!Array.isArray(value) || !Number.isInteger(value[0])) return null;
  const [type, index, first, second] = value;
  if (!Number.isInteger(index)) return null;

  if (type === 0 && typeof first === "number" && value.length === 3) {
    return { type: "read", index, value: first } satisfies ReadOperation;
  }
  if (
    type === 1 &&
    typeof first === "number" &&
    typeof second === "number" &&
    value.length === 4
  ) {
    return {
      type: "write",
      index,
      before: first,
      after: second,
    } satisfies WriteOperation;
  }
  if (
    type === 2 &&
    (first === 0 || first === 1) &&
    (second === 0 || second === 1) &&
    value.length === 4
  ) {
    return {
      type: "mark",
      index,
      before: first === 1,
      after: second === 1,
    } satisfies MarkOperation;
  }
  return null;
};

const decodeEvent = (value: unknown): TraceEvent | null => {
  if (!Array.isArray(value) || value.length !== 8) return null;
  const [
    line,
    functionName,
    encodedOperations,
    comparison,
    operators,
    comparisonCount,
    branch,
    noteEntries,
  ] = value;
  if (
    !Number.isInteger(line) ||
    typeof functionName !== "string" ||
    !Array.isArray(encodedOperations) ||
    (comparison !== 0 && comparison !== 1) ||
    !Array.isArray(operators) ||
    !operators.every((operator) => typeof operator === "string") ||
    !Number.isInteger(comparisonCount) ||
    (branch !== 0 && branch !== 1 && branch !== 2) ||
    !Array.isArray(noteEntries)
  ) {
    return null;
  }

  const operations = encodedOperations.map(decodeOperation);
  if (operations.some((operation) => operation === null)) return null;
  if (
    !noteEntries.every(
      (entry) =>
        Array.isArray(entry) &&
        entry.length === 2 &&
        typeof entry[0] === "string" &&
        typeof entry[1] === "string",
    )
  ) {
    return null;
  }

  return {
    line,
    function: functionName,
    operations: operations as TraceOperation[],
    comparison: comparison === 1,
    operators,
    comparisonCount,
    branch: branch === 1 ? "left" : branch === 2 ? "right" : null,
    notes: Object.fromEntries(noteEntries),
  };
};

const decodeEncodedResult = (
  value: Record<string, unknown>,
): TraceResult | null => {
  if (
    value.v !== 1 ||
    value.ok !== 1 ||
    !isNumberArray(value.i) ||
    !isNumberArray(value.f) ||
    !Array.isArray(value.e) ||
    !Number.isInteger(value.c) ||
    !Number.isInteger(value.r) ||
    (value.s !== 0 && value.s !== 1) ||
    (value.o !== 0 && value.o !== 1) ||
    (value.p !== 0 && value.p !== 1)
  ) {
    return null;
  }

  const events = value.e.map(decodeEvent);
  if (events.some((event) => event === null)) return null;
  const encoded = value as unknown as EncodedTraceResult;
  return {
    ok: true,
    initial: encoded.i,
    final: encoded.f,
    events: events as TraceEvent[],
    comparisons: encoded.c,
    rawSteps: encoded.r,
    sampled: encoded.s === 1,
    isSorted: encoded.o === 1,
    preservesValues: encoded.p === 1,
  };
};

const decodeFailure = (value: Record<string, unknown>): TraceFailure | null => {
  if (
    value.ok !== false ||
    typeof value.errorType !== "string" ||
    typeof value.message !== "string"
  ) {
    return null;
  }
  return {
    ok: false,
    errorType: value.errorType,
    message: value.message,
    ...(typeof value.traceback === "string"
      ? { traceback: value.traceback }
      : {}),
  };
};

export const decodePythonRunResult = (
  value: unknown,
): PythonRunResult | null => {
  if (!isRecord(value)) return null;
  if (value.ok === false) return decodeFailure(value);
  if (value.ok === 1) return decodeEncodedResult(value);
  return null;
};
