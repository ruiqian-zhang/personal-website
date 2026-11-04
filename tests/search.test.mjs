import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { indexHtml } from "../scripts/search-index.mjs";

const exports = {};
const source = fs.readFileSync(new URL("../app/search-content.ts", import.meta.url), "utf8");
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText, { exports });
const { searchContent, suggestedContent } = exports;
const entries = [
  { href: "/projects/toby/", page: "TOBY", title: "TOBY: Self-Balancing Rover", text: "An ESP32 and SimpleFOC drive the robot." },
  { href: "/#about-heading", page: "About", title: "About Me", text: "Café hopping, robotics, and photography. 你好，我是张睿谦。" },
  { href: "/resume.pdf#page=1", page: "Resume", title: "Resume · PDF page 1", text: "C++ Altium Designer and KiCad. Experience with ESP32 hardware." },
];

test("searches body text and PDF text, with AND matching across terms", () => {
  assert.equal(searchContent(entries, "simplefoc")[0].href, "/projects/toby/");
  assert.equal(searchContent(entries, "C++ Altium")[0].href, "/resume.pdf#page=1");
  assert.equal(searchContent(entries, "Toby ESP32").length, 1);
  assert.equal(searchContent(entries, "Toby nonexistent").length, 0);
});

test("normalizes case, accents, repeated terms, and supports Chinese", () => {
  assert.equal(searchContent(entries, " CAFE cafe ").length, 1);
  assert.equal(searchContent(entries, "张睿谦").length, 1);
  assert.equal(searchContent(entries, "   ").length, 0);
  assert.equal(searchContent(entries, ".*[").length, 0);
});

test("ranks title matches above incidental body matches and reveals matching context", () => {
  const data = [
    { href: "/body/", page: "Other", title: "Notes", text: `${"Intro ".repeat(80)} TOBY at Cal Hacks ${"end ".repeat(80)}` },
    entries[0],
  ];
  const results = searchContent(data, "toby");
  assert.equal(results[0].href, "/projects/toby/");
  assert.match(results[1].snippet, /TOBY at Cal Hacks/);
  assert.ok(results[1].snippet.length < 200);
});

test("indexes rendered content and section anchors while excluding navigation and hidden duplicates", () => {
  const html = `<title>Example · Site</title><nav>Outside menu</nav><main>
    <h1>Example</h1><p>Intro &amp; overview.</p>
    <span class="typewriter-reserve">Hidden duplicate</span>
    <section aria-labelledby="hardware"><h2 id="hardware">Hardware</h2><p>ESP32 encoders</p><h3 id="day-2">Day 2</h3><p>Fixed motor wiring.</p></section>
    <nav>Internal menu</nav><script>secret code</script>
  </main><footer>Footer text</footer>`;
  const index = indexHtml(html, "/example/");
  assert.equal(index[0].text, "Intro & overview.");
  assert.equal(index[1].href, "/example/#hardware");
  assert.equal(index[2].href, "/example/#day-2");
  assert.ok(!JSON.stringify(index).match(/menu|secret|Footer|Hidden duplicate/));
});

test("project card results link to their detail page and respect a deployment base path", () => {
  const index = indexHtml('<main><h1>Projects</h1><ul><li><a href="/portfolio/projects/toby/"><h3>TOBY</h3><p>A robot</p></a></li></ul></main>', "/projects/", "/portfolio");
  assert.equal(index.find(entry => entry.title === "TOBY").href, "/projects/toby/");
});

test("home-page content is excluded from the search index", () => {
  assert.deepEqual(indexHtml('<main><h1>About</h1><h2>About Me</h2><p>Home-only biography</p></main>', "/"), []);
});

test("empty-search suggestions are unique page destinations without home or section duplicates", () => {
  const project = { ...entries[0], page: entries[0].title };
  const data = [project, project, entries[1], entries[2], { href: "/", page: "About", title: "About", text: "Bio" }, { href: "/resume/", page: "Resume", title: "Resume", text: "PDF" }];
  const suggestions = suggestedContent(data);
  assert.equal(suggestions.length, 2);
  assert.equal(suggestions[0].href, "/projects/toby/");
  assert.equal(suggestions[1].href, "/resume/");
});
