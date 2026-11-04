"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = containerRef.current?.animate(
      [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 320, easing: "ease-out" },
    );
    return () => animation?.cancel();
  }, [pathname]);

  return <div ref={containerRef} className="page-transition" key={pathname}>{children}</div>;
}
