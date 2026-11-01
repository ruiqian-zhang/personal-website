"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Ruiqian Zhang, home">Ruiqian Zhang</Link>
      <div className="header-right">
        <nav aria-label="Main navigation">
          {[["/", "About"], ["/resume/", "Resume"], ["/projects/", "Projects"], ["/blogs/", "Blogs"]].map(([href, label]) => {
            const active = href === "/" ? pathname === "/" : pathname.replace(/\/$/, "") === href.replace(/\/$/, "");
            return <Link key={href} href={href} aria-current={active ? "page" : undefined}>{label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}
