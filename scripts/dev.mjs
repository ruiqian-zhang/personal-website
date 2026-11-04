import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { createRequire } from "node:module";
import { buildSearchIndex } from "./search-index.mjs";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const portFlag = args.findIndex(arg => arg === "--port" || arg === "-p");
const port = portFlag >= 0 ? args[portFlag + 1] : process.env.PORT || "3000";
const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "--hostname", "127.0.0.1", ...args], { stdio: ["inherit", "pipe", "inherit"] });
let ready = false, running = false, dirty = false, timer;
async function update() {
  if (!ready) return;
  if (running) { dirty = true; return; }
  running = true;
  try { await buildSearchIndex({ origin: `http://127.0.0.1:${port}` }); }
  catch (error) { console.error("Search index update failed:", error.message); }
  finally { running = false; if (dirty) { dirty = false; schedule(); } }
}
function schedule() { clearTimeout(timer); timer = setTimeout(update, 500); }
server.stdout.on("data", data => {
  process.stdout.write(data);
  if (!ready && /Ready in/.test(data.toString())) { ready = true; schedule(); }
});
const watchers = [watch("app", { recursive: true }, (_, name) => { if (/\.(tsx?|mdx)$/.test(name || "")) schedule(); }), watch("public", (_, name) => { if (name?.endsWith(".pdf")) schedule(); })];
server.on("exit", code => { watchers.forEach(watcher => watcher.close()); clearTimeout(timer); process.exit(code ?? 0); });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.kill(signal));
