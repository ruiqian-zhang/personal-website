"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SocialIcon } from "./social-icon";
import { MenuLettering } from "./menu-lettering";
import { SearchButton } from "./site-search";

const navigation = [["/", "About"], ["/resume/", "Resume"], ["/projects/", "Projects"], ["/blogs/", "Blogs"]] as const;

function MenuIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path className="menu-icon-line menu-icon-top" d="M4 8h16" />
    <path className="menu-icon-line menu-icon-bottom" d="M4 16h16" />
  </svg>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    dialogRef.current?.close();
    setMenuOpen(false);
  }

  function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function currentSection(href: string): "page" | "location" | undefined {
    const currentPath = pathname.replace(/\/$/, "") || "/";
    const targetPath = href.replace(/\/$/, "") || "/";
    if (currentPath === targetPath) return "page";
    if (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`)) return "location";
  }

  useEffect(() => {
    window.addEventListener("site-search-navigate", closeMenu);
    return () => window.removeEventListener("site-search-navigate", closeMenu);
  }, []);

  // Keep the current page covered until the destination has committed.
  useLayoutEffect(() => { closeMenu(); }, [pathname]);

  function navigateFromMenu(href: string) {
    if ((pathname.replace(/\/$/, "") || "/") === (href.replace(/\/$/, "") || "/")) closeMenu();
  }

  useEffect(() => {
    if (!menuOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const desktop = window.matchMedia("(min-width: 601px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    const rootOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      dialog.close();
      document.documentElement.style.overflow = rootOverflow;
      document.body.style.overflow = bodyOverflow;
      if (desktop.matches) {
        document.querySelector<HTMLAnchorElement>(".site-header .wordmark")?.focus({ preventScroll: true });
      }
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Ruiqian Zhang, home">
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.svg`} width="40" height="40" alt="" aria-hidden="true" />
      </Link>
      <SearchButton className="mobile-search-trigger" />
      <button ref={toggleRef} type="button" className="menu-toggle" data-open={menuOpen} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-haspopup="dialog" aria-label="Open navigation" onClick={() => setMenuOpen(true)}>
        <MenuIcon />
      </button>
      <div className="header-right">
        <nav aria-label="Main navigation">
          {navigation.map(([href, label]) => <Link key={href} href={href} aria-current={currentSection(href)}>{label}</Link>)}
        </nav>
      </div>
      <dialog ref={dialogRef} id="mobile-navigation" className="mobile-menu" aria-label="Site navigation" onKeyDown={keepFocusInside} onCancel={event => { event.preventDefault(); closeMenu(); }} onClose={event => { if (!event.currentTarget.open) setMenuOpen(false); }}>
        <div className="mobile-menu-inner">
          <div className="mobile-menu-header">
            <Link href="/" className="wordmark" aria-label="Ruiqian Zhang, home" onNavigate={() => navigateFromMenu("/")}>
              <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.svg`} width="40" height="40" alt="" aria-hidden="true" />
            </Link>
            <button ref={closeRef} type="button" className="menu-toggle" data-open={menuOpen} aria-label="Close navigation" onClick={closeMenu}>
              <MenuIcon />
            </button>
          </div>
          <nav className="mobile-menu-nav" aria-label="Main navigation">
            {navigation.map(([href, label]) => <Link key={href} href={href} aria-label={label} aria-current={currentSection(href)} onNavigate={() => navigateFromMenu(href)}>
              <MenuLettering label={label} corner={href === "/" ? "start" : href === "/blogs/" ? "end" : undefined} />
            </Link>)}
          </nav>
          <div className="mobile-menu-footer">
            <nav className="social-links" aria-label="Social links">
              <a href="mailto:rhema@vt.edu" aria-label="Email rhema@vt.edu" title="Email"><SocialIcon name="email" /></a>
              <a href="https://x.com/rhemazhang" target="_blank" rel="noopener noreferrer" aria-label="Rhema Zhang on X" title="X"><SocialIcon name="x" /></a>
              <a href="https://github.com/ruiqian-zhang" target="_blank" rel="noopener noreferrer" aria-label="Ruiqian Zhang on GitHub" title="GitHub"><SocialIcon name="github" /></a>
              <a href="https://www.linkedin.com/in/ruiqianzhang/" target="_blank" rel="noopener noreferrer" aria-label="Ruiqian Zhang on LinkedIn" title="LinkedIn"><SocialIcon name="linkedin" /></a>
            </nav>
          </div>
        </div>
      </dialog>
    </header>
  );
}
