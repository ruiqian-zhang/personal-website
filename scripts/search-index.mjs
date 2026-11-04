import { load } from "cheerio";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clean = text => text.replace(/\s+/g, " ").trim();

export function indexHtml(html, href, basePath = "") {
  if (href.split("#")[0] === "/") return [];
  const $ = load(html);
  const main = $("main").clone();
  main.find("script, style, nav, dialog, noscript, [hidden], .typewriter-reserve, .typewriter-text").remove();
  const page = (href === "/" ? "About" : clean(main.find("h1").first().text())) || clean($("title").text().split(" · ")[0]);
  if (!page) throw new Error(`Missing page title: ${href}`);
  const entries = [];
  let current = { href, page, title: page, text: "" };
  const flush = () => {
    if (current.text || current.title) entries.push({ ...current, text: clean(current.text) });
  };
  function append(text) {
    const value = clean(text);
    if (value && !current.text.endsWith(` ${value}`)) current.text += ` ${value}`;
  }
  function visit(element) {
    if (element.type === "text") { append(element.data); return; }
    const node = $(element);
    if (/^h[1-6]$/.test(element.tagName || "")) {
      const title = clean(node.text());
      if (!title) return;
      if (element.tagName !== "h1") {
        flush();
        const anchor = node.attr("id") || node.closest("section[aria-labelledby]").attr("aria-labelledby");
        const cardHref = node.closest("a[href]").attr("href");
        const destination = cardHref?.startsWith("/") ? (basePath && cardHref.startsWith(basePath + "/") ? cardHref.slice(basePath.length) : cardHref) : href + (anchor ? `#${anchor}` : "");
        current = { href: destination, page, title, text: "" };
      }
      return;
    }
    if (element.tagName === "img") append(node.attr("alt") || "");
    for (const child of element.children || []) visit(child);
  }
  for (const child of main[0]?.children || []) visit(child);
  flush();
  return entries;
}

async function routes(directory = path.join(root, "app"), segments = []) {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith("@")) {
      result.push(...await routes(path.join(directory, entry.name), [...segments, entry.name]));
    } else if (entry.name === "page.tsx") {
      result.push("/" + segments.join("/") + (segments.length ? "/" : ""));
    }
  }
  return result;
}

export async function buildSearchIndex({ origin } = {}) {
  const index = [];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pages = (await routes()).filter(href => href !== "/");
  for (const href of pages) {
    let html;
    if (origin) {
      const response = await fetch(`${origin}${basePath}${href}`);
      if (!response.ok) throw new Error(`Cannot index ${href}: ${response.status}`);
      html = await response.text();
    } else {
      html = await fs.readFile(path.join(root, "out", href.slice(1), "index.html"), "utf8");
    }
    index.push(...indexHtml(html, href, basePath));
  }

  // PDF extraction happens only in Node; visitors download a small text index.
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = getDocument({
    data: new Uint8Array(await fs.readFile(path.join(root, "public", "Ruiqian_Zhang_Resume.pdf"))),
    useSystemFonts: true,
    isEvalSupported: false,
  });
  const pdf = await loadingTask.promise;
  try {
    for (let number = 1; number <= pdf.numPages; number++) {
      const content = await (await pdf.getPage(number)).getTextContent();
      const text = clean(content.items.filter(item => "str" in item).map(item => item.str).join(" "));
      if (!text) throw new Error(`Resume page ${number} has no searchable text`);
      index.push({ href: `/Ruiqian_Zhang_Resume.pdf#page=${number}`, page: "Resume", title: `Resume · PDF page ${number}`, text });
    }
  } finally {
    await loadingTask.destroy();
  }
  const unique = new Map();
  for (const entry of index) {
    const key = `${entry.href}|${entry.title}`;
    if (!unique.has(key) || unique.get(key).text.length < entry.text.length) unique.set(key, entry);
  }
  const json = JSON.stringify([...unique.values()]);
  await fs.writeFile(path.join(root, "public", "search-index.json"), json);
  if (!origin) await fs.writeFile(path.join(root, "out", "search-index.json"), json);
  console.log(`Search index: ${pages.length} pages + resume, ${unique.size} sections (${Math.ceil(Buffer.byteLength(json) / 1024)} KB).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const originIndex = process.argv.indexOf("--origin");
  await buildSearchIndex({ origin: originIndex >= 0 ? process.argv[originIndex + 1] : undefined });
}
