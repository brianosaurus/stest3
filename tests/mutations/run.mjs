// C-5 MutationRunner: applies each defect from list.mjs to a disposable copy,
// reruns only the targeted spec, and asserts the mutation is caught (test fails).
import { mkdtemp, cp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import http from "node:http";
import { defects } from "./list.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");

function run(cmd, args, opts) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: opts.cwd, env: { ...process.env, ...opts.env }, stdio: "pipe" });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", (code) => resolve({ code, out }));
  });
}

// Applies the concrete source transform for each defect id, matching its
// textual `mutation` description in list.mjs.
const transforms = {
  "DI-1": (src) => src.replace("Hello, World!", "Hello World"),
  "DI-2": (src) => src.replace(/createRoot\(rootNode\)\.render\(<App \/>\);\s*/, ""),
  "DI-3": (src) => src.replace("<div>Hello, World!</div>", "<div>Hello, World!</div"),
  "DI-4": (src) => src.replace('id="root"', 'id="not-root"'),
  "DI-5": (src) => src.replace("Hello, World!", "hello, world!"),
  "DI-6": (src) =>
    "import { useState } from \"react\";\n" +
    src.replace(
      "export default function App() {\n  return <div>Hello, World!</div>;\n}",
      "export default function App() {\n  const [n, setN] = useState(0);\n  return <div onClick={() => setN(n + 1)}>Hello, World!{n > 0 ? \"!\" : \"\"}</div>;\n}",
    ),
};

async function setupCopy() {
  const dir = await mkdtemp(join(tmpdir(), "mutant-"));
  for (const entry of ["src", "index.html", "package.json", "vite.config.js", "vitest.config.js", "node_modules", "playwright.config.js", "tests"]) {
    await cp(join(repoRoot, entry), join(dir, entry), { recursive: true }).catch(() => {});
  }
  return dir;
}

async function runUnit(dir, spec) {
  return run("npx", ["vitest", "run", spec], { cwd: dir });
}

async function runBuild(dir) {
  return run("npx", ["vite", "build"], { cwd: dir });
}

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const ok = await new Promise((resolve) => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(true);
      });
      req.on("error", () => resolve(false));
      req.setTimeout(500, () => {
        req.destroy();
        resolve(false);
      });
    });
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

async function runBrowser(dir, spec, port) {
  const buildRes = await runBuild(dir);
  if (buildRes.code !== 0) {
    return { code: buildRes.code, out: buildRes.out, phase: "build" };
  }
  const preview = spawn(
    "npx",
    ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: dir, stdio: "pipe" },
  );
  try {
    const url = `http://127.0.0.1:${port}/`;
    const up = await waitForServer(url, 15000);
    if (!up) {
      return { code: 1, out: "preview server did not start", phase: "preview" };
    }
    const result = await run(
      "npx",
      ["playwright", "test", spec, "--config=playwright.config.js"],
      { cwd: dir, env: { PLAYWRIGHT_BASE_URL: url } },
    );
    return { code: result.code, out: result.out, phase: "browser" };
  } finally {
    preview.kill();
  }
}

async function main() {
  let allCaught = true;
  const results = [];
  let port = 4300;
  for (const d of defects) {
    const transform = transforms[d.id];
    if (!transform) {
      results.push({ id: d.id, caught: false, code: -1, note: "no transform defined" });
      allCaught = false;
      continue;
    }
    port += 1;
    const dir = await setupCopy();
    const filePath = join(dir, d.target);
    const original = await readFile(filePath, "utf8");
    const mutated = transform(original);
    await writeFile(filePath, mutated);

    let result;
    if (d.spec === "src/App.test.jsx") {
      result = await runUnit(dir, d.spec);
    } else {
      result = await runBrowser(dir, d.spec, port);
    }

    const caught = result.code !== 0;
    results.push({ id: d.id, caught, code: result.code });
    if (!caught) allCaught = false;
    await rm(dir, { recursive: true, force: true });
  }

  for (const r of results) {
    console.log(`${r.id}: ${r.caught ? "CAUGHT" : "SURVIVED"} (exit ${r.code})`);
  }

  if (!allCaught) {
    console.error("One or more mutants survived.");
    process.exit(1);
  }
  console.log("All mutants caught.");
  process.exit(0);
}

main();
