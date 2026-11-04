"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { searchContent, suggestedContent, type SearchEntry } from "./search-content";

export function SearchButton({ className = "" }: { className?: string }) {
  return <button type="button" className={`search-trigger ${className}`} aria-label="Search website" aria-haspopup="dialog" aria-keyshortcuts="Control+k Meta+k" onClick={() => window.dispatchEvent(new Event("site-search-open"))}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
    <span className="search-shortcut" aria-hidden="true">⌘ / Ctrl K</span>
  </button>;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = query.trim().split(/\s+/).filter(Boolean).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!terms.length) return text;
  const pattern = new RegExp(`(${terms.join("|")})`, "giu");
  return text.split(pattern).map((part, index) => index % 2 ? <mark key={index}>{part}</mark> : part);
}

export function SiteSearch() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const resultsList = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [active, setActive] = useState(0);
  const hasQuery = Boolean(query.trim());
  const results = hasQuery ? searchContent(entries, query) : suggestedContent(entries);
  const noResults = hasQuery && status === "ready" && results.length === 0;

  function close() {
    dialog.current?.close();
    setOpen(false);
  }

  useLayoutEffect(() => {
    if (previousPath.current !== pathname) { previousPath.current = pathname; close(); }
  }, [pathname]);

  useEffect(() => {
    const show = () => { setQuery(""); setActive(0); setOpen(true); };
    const shortcut = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) close(); else show();
      }
    };
    window.addEventListener("site-search-open", show);
    window.addEventListener("keydown", shortcut);
    return () => {
      window.removeEventListener("site-search-open", show);
      window.removeEventListener("keydown", shortcut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    input.current?.focus({ preventScroll: true });
    const controller = new AbortController();
    setStatus("loading");
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/search-index.json`, { signal: controller.signal, cache: "no-cache" })
      .then(response => {
        if (!response.ok) throw new Error("Search index unavailable");
        return response.json();
      })
      .then((data: SearchEntry[]) => { if (!Array.isArray(data)) throw new Error("Invalid search index"); setEntries(data.filter(entry => entry && typeof entry.href === "string" && entry.href.startsWith("/") && !entry.href.startsWith("//") && typeof entry.title === "string" && typeof entry.page === "string" && typeof entry.text === "string")); setStatus("ready"); })
      .catch(error => { if (error.name !== "AbortError") setStatus("error"); });
    return () => controller.abort();
  }, [open]);

  useEffect(() => {
    resultsList.current?.querySelectorAll("a")[active]?.scrollIntoView({ block: "nearest" });
  }, [active, query]);

  function keys(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape" && !event.nativeEvent.isComposing) { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (event.key === "Tab") {
      const controls = event.currentTarget.querySelectorAll<HTMLElement>("input,button,a[href]");
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.target !== input.current || event.nativeEvent.isComposing) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length) setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    } else if (event.key === "Enter" && results.length && status === "ready") {
      event.preventDefault();
      resultsList.current?.querySelectorAll("a")[active]?.click();
    }
  }

  function select(href: string) {
    // A search may have been opened over the mobile menu.
    window.dispatchEvent(new Event("site-search-navigate"));
    const destination = href.split("#")[0].replace(/\/$/, "") || "/";
    const current = pathname.replace(/\/$/, "") || "/";
    if (destination === current || href.split("#")[0].endsWith(".pdf")) close();
  }

  return <dialog ref={dialog} className="site-search" aria-labelledby="site-search-title" onKeyDown={keys} onCancel={event => { event.preventDefault(); close(); }} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="search-panel" data-expanded={hasQuery} data-empty={noResults} data-suggestions={!hasQuery}>
      <div className="search-header">
        <h2 id="site-search-title">Quick access <span className="search-keycaps" aria-label="Control plus K"><kbd>Ctrl</kbd><span aria-hidden="true">+</span><kbd>K</kbd></span></h2>
        <button type="button" className="search-close" aria-label="Close search" onClick={close}>×</button>
      </div>
      <label className="sr-only" htmlFor="site-search-input">Search all website content</label>
      <input ref={input} id="site-search-input" type="search" role="combobox" autoComplete="off" spellCheck={false} aria-autocomplete="list" aria-expanded={status === "ready" && results.length > 0} aria-controls="site-search-results" aria-activedescendant={status === "ready" && results[active] ? `search-result-${active}` : undefined} placeholder="Search projects, skills, resume…" value={query} onChange={event => { setQuery(event.target.value); setActive(0); }} />
      {(hasQuery || status === "error") && <p className={`search-status${noResults ? " search-empty" : ""}`} role="status" aria-live="polite">{status === "error" ? "Search couldn’t load. Close and reopen to retry." : status === "loading" ? "Loading search…" : results.length ? `${results.length} ${results.length === 1 ? "result" : "results"}` : <><strong>No results found</strong><span>Try different keywords</span></>}</p>}
      {!hasQuery && status === "ready" && results.length > 0 && <p className="search-suggestions-label">Suggested</p>}
      <div ref={resultsList} id="site-search-results" className="search-results" role="listbox" aria-label="Search results" aria-busy={status === "loading"}>
        {status === "ready" && results.map((result, index) => {
          const pdf = result.href.split("#")[0].endsWith(".pdf");
          const ResultLink = pdf ? "a" : Link;
          return <ResultLink key={`${result.href}-${result.title}`} id={`search-result-${index}`} className="search-result" href={pdf ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${result.href}` : result.href} role="option" aria-selected={active === index} {...(pdf ? { onClick: () => select(result.href) } : { onNavigate: () => select(result.href) })} onMouseEnter={() => setActive(index)}>
          {hasQuery && <span className="search-result-page">{result.page}</span>}
          <strong><Highlight text={result.title} query={query} /></strong>
          {hasQuery && <span className="search-result-snippet"><Highlight text={result.snippet} query={query} /></span>}
        </ResultLink>; })}
      </div>
    </div>
  </dialog>;
}
