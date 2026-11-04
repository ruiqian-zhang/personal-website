import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the real header's navigation handlers with a delayed route commit.
function headerHarness() {
  let pathname = '/projects/mepad/';
  let open = false;
  let closes = 0;
  let layoutEffects = [];
  const refs = [];
  let refIndex = 0;
  const react = {
    useState: () => [open, value => { open = value; }],
    useRef: () => refs[refIndex++] ?? (refs[refIndex - 1] = { current: null }),
    useEffect: () => {},
    useLayoutEffect: fn => { layoutEffects.push(fn); },
  };
  const jsx = (type, props) => ({ type, props });
  const exports = {};
  const source = fs.readFileSync(new URL('../app/site-header.tsx', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(compiled, { exports, process: { env: {} }, require: name => {
    if (name === 'react') return react;
    if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
    if (name === 'next/navigation') return { usePathname: () => pathname };
    return { default: 'Link', SocialIcon: 'SocialIcon' };
  } });
  function render(path = pathname) {
    pathname = path;
    refIndex = 0;
    layoutEffects = [];
    const tree = exports.SiteHeader();
    const nodes = [];
    function walk(node) {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) return node.forEach(walk);
      nodes.push(node);
      walk(node.props?.children);
    }
    walk(tree);
    refs[1].current = { close() { closes++; } };
    return { nodes, commit: () => layoutEffects.forEach(fn => fn()) };
  }
  return { render, get open() { return open; }, get closes() { return closes; } };
}

test('mobile navigation keeps the current page covered until destination commit', () => {
  const h = headerHarness();
  let view = h.render();
  view.commit();
  view.nodes.find(n => n.props?.['aria-label'] === 'Open navigation').props.onClick();
  assert.equal(h.open, true);
  view = h.render();
  const destination = view.nodes.find(n => n.props?.href === '/resume/' && ('onNavigate' in n.props || 'onClick' in n.props));
  const before = h.closes;
  (destination.props.onNavigate ?? destination.props.onClick)();
  assert.equal(h.open, true, 'Pending route must stay covered');
  assert.equal(h.closes, before, 'Click must not close the dialog before route commit');
  view = h.render('/resume/');
  view.commit();
  assert.equal(h.open, false);
  assert.equal(h.closes, before + 1);
});

test('tapping the current mobile page dismisses the menu without a route change', () => {
  const h = headerHarness();
  let view = h.render('/projects/');
  view.commit();
  view.nodes.find(n => n.props?.['aria-label'] === 'Open navigation').props.onClick();
  view = h.render();
  const current = view.nodes.find(n => n.props?.href === '/projects/' && ('onNavigate' in n.props || 'onClick' in n.props));
  (current.props.onNavigate ?? current.props.onClick)();
  assert.equal(h.open, false);
});
