"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useLenis } from "@/components/layout/SmoothScroll";
import { site } from "@/content/site";
import { SplitText } from "@/components/ui/SplitText";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Globe } from "@/components/ui/Globe";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [play, setPlay] = useState(false);

  // Gate entrance on preloader:done (or play immediately if already seen).
  useIsomorphicLayoutEffect(() => {
    const start = () => setPlay(true);
    const alreadySeen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("nhs:preloaded") === "1";
    if (alreadySeen || prefersReducedMotion()) {
      start();
      return;
    }
    window.addEventListener("preloader:done", start);
    // Safety net: reveal even if the preloader event is ever missed.
    const fallback = window.setTimeout(start, 4500);
    return () => {
      window.removeEventListener("preloader:done", start);
      window.clearTimeout(fallback);
    };
  }, []);

  // Entrance timeline for eyebrow / subhead / buttons / cue.
  useIsomorphicLayoutEffect(() => {
    if (!play) return;
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from("[data-hero-eyebrow]", { y: 20, opacity: 0, duration: 0.6 })
        .from(
          "[data-hero-sub]",
          { y: 20, opacity: 0, duration: 0.7 },
          "+=0.5",
        )
        .from(
          "[data-hero-btns] > *",
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 },
          "-=0.3",
        )
        .from(
          "[data-hero-cue]",
          { opacity: 0, duration: 0.6 },
          "-=0.2",
        );
    }, rootRef);

    return () => ctx.revert();
  }, [play]);

  // Parallax drift as the hero scrolls out.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    const grid = gridRef.current;
    if (!root || !content || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(content, {
        yPercent: 15,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      if (grid) {
        gsap.to(grid, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const scrollToMethod = () => {
    const el = document.getElementById("method");
    if (el && lenis) lenis.scrollTo(el, { offset: -100 });
    else el?.scrollIntoView();
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-28 pt-32"
    >
      <div ref={gridRef} className="pointer-events-none absolute inset-0 -z-10">
        <div className="dot-grid absolute inset-0" />
        <div className="grid-lines absolute inset-0" />
      </div>

      <div
        ref={contentRef}
        className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 text-left lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="flex flex-col items-start">
        <div data-hero-eyebrow>
          <Eyebrow>{site.tagline.toUpperCase()}</Eyebrow>
        </div>

        <h1
          className="mt-8 font-display font-medium leading-[0.9] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.25rem, 9vw, 8rem)" }}
        >
          <span className="block overflow-hidden lg:whitespace-nowrap">
            <SplitText by="char" trigger="manual" play={play} stagger={0.03}>
              Never miss
            </SplitText>
          </span>
          <span className="block overflow-hidden lg:whitespace-nowrap">
            <SplitText
              by="char"
              trigger="manual"
              play={play}
              stagger={0.03}
              delay={0.15}
            >
              a follow-up
            </SplitText>
          </span>
          <span className="block overflow-hidden lg:whitespace-nowrap">
            <SplitText
              by="char"
              trigger="manual"
              play={play}
              stagger={0.03}
              delay={0.3}
            >
              again
            </SplitText>
            <span className="text-accent">.</span>
          </span>
        </h1>

        <p
          data-hero-sub
          className="mt-8 max-w-2xl text-base leading-relaxed text-muted-dark md:text-lg"
        >
          {site.product} is the AI automation agent that schedules and sends
          your reminders — with a built-in CRM that keeps every contact, deal,
          and follow-up in one place. Set it once; it never forgets.
        </p>

        <div data-hero-btns className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/contact" variant="primary">
            Start free
          </Button>
          <Button onClick={scrollToMethod} variant="ghost">
            See how it works
          </Button>
        </div>
        </div>

        {/* Globe — desktop right column */}
        <div
          data-hero-globe
          className="hidden justify-center lg:flex"
        >
          <Globe className="w-full max-w-[540px]" />
        </div>
      </div>

      {/* Scroll cue — aligned to the content's left edge */}
      <div
        data-hero-cue
        className="pointer-events-none absolute inset-x-0 bottom-10"
        aria-hidden
      >
        <div className="mx-auto flex max-w-7xl px-6">
          <div className="flex flex-col items-start gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-paper/40">
              scroll
            </span>
            <span className="relative block h-10 w-px overflow-hidden bg-white/15">
              <span className="absolute left-0 top-0 h-3 w-px animate-[cue_1.8s_ease-in-out_infinite] bg-accent" />
            </span>
          </div>
        </div>
      </div>

      <style>{`@keyframes cue{0%{transform:translateY(-12px);opacity:0}30%{opacity:1}100%{transform:translateY(40px);opacity:0}}`}</style>
    </section>
  );
}
