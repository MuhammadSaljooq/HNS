"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { phases } from "@/content/method";

export function MethodHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    const n = phases.length;
    // Correct end value for the track: -((panels - 1) / panels) * 100.
    const xPercentTarget = -((n - 1) / n) * 100;

    const mm = gsap.matchMedia();

    // -------- Desktop, motion allowed: pinned horizontal scroll --------
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          gsap.set(section, { height: `${n * 100}vh` });
          gsap.set(track, { width: `${n * 100}vw` });

          const horizontal = gsap.to(track, {
            xPercent: xPercentTarget,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              pin: pin,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);

          panels.forEach((panel) => {
            const title = panel.querySelector("[data-panel-title]");
            const bullets = panel.querySelectorAll("[data-panel-bullet]");
            const numeral = panel.querySelector("[data-panel-ghost]");

            if (title) {
              gsap.fromTo(
                title,
                { x: 60, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: horizontal,
                    start: "left 70%",
                    end: "left 20%",
                    scrub: true,
                  },
                },
              );
            }
            if (bullets.length) {
              gsap.fromTo(
                bullets,
                { x: 40, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,
                  stagger: 0.08,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: horizontal,
                    start: "left 65%",
                    end: "left 25%",
                    scrub: true,
                  },
                },
              );
            }
            if (numeral) {
              gsap.to(numeral, {
                xPercent: -20,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontal,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              });
            }
          });

          // Progress tracker fill + current label.
          if (progressFillRef.current) {
            gsap.fromTo(
              progressFillRef.current,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: true,
                  onUpdate: (self) => {
                    const idx = Math.min(
                      n - 1,
                      Math.floor(self.progress * n),
                    );
                    if (progressLabelRef.current) {
                      progressLabelRef.current.textContent = `${phases[idx].index} · ${phases[idx].title}`;
                    }
                  },
                },
              },
            );
          }

          // Recompute once webfonts are ready (pin distance depends on metrics).
          document.fonts?.ready.then(() => ScrollTrigger.refresh());
        }, sectionRef);

        return () => ctx.revert();
      },
    );

    // -------- Mobile / reduced motion: plain vertical stack --------
    mm.add("(max-width: 1023px)", () => {
      const ctx = gsap.context(() => {
        gsap.set(section, { clearProps: "height" });
        gsap.set(track, { clearProps: "width,transform" });

        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (reduce) return;

        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
        panels.forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-panel-anim]"), {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 80%", once: true },
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="relative bg-paper text-[var(--fg)]"
    >
      <div className="dot-grid pointer-events-none absolute inset-0 !opacity-[0.04]" />
      <div
        ref={pinRef}
        className="relative flex flex-col overflow-hidden lg:h-screen"
      >
        <div
          ref={trackRef}
          className="flex flex-col lg:h-full lg:flex-row lg:flex-nowrap"
        >
          {phases.map((phase) => (
            <article
              key={phase.id}
              data-panel
              className="relative flex w-full shrink-0 items-center px-[8vw] py-28 lg:h-screen lg:w-screen lg:py-0"
            >
              {/* Ghost numeral */}
              <span
                data-panel-ghost
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 font-display font-bold leading-none text-ink"
                style={{ fontSize: "45vw", opacity: 0.04 }}
              >
                {phase.index}
              </span>

              <div className="relative z-10 max-w-2xl">
                <span
                  data-panel-anim
                  className="text-xs uppercase tracking-[0.25em] text-[var(--fg-muted)]"
                >
                  [ PHASE {phase.index} ]
                </span>
                <h3
                  data-panel-title
                  data-panel-anim
                  className="mt-4 font-display font-medium leading-[0.9] tracking-[-0.03em]"
                  style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
                >
                  {phase.title}
                  <span className="text-accent">.</span>
                </h3>
                <p
                  data-panel-anim
                  className="mt-6 max-w-xl text-lg font-medium leading-snug md:text-2xl"
                >
                  {phase.claim}
                </p>
                <div className="my-8 h-px w-24 bg-ink/20" />
                <ul className="flex flex-col gap-2">
                  {phase.points.map((pt) => (
                    <li
                      key={pt}
                      data-panel-bullet
                      data-panel-anim
                      className="text-sm lowercase text-[var(--fg-muted)] md:text-base"
                    >
                      <span className="text-accent">—</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Progress tracker (desktop only). */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden items-center justify-center gap-4 lg:flex">
          <div className="relative h-px w-40 bg-ink/15">
            <div
              ref={progressFillRef}
              className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-accent"
            />
          </div>
          <span
            ref={progressLabelRef}
            className="min-w-40 text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]"
          >
            {phases[0].index} · {phases[0].title}
          </span>
        </div>
      </div>
    </section>
  );
}
