// Debug build runner to gather runtime evidence for build hangs
// #region agent log helper
const endpoint = "http://127.0.0.1:7243/ingest/6e3a5d9e-b46c-47e1-8002-35ec6dade79b";
const sessionId = "debug-session";
const runId = `build-${Date.now()}`;
const log = async (hypothesisId, message, data = {}) => {
  const payload = {
    sessionId,
    runId,
    hypothesisId,
    location: "scripts/debug-build.js",
    message,
    data,
    timestamp: Date.now(),
  };
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (_) {
    // swallow to avoid affecting build
  }
};
// #endregion

const { spawnSync } = require("node:child_process");

const steps = [
  { name: "tsc", cmd: "npx", args: ["tsc", "-b", "--pretty", "false"], hypothesisId: "H1" },
  { name: "vite", cmd: "npx", args: ["vite", "build", "--clearScreen", "false"], hypothesisId: "H2" },
];

(async () => {
  await log("H0", "build_start");
  for (const step of steps) {
    const started = Date.now();
    await log(step.hypothesisId, `${step.name}_start`, { args: step.args });
    const result = spawnSync(step.cmd, step.args, { encoding: "utf8" });
    const durationMs = Date.now() - started;
    await log(step.hypothesisId, `${step.name}_end`, {
      exitCode: result.status,
      signal: result.signal,
      durationMs,
      stderrSample: (result.stderr || "").slice(0, 300),
      stdoutSample: (result.stdout || "").slice(0, 300),
    });
    if (result.status !== 0) {
      await log(step.hypothesisId, `${step.name}_failed_abort`, { exitCode: result.status });
      process.exit(result.status ?? 1);
    }
  }
  await log("H0", "build_complete");
})();

