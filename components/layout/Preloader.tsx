"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useLenis } from "@/components/layout/SmoothScroll";

const PHASES = ["CAPTURE", "ORGANIZE", "AUTOMATE", "REMIND", "GROW"];
const SESSION_KEY = "hns:preloaded";

/** Fire once the intro finishes so the hero can start its entrance. */
function emitDone() {
  window.dispatchEvent(new Event("preloader:done"));
}

export function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Only decide visibility on the client to avoid hydration mismatch.
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
    const alreadySeen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadySeen) {
      setVisible(false);
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || !visible) return;
    const root = rootRef.current;
    const counter = counterRef.current;
    if (!root || !counter) return;

    // Lock scroll while the preloader is up.
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const finish = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      document.body.style.overflow = "";
      lenis?.start();
      setVisible(false);
      emitDone();
    };

    if (prefersReducedMotion()) {
      // Skip straight to done next frame.
      const id = requestAnimationFrame(finish);
      return () => cancelAnimationFrame(id);
    }

    const labels = labelsRef.current
      ? Array.from(labelsRef.current.children)
      : [];

    const ctx = gsap.context(() => {
      const proxy = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => {} });

      tl.to(proxy, {
        v: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
          const val = Math.round(proxy.v);
          counter.textContent = String(val).padStart(3, "0") + "%";
          // Light labels as the counter crosses 20/40/60/80/100.
          const lit = Math.min(PHASES.length, Math.floor(val / 20));
          labels.forEach((el, i) => {
            (el as HTMLElement).style.opacity = i < lit ? "1" : "0.25";
          });
        },
      })
        .to(counter, { opacity: 0, duration: 0.4, ease: "power2.in" }, ">-0.1")
        .to(
          labels,
          { opacity: 0, duration: 0.3, ease: "power2.in" },
          "<",
        )
        .to(root, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          ease: "power4.inOut",
          onComplete: finish,
        });
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, visible]);

  if (!mounted || !visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      style={{ clipPath: "inset(0 0 0 0)" }}
      aria-hidden
    >
      <span
        ref={counterRef}
        className="font-display leading-none tracking-tight text-paper"
        style={{ fontSize: "clamp(4rem, 14vw, 11rem)" }}
      >
        000%
      </span>
      <div
        ref={labelsRef}
        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em]"
      >
        {PHASES.map((p) => (
          <span key={p} style={{ opacity: 0.25 }} className="text-paper">
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
