import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.mjs";

let privatePort = null;
let pyodide = null;
let runSort = null;

const send = (message) => {
  privatePort?.postMessage(message);
};

const encodeOperation = (operation) => {
  if (operation.type === "read") {
    return [0, operation.index, operation.value];
  }
  if (operation.type === "write") {
    return [1, operation.index, operation.before, operation.after];
  }
  return [
    2,
    operation.index,
    operation.before ? 1 : 0,
    operation.after ? 1 : 0,
  ];
};

const encodeResult = (result) => {
  if (!result?.ok) return result;
  return {
    v: 1,
    ok: 1,
    i: result.initial,
    f: result.final,
    e: result.events.map((event) => [
      event.line,
      event.function,
      event.operations.map(encodeOperation),
      event.comparison ? 1 : 0,
      event.operators,
      event.comparisonCount,
      event.branch === "left" ? 1 : event.branch === "right" ? 2 : 0,
      Object.entries(event.notes),
    ]),
    c: result.comparisons,
    r: result.rawSteps,
    s: result.sampled ? 1 : 0,
    o: result.isSorted ? 1 : 0,
    p: result.preservesValues ? 1 : 0,
  };
};

const boot = async () => {
  try {
    const runnerSourceUrl = new URL("./python/runner.py", import.meta.url);
    const [runtime, runnerResponse] = await Promise.all([
      loadPyodide(),
      fetch(runnerSourceUrl),
    ]);
    if (!runnerResponse.ok) {
      throw new Error("Pythonランナーを読み込めませんでした");
    }
    pyodide = runtime;
    pyodide.runPython(await runnerResponse.text(), {
      filename: "runner.py",
    });
    runSort = pyodide.globals.get("run_sort");
    const pythonVersion = pyodide.runPython(
      "import platform; platform.python_version()",
    );
    send({ type: "ready", pythonVersion });
  } catch (error) {
    send({
      type: "boot-error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

const execute = (message) => {
  if (!pyodide || !runSort) {
    send({
      type: "result",
      id: message.id,
      result: {
        ok: false,
        errorType: "RuntimeNotReady",
        message: "Pythonエンジンの準備が完了していません",
      },
    });
    return;
  }

  let inputProxy;
  let resultProxy;
  try {
    inputProxy = pyodide.toPy(message.input);
    resultProxy = runSort(
      message.source,
      inputProxy,
      message.maxSteps,
      message.maxFrames,
    );
    const result = resultProxy.toJs({
      dict_converter: Object.fromEntries,
    });
    send({ type: "result", id: message.id, result: encodeResult(result) });
  } catch (error) {
    send({
      type: "result",
      id: message.id,
      result: {
        ok: false,
        errorType: error?.name ?? "RunnerError",
        message: error?.message ?? String(error),
      },
    });
  } finally {
    resultProxy?.destroy?.();
    inputProxy?.destroy?.();
  }
};

self.addEventListener("message", (event) => {
  if (
    event.data?.type !== "connect" ||
    !(event.data.port instanceof MessagePort) ||
    privatePort
  ) {
    return;
  }
  privatePort = event.data.port;
  privatePort.addEventListener("message", (portEvent) => {
    if (portEvent.data?.type === "run") execute(portEvent.data);
  });
  privatePort.start();
  void boot();
});
