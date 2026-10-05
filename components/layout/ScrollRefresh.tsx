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
    const hash = window.location.hash;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // Let the new route paint before remeasuring.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());

    // Cross-page anchors (e.g. /#method): scroll to the target once pinned
    // sections have been measured, instead of leaving the user at the top.
    let timer: number | undefined;
    if (hash.length > 1) {
      timer = window.setTimeout(() => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { offset: -96 });
        else el.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }

    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(timer);
    };
  }, [pathname, lenis]);

  return null;
}
