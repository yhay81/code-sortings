import type { PythonRunResult } from "./traceTimeline";
import { t } from "../i18n";
import { decodePythonRunResult } from "./traceWire";

interface RunnerReadyMessage {
  type: "ready";
  pythonVersion: string;
}

interface RunnerResultMessage {
  type: "result";
  id: number;
  result: unknown;
}

interface RunnerBootErrorMessage {
  type: "boot-error";
  message: string;
}

type RunnerMessage =
  | RunnerReadyMessage
  | RunnerResultMessage
  | RunnerBootErrorMessage;

interface ActiveRun {
  id: number;
  resolve: (result: PythonRunResult) => void;
  reject: (error: Error) => void;
  timer: number;
}

interface RunnerWorkerHandle {
  postMessage(message: unknown, transfer: Transferable[]): void;
  terminate(): void;
}

interface RunnerConnection {
  close(): void;
  postMessage(message: unknown): void;
}

export interface PythonRunnerEnvironment {
  clearTimeout(timer: number): void;
  connect(
    worker: RunnerWorkerHandle,
    onMessage: (data: unknown) => void,
  ): RunnerConnection;
  createWorker(): RunnerWorkerHandle;
  setTimeout(handler: () => void, timeoutMs: number): number;
}

interface PythonRunnerOptions {
  bootTimeoutMs?: number;
  environment?: PythonRunnerEnvironment;
}

const createBrowserEnvironment = (): PythonRunnerEnvironment => ({
  clearTimeout: (timer) => window.clearTimeout(timer),
  connect: (worker, onMessage) => {
    const channel = new MessageChannel();
    channel.port1.addEventListener(
      "message",
      (event: MessageEvent<unknown>) => {
        onMessage(event.data);
      },
    );
    channel.port1.start();
    worker.postMessage({ type: "connect", port: channel.port2 }, [
      channel.port2,
    ]);
    return {
      close: () => channel.port1.close(),
      postMessage: (message) => channel.port1.postMessage(message),
    };
  },
  createWorker: () =>
    new Worker("runner.worker.mjs", {
      type: "module",
    }),
  setTimeout: (handler, timeoutMs) => window.setTimeout(handler, timeoutMs),
});

export class PythonRunner {
  private readonly environment: PythonRunnerEnvironment;

  private readonly bootTimeoutMs: number;

  private worker: RunnerWorkerHandle | null = null;

  private connection: RunnerConnection | null = null;

  private readyPromise: Promise<void> | null = null;

  private resolveReady: (() => void) | null = null;

  private rejectReady: ((error: Error) => void) | null = null;

  private bootTimer: number | null = null;

  private activeRun: ActiveRun | null = null;

  private nextRunId = 1;

  public pythonVersion = "";

  public constructor(options: PythonRunnerOptions = {}) {
    this.environment = options.environment ?? createBrowserEnvironment();
    this.bootTimeoutMs = options.bootTimeoutMs ?? 30_000;
  }

  public warm(): Promise<void> {
    return this.ensureReady();
  }

  public async run(
    source: string,
    input: number[],
    options: {
      timeoutMs?: number;
      maxSteps?: number;
      maxFrames?: number;
    } = {},
  ): Promise<PythonRunResult> {
    this.cancel(t("runner.cancelled"));
    await this.ensureReady();

    const id = this.nextRunId++;
    const timeoutMs = options.timeoutMs ?? 15_000;
    const maxSteps = options.maxSteps ?? 200_000;
    const maxFrames = options.maxFrames ?? 5_000;
    return new Promise<PythonRunResult>((resolve, reject) => {
      const timer = this.environment.setTimeout(() => {
        if (this.activeRun?.id !== id) return;
        this.activeRun = null;
        this.disposeWorker();
        reject(
          new Error(
            t("runner.timeout", {
              seconds: Math.round(timeoutMs / 1000),
            }),
          ),
        );
      }, timeoutMs);
      this.activeRun = { id, resolve, reject, timer };
      this.connection?.postMessage({
        type: "run",
        id,
        source,
        input,
        maxSteps,
        maxFrames,
      });
    });
  }

  public cancel(message = t("runner.stopped")): void {
    if (!this.activeRun) return;
    const active = this.activeRun;
    this.activeRun = null;
    this.environment.clearTimeout(active.timer);
    this.disposeWorker();
    active.reject(new Error(message));
  }

  public dispose(): void {
    this.cancel();
    this.disposeWorker();
  }

  private ensureReady(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;

    this.worker = this.environment.createWorker();
    this.connection = this.environment.connect(this.worker, (data) => {
      this.handleMessage(data);
    });

    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
      this.bootTimer = this.environment.setTimeout(() => {
        this.rejectBoot(new Error(t("runner.bootTimeout")));
      }, this.bootTimeoutMs);
    });
    return this.readyPromise;
  }

  private handleMessage(data: unknown): void {
    if (!isRunnerMessage(data)) return;
    if (data.type === "ready") {
      if (this.bootTimer !== null) {
        this.environment.clearTimeout(this.bootTimer);
      }
      this.bootTimer = null;
      this.pythonVersion = data.pythonVersion;
      this.resolveReady?.();
      this.resolveReady = null;
      this.rejectReady = null;
      return;
    }
    if (data.type === "boot-error") {
      this.rejectBoot(new Error(data.message));
      return;
    }
    if (this.activeRun?.id !== data.id) return;
    const result = decodePythonRunResult(data.result);
    if (!result) return;
    const active = this.activeRun;
    this.activeRun = null;
    this.environment.clearTimeout(active.timer);
    active.resolve(result);
  }

  private rejectBoot(error: Error): void {
    if (this.bootTimer !== null) {
      this.environment.clearTimeout(this.bootTimer);
    }
    this.bootTimer = null;
    this.rejectReady?.(error);
    this.resolveReady = null;
    this.rejectReady = null;
    this.disposeWorker();
  }

  private disposeWorker(): void {
    if (this.bootTimer !== null) {
      this.environment.clearTimeout(this.bootTimer);
    }
    this.bootTimer = null;
    this.connection?.close();
    this.worker?.terminate();
    this.connection = null;
    this.worker = null;
    this.readyPromise = null;
    this.resolveReady = null;
    this.rejectReady = null;
    this.pythonVersion = "";
  }
}

const isRunnerMessage = (data: unknown): data is RunnerMessage => {
  if (typeof data !== "object" || data === null || !("type" in data)) {
    return false;
  }
  const type = (data as { type: unknown }).type;
  if (type === "ready") {
    return typeof (data as RunnerReadyMessage).pythonVersion === "string";
  }
  if (type === "boot-error") {
    return typeof (data as RunnerBootErrorMessage).message === "string";
  }
  if (type === "result") {
    const message = data as RunnerResultMessage;
    return (
      Number.isInteger(message.id) &&
      typeof message.result === "object" &&
      message.result !== null
    );
  }
  return false;
};
