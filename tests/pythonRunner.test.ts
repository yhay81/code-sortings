import { describe, expect, test } from "bun:test";
import {
  PythonRunner,
  type PythonRunnerEnvironment,
} from "../src/utils/pythonRunner";

class FakeWorker {
  public terminated = false;

  public postMessage(): void {}

  public terminate(): void {
    this.terminated = true;
  }
}

class FakeConnection {
  public readonly posted: unknown[] = [];

  public closed = false;

  public constructor(private readonly onMessage: (data: unknown) => void) {}

  public close(): void {
    this.closed = true;
  }

  public emit(data: unknown): void {
    this.onMessage(data);
  }

  public postMessage(message: unknown): void {
    this.posted.push(message);
  }
}

class FakeEnvironment implements PythonRunnerEnvironment {
  public readonly workers: FakeWorker[] = [];

  public readonly connections: FakeConnection[] = [];

  private readonly timers = new Map<number, () => void>();

  private nextTimer = 1;

  public clearTimeout(timer: number): void {
    this.timers.delete(timer);
  }

  public connect(
    _worker: FakeWorker,
    onMessage: (data: unknown) => void,
  ): FakeConnection {
    const connection = new FakeConnection(onMessage);
    this.connections.push(connection);
    return connection;
  }

  public createWorker(): FakeWorker {
    const worker = new FakeWorker();
    this.workers.push(worker);
    return worker;
  }

  public fireTimers(): void {
    const handlers = [...this.timers.values()];
    this.timers.clear();
    for (const handler of handlers) handler();
  }

  public setTimeout(handler: () => void): number {
    const timer = this.nextTimer++;
    this.timers.set(timer, handler);
    return timer;
  }
}

const ready = async (
  runner: PythonRunner,
  environment: FakeEnvironment,
): Promise<void> => {
  const warming = runner.warm();
  environment.connections.at(-1)?.emit({
    type: "ready",
    pythonVersion: "3.14.2",
  });
  await warming;
};

const successfulWireResult = {
  v: 1,
  ok: 1,
  i: [2, 1],
  f: [1, 2],
  e: [],
  c: 0,
  r: 0,
  s: 0,
  o: 1,
  p: 1,
};

describe("PythonRunner", () => {
  test("warms once and records the Python version", async () => {
    const environment = new FakeEnvironment();
    const runner = new PythonRunner({ environment });

    await ready(runner, environment);
    await runner.warm();

    expect(runner.pythonVersion).toBe("3.14.2");
    expect(environment.workers).toHaveLength(1);
  });

  test("posts runs and decodes compact results", async () => {
    const environment = new FakeEnvironment();
    const runner = new PythonRunner({ environment });
    await ready(runner, environment);

    const running = runner.run("def sort(array): pass", [2, 1], {
      maxFrames: 123,
      maxSteps: 456,
    });
    await Promise.resolve();
    const runMessage = environment.connections[0].posted[0] as {
      id: number;
      maxFrames: number;
      maxSteps: number;
    };
    environment.connections[0].emit({
      type: "result",
      id: runMessage.id,
      result: successfulWireResult,
    });

    await expect(running).resolves.toMatchObject({
      ok: true,
      final: [1, 2],
    });
    expect(runMessage).toMatchObject({ maxFrames: 123, maxSteps: 456 });
  });

  test("terminates and can reboot after a run timeout", async () => {
    const environment = new FakeEnvironment();
    const runner = new PythonRunner({ environment });
    await ready(runner, environment);

    const running = runner.run("while True: pass", [2, 1], {
      timeoutMs: 10,
    });
    await Promise.resolve();
    environment.fireTimers();

    await expect(running).rejects.toThrow();
    expect(environment.workers[0].terminated).toBe(true);

    const warmingAgain = runner.warm();
    expect(environment.workers).toHaveLength(2);
    environment.connections[1].emit({
      type: "ready",
      pythonVersion: "3.14.2",
    });
    await warmingAgain;
  });

  test("surfaces boot errors and disposes the worker", async () => {
    const environment = new FakeEnvironment();
    const runner = new PythonRunner({ environment });

    const warming = runner.warm();
    environment.connections[0].emit({
      type: "boot-error",
      message: "runtime unavailable",
    });

    await expect(warming).rejects.toThrow("runtime unavailable");
    expect(environment.connections[0].closed).toBe(true);
    expect(environment.workers[0].terminated).toBe(true);
  });

  test("times out a stalled boot", async () => {
    const environment = new FakeEnvironment();
    const runner = new PythonRunner({
      bootTimeoutMs: 10,
      environment,
    });

    const warming = runner.warm();
    environment.fireTimers();

    await expect(warming).rejects.toThrow();
    expect(environment.workers[0].terminated).toBe(true);
  });

  test("cancels an active run and terminates its worker", async () => {
    const environment = new FakeEnvironment();
    const runner = new PythonRunner({ environment });
    await ready(runner, environment);

    const running = runner.run("def sort(array): pass", [2, 1]);
    await Promise.resolve();
    runner.cancel("stopped for test");

    await expect(running).rejects.toThrow("stopped for test");
    expect(environment.connections[0].closed).toBe(true);
    expect(environment.workers[0].terminated).toBe(true);
  });
});
