"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const RULE_HEIGHT = 120;

/** Fixed right-edge scroll readout: a traveling accent tick + percentage. */
export function ScrollProgress() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  // Reveal after preloader, hide when footer enters.
  useIsomorphicLayoutEffect(() => {
    const onDone = () => setReady(true);
    if (
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("nhs:preloaded") === "1"
    ) {
      setReady(true);
    }
    window.addEventListener("preloader:done", onDone);
    return () => window.removeEventListener("preloader:done", onDone);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const tick = tickRef.current;
    const label = labelRef.current;
    if (!root || !tick || !label) return;
    if (prefersReducedMotion()) return;

    const setY = gsap.quickSetter(tick, "y", "px");
    const setOpacity = gsap.quickSetter(root, "opacity");

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          setY(p * (RULE_HEIGHT - 12));
          label.textContent = String(Math.round(p * 100)).padStart(3, "0") + "%";
          // Fade out only over the last stretch (near the footer), computed
          // from scroll progress — the sticky footer can't be used as a
          // ScrollTrigger trigger (it mis-measures and hides this on load).
          const o = p > 0.9 ? Math.max(0, 1 - (p - 0.9) / 0.1) : 1;
          setOpacity(o);
        },
      });

      return () => {
        st.kill();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      ref={rootRef}
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      aria-hidden
    >
      <div
        className="relative w-px bg-white/25"
        style={{ height: RULE_HEIGHT }}
      >
        <div
          ref={tickRef}
          className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-accent"
        />
      </div>
      <span
        ref={labelRef}
        className="text-[10px] tracking-[0.2em] text-paper/60"
      >
        000%
      </span>
    </div>
  );
}
