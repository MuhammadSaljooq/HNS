"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
};

const stats: Stat[] = [
  { value: 2, suffix: "M+", label: "reminders sent" },
  { value: 40, suffix: "%", label: "fewer no-shows" },
  { value: 3, suffix: "x", label: "reply rate" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "avg. rating" },
];

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const nums = root.querySelectorAll<HTMLElement>("[data-stat]");
    if (prefersReducedMotion()) {
      nums.forEach((el) => {
        const to = Number(el.dataset.to);
        const dec = Number(el.dataset.dec ?? 0);
        el.textContent = to.toFixed(dec);
      });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: () => {
          nums.forEach((el) => {
            const to = Number(el.dataset.to);
            const dec = Number(el.dataset.dec ?? 0);
            const proxy = { v: 0 };
            gsap.to(proxy, {
              v: to,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = proxy.v.toFixed(dec);
              },
            });
          });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="mx-auto flex w-[calc(100%-3rem)] max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-full border border-white/10 bg-ink-soft/80 px-8 py-5 backdrop-blur-xl md:gap-x-12"
    >
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center">
            <span className="font-display text-2xl tracking-tight md:text-3xl">
              {s.prefix}
              <span data-stat data-to={s.value} data-dec={s.decimals ?? 0}>
                0
              </span>
              {s.suffix}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-paper/45">
              {s.label}
            </span>
          </div>
          {i < stats.length - 1 && (
            <span className="hidden text-accent md:inline" aria-hidden>
              ·
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
