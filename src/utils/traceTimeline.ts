export interface ReadOperation {
  type: "read";
  index: number;
  value: number;
}

export interface WriteOperation {
  type: "write";
  index: number;
  before: number;
  after: number;
}

export interface MarkOperation {
  type: "mark";
  index: number;
  before: boolean;
  after: boolean;
}

export type TraceOperation = ReadOperation | WriteOperation | MarkOperation;

export interface TraceEvent {
  line: number;
  function: string;
  operations: TraceOperation[];
  comparison: boolean;
  operators: string[];
  comparisonCount: number;
  branch: "left" | "right" | null;
  notes: Record<string, string>;
}

export interface TraceResult {
  ok: true;
  initial: number[];
  final: number[];
  events: TraceEvent[];
  comparisons: number;
  rawSteps: number;
  sampled: boolean;
  isSorted: boolean;
  preservesValues: boolean;
}

export interface TraceFailure {
  ok: false;
  errorType: string;
  message: string;
  traceback?: string;
  events?: TraceEvent[];
}

export type PythonRunResult = TraceResult | TraceFailure;

export interface TracePicture {
  array: number[];
  reads: number[];
  writes: number[];
  sorted: number[];
  line: number;
  functionName: string;
  compares: number;
  comparison: boolean;
  operators: string[];
  notes: Record<string, string>;
}

export class TraceTimeline {
  private readonly initial: number[];

  private readonly events: TraceEvent[];

  private readonly array: number[];

  private readonly sortedIndices: Set<number>;

  private current: number;

  constructor(result: TraceResult) {
    this.initial = [...result.initial];
    this.array = [...result.initial];
    this.events = result.events;
    this.sortedIndices = new Set();
    this.current = 0;
  }

  public get picture(): TracePicture {
    const event = this.events[this.current - 1];
    if (!event) {
      return {
        array: [...this.array],
        reads: [],
        writes: [],
        sorted: [...this.sortedIndices],
        line: 0,
        functionName: "sort",
        compares: 0,
        comparison: false,
        operators: [],
        notes: {},
      };
    }
    return {
      array: [...this.array],
      reads: uniqueIndices(event.operations, "read"),
      writes: uniqueIndices(event.operations, "write"),
      sorted: [...this.sortedIndices],
      line: event.line,
      functionName: event.function,
      compares: event.comparisonCount,
      comparison: event.comparison,
      operators: event.operators,
      notes: event.notes,
    };
  }

  public get length(): number {
    return this.events.length + 1;
  }

  public get position(): number {
    return this.current;
  }

  public forward(): void {
    if (this.isEnd) return;
    this.apply(this.events[this.current], "forward");
    this.current++;
  }

  public back(): void {
    if (this.isStart) return;
    this.current--;
    this.apply(this.events[this.current], "backward");
  }

  public reset(): void {
    this.array.splice(0, this.array.length, ...this.initial);
    this.sortedIndices.clear();
    this.current = 0;
  }

  public get isEnd(): boolean {
    return this.current >= this.events.length;
  }

  public get isStart(): boolean {
    return this.current === 0;
  }

  public get totalCompares(): number {
    return this.events.at(-1)?.comparisonCount ?? 0;
  }

  private apply(event: TraceEvent, direction: "forward" | "backward"): void {
    const operations =
      direction === "forward"
        ? event.operations
        : [...event.operations].reverse();
    for (const operation of operations) {
      if (operation.type === "write") {
        this.array[operation.index] =
          direction === "forward" ? operation.after : operation.before;
      } else if (operation.type === "mark") {
        const marked =
          direction === "forward" ? operation.after : operation.before;
        if (marked) this.sortedIndices.add(operation.index);
        else this.sortedIndices.delete(operation.index);
      }
    }
  }
}

const uniqueIndices = (
  operations: TraceOperation[],
  type: "read" | "write",
): number[] => [
  ...new Set(
    operations
      .filter((operation) => operation.type === type)
      .map((operation) => operation.index),
  ),
];
