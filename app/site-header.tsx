"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 601px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" ref={headerRef} data-menu-open={menuOpen}>
      <Link href="/" className="wordmark" aria-label="Ruiqian Zhang, home" onClick={() => setMenuOpen(false)}>
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.svg`} width="40" height="40" alt="" aria-hidden="true" />
      </Link>
      <button ref={toggleRef} type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>
        <span>{menuOpen ? "Close" : "Menu"}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          {menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      <div className="header-right" id="main-navigation">
        <nav aria-label="Main navigation">
          {[["/", "About"], ["/resume/", "Resume"], ["/projects/", "Projects"], ["/blogs/", "Blogs"]].map(([href, label]) => {
            const currentPath = pathname.replace(/\/$/, "") || "/";
            const targetPath = href.replace(/\/$/, "") || "/";
            const exact = currentPath === targetPath;
            const section = targetPath !== "/" && currentPath.startsWith(`${targetPath}/`);
            return <Link key={href} href={href} aria-current={exact ? "page" : section ? "location" : undefined} onClick={() => setMenuOpen(false)}>{label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}
