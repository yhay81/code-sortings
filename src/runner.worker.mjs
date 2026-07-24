import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.2/full/pyodide.mjs";

let privatePort = null;
let pyodide = null;
let runSort = null;

const send = (message) => {
  privatePort?.postMessage(message);
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
    resultProxy = runSort(message.source, inputProxy, message.maxSteps);
    const result = resultProxy.toJs({
      dict_converter: Object.fromEntries,
    });
    send({ type: "result", id: message.id, result });
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
