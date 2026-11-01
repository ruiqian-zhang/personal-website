import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync(new URL("../app/typewriter-state.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
vm.runInNewContext(compiled, { exports });
const { advanceTypewriter, greetings } = exports;
const initialState = () => ({ phrase: 0, length: 0, deleting: false });

test("types each English character individually with varied timing, then pauses", () => {
  let state = initialState();
  const timing = new Set();
  for (let length = 1; length <= Array.from(greetings[0].text).length; length++) {
    const result = advanceTypewriter(state);
    assert.equal(result.text, Array.from(greetings[0].text).slice(0, length).join(""));
    if (length < Array.from(greetings[0].text).length) timing.add(result.delay);
    else {
      assert.ok(result.delay >= 2000);
      assert.equal(result.state.deleting, true);
    }
    state = result.state;
  }
  assert.ok(timing.size > 3, "Typing must have a varied rhythm");
});

test("deletes the whole English greeting before typing Chinese", () => {
  let state = { phrase: 0, length: Array.from(greetings[0].text).length, deleting: true };
  for (let length = state.length - 1; length >= 0; length--) {
    const result = advanceTypewriter(state);
    assert.equal(result.text, Array.from(greetings[0].text).slice(0, length).join(""));
    state = result.state;
  }
  assert.equal(state.phrase, 1);
  assert.equal(state.length, 0);
  const firstChinese = advanceTypewriter(state);
  assert.equal(firstChinese.text, "你");
  assert.equal(firstChinese.language, "zh-Hans");
});

test("holds the Chinese greeting longer and deletes its characters more slowly", () => {
  const englishEnd = advanceTypewriter({ phrase: 0, length: Array.from(greetings[0].text).length - 1, deleting: false });
  const chineseEnd = advanceTypewriter({ phrase: 1, length: Array.from(greetings[1].text).length - 1, deleting: false });
  assert.equal(chineseEnd.text, "你好，我是张睿谦。");
  assert.equal(chineseEnd.delay, 4500);
  assert.ok(chineseEnd.delay > englishEnd.delay);
  const englishDelete = advanceTypewriter({ phrase: 0, length: 5, deleting: true });
  const chineseDelete = advanceTypewriter({ phrase: 1, length: 5, deleting: true });
  assert.equal(chineseDelete.delay, englishDelete.delay * 2);
});

test("completes the exact Chinese greeting and returns to English on every cycle", () => {
  let state = initialState();
  const completed = [];
  for (let step = 0; step < 350; step++) {
    const result = advanceTypewriter(state);
    if (!state.deleting && result.state.deleting) completed.push(result.text);
    state = result.state;
  }
  assert.ok(completed.length >= 6, "The sequence should loop repeatedly");
  for (let index = 0; index < completed.length; index++) {
    assert.equal(completed[index], index % 2 === 0 ? "Hi, I’m Rhema Zhang." : "你好，我是张睿谦。");
  }
});
