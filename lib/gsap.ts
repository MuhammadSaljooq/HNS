"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single GSAP entry point for the whole app.
 * Every other file imports { gsap, ScrollTrigger } from here — never from
 * "gsap" directly — so plugin registration happens exactly once and does not
 * break under Turbopack.
 */

// Guard against double registration during dev fast-refresh / StrictMode.
declare global {
  // eslint-disable-next-line no-var
  var __gsapRegistered: boolean | undefined;
}

if (typeof window !== "undefined" && !globalThis.__gsapRegistered) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  globalThis.__gsapRegistered = true;
}

/** Reads the reduced-motion media query safely (false during SSR). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
