"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/layout/SmoothScroll";

/**
 * Keeps ScrollTrigger measurements honest:
 * - refreshes after webfonts load (pin distances depend on font metrics)
 * - resets scroll + refreshes on client-side route change
 */
export function ScrollRefresh() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // Let the new route paint before remeasuring.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return null;
}
