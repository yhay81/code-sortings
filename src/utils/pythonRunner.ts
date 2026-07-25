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

export class PythonRunner {
  private worker: Worker | null = null;

  private port: MessagePort | null = null;

  private readyPromise: Promise<void> | null = null;

  private resolveReady: (() => void) | null = null;

  private rejectReady: ((error: Error) => void) | null = null;

  private bootTimer: number | null = null;

  private activeRun: ActiveRun | null = null;

  private nextRunId = 1;

  public pythonVersion = "";

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
      const timer = window.setTimeout(() => {
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
      this.port?.postMessage({
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
    window.clearTimeout(active.timer);
    this.disposeWorker();
    active.reject(new Error(message));
  }

  public dispose(): void {
    this.cancel();
    this.disposeWorker();
  }

  private ensureReady(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;

    this.worker = new Worker("runner.worker.mjs", { type: "module" });
    const channel = new MessageChannel();
    this.port = channel.port1;
    this.port.addEventListener("message", (event: MessageEvent<unknown>) => {
      this.handleMessage(event.data);
    });
    this.port.start();
    this.worker.postMessage({ type: "connect", port: channel.port2 }, [
      channel.port2,
    ]);

    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
      this.bootTimer = window.setTimeout(() => {
        this.rejectBoot(new Error(t("runner.bootTimeout")));
      }, 30_000);
    });
    return this.readyPromise;
  }

  private handleMessage(data: unknown): void {
    if (!isRunnerMessage(data)) return;
    if (data.type === "ready") {
      if (this.bootTimer !== null) window.clearTimeout(this.bootTimer);
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
    window.clearTimeout(active.timer);
    active.resolve(result);
  }

  private rejectBoot(error: Error): void {
    if (this.bootTimer !== null) window.clearTimeout(this.bootTimer);
    this.bootTimer = null;
    this.rejectReady?.(error);
    this.resolveReady = null;
    this.rejectReady = null;
    this.disposeWorker();
  }

  private disposeWorker(): void {
    if (this.bootTimer !== null) window.clearTimeout(this.bootTimer);
    this.bootTimer = null;
    this.port?.close();
    this.worker?.terminate();
    this.port = null;
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
