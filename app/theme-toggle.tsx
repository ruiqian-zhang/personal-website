"use client";

import { useEffect, useState } from "react";

type ThemePreference = "system" | "light" | "dark";

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("rhema-theme"); } catch { /* Use system preference if storage is unavailable. */ }
    setPreference(saved === "light" || saved === "dark" ? saved : "system");
  }, []);

  useEffect(() => {
    if (preference === null) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      document.documentElement.dataset.theme = preference === "system"
        ? (media.matches ? "dark" : "light")
        : preference;
    };
    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [preference]);

  function selectTheme(next: ThemePreference) {
    setPreference(next);
    try { localStorage.setItem("rhema-theme", next); } catch { /* Selection still works without storage. */ }
  }

  return (
    <div className="theme-selector" role="group" aria-label="Color theme">
      <button type="button" onClick={() => selectTheme("system")} aria-label="Use system theme" aria-pressed={preference === "system"} title="System theme">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
      </button>
      <button type="button" onClick={() => selectTheme("light")} aria-label="Use light theme" aria-pressed={preference === "light"} title="Light theme">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
      </button>
      <button type="button" onClick={() => selectTheme("dark")} aria-label="Use dark theme" aria-pressed={preference === "dark"} title="Dark theme">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.7 13.3A9 9 0 0 1 10.7 3.3a9 9 0 1 0 10 10Z"/></svg>
      </button>
    </div>
  );
}
