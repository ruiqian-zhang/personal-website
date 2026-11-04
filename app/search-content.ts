export type SearchEntry = { href: string; page: string; title: string; text: string };
export type SearchResult = SearchEntry & { snippet: string; score: number };

const normalize = (text: string) => text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();

export function searchContent(entries: SearchEntry[], query: string): SearchResult[] {
  const terms = [...new Set(normalize(query).trim().split(/\s+/).filter(Boolean))];
  if (!terms.length) return [];
  return entries.flatMap(entry => {
    const title = normalize(entry.title);
    const page = normalize(entry.page);
    const body = normalize(entry.text);
    if (!terms.every(term => `${title} ${page} ${body}`.includes(term))) return [];
    const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 12 : 0) + (page.includes(term) ? 4 : 0) + (body.includes(term) ? 1 : 0), 0);
    const positions = terms.map(term => body.indexOf(term)).filter(index => index >= 0);
    const match = positions.length ? Math.min(...positions) : 0;
    let start = Math.max(0, match - 55);
    if (start) start = entry.text.lastIndexOf(" ", start) + 1;
    const snippet = (start ? "…" : "") + entry.text.slice(start, start + 190).trim() + (start + 190 < entry.text.length ? "…" : "");
    return [{ ...entry, snippet, score }];
  }).sort((a, b) => b.score - a.score || a.page.localeCompare(b.page));
}

export function suggestedContent(entries: SearchEntry[]): SearchResult[] {
  const pages = new Map<string, SearchEntry>();
  for (const entry of entries) {
    if (entry.href !== "/" && !entry.href.includes("#") && entry.title === entry.page) pages.set(entry.href, entry);
  }
  const priority = (href: string) => /^\/projects\/.+/.test(href) ? 0 : href === "/resume/" ? 1 : href === "/projects/" ? 2 : 3;
  return [...pages.values()].sort((a, b) => priority(a.href) - priority(b.href)).slice(0, 6).map(entry => ({ ...entry, snippet: "", score: 0 }));
}
