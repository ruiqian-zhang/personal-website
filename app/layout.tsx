import { SocialIcon } from "./social-icon";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "./site-header";
import { ThemeToggle } from "./theme-toggle";
import { PageTransition } from "./page-transition";
import "./globals.css";

const kyoto = localFont({
  src: [
    { path: "./fonts/PPKyoto-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/PPKyoto-RegularItalic.otf", weight: "400", style: "italic" },
  ],
  variable: "--font-kyoto",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: "Ruiqian Zhang · Rhema", template: "%s · Ruiqian Zhang" },
  description: "Rhema is an electrical engineering junior exploring hardware, power electronics, and robotics. Get to know Ruiqian Zhang and their work.",
};

const themeScript = `(function(){var t='system';try{t=localStorage.getItem('rhema-theme')||'system'}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={kyoto.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="site-shell">
          <SiteHeader />
          <main id="main"><PageTransition>{children}</PageTransition></main>
        </div>
        <footer className="site-footer">
          <div className="site-shell footer-inner">
            <div className="footer-main">
              <nav className="social-links" aria-label="Social links">
                <a href="mailto:rhema@vt.edu" aria-label="Email rhema@vt.edu" title="Email">
                  <SocialIcon name="email" />
                </a>
                <a href="https://x.com/rhemazhang" target="_blank" rel="noopener noreferrer" aria-label="Rhema Zhang on X" title="X">
                  <SocialIcon name="x" />
                </a>
                <a href="https://github.com/ruiqian-zhang" target="_blank" rel="noopener noreferrer" aria-label="Ruiqian Zhang on GitHub" title="GitHub">
                  <SocialIcon name="github" />
                </a>
                <a href="https://www.linkedin.com/in/ruiqianzhang/" target="_blank" rel="noopener noreferrer" aria-label="Ruiqian Zhang on LinkedIn" title="LinkedIn">
                  <SocialIcon name="linkedin" />
                </a>
              </nav>
              <span className="footer-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
                Blacksburg, VA
              </span>
            </div>
            <div className="footer-meta">
              <ThemeToggle />
              <span className="footer-copyright">© 2027 Ruiqian Zhang</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

