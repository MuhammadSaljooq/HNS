"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import type { CaseStudy } from "@/content/case-studies";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function CaseStudyView({
  study,
  next,
}: {
  study: CaseStudy;
  next: CaseStudy;
}) {
  const coverRef = useRef<HTMLDivElement>(null);
  const coverInnerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  // Parallax the cover.
  useIsomorphicLayoutEffect(() => {
    const cover = coverRef.current;
    const inner = coverInnerRef.current;
    if (!cover || !inner || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(inner, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: cover,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, coverRef);
    return () => ctx.revert();
  }, []);

  // Count-up metrics.
  useIsomorphicLayoutEffect(() => {
    const root = metricsRef.current;
    if (!root) return;
    const nums = root.querySelectorAll<HTMLElement>("[data-num]");
    if (prefersReducedMotion()) {
      nums.forEach((el) => (el.textContent = el.dataset.raw ?? ""));
      return;
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: () => {
          nums.forEach((el) => {
            const raw = el.dataset.raw ?? "";
            const match = raw.match(/([\d.]+)/);
            if (!match) {
              el.textContent = raw;
              return;
            }
            const target = parseFloat(match[1]);
            const dec = (match[1].split(".")[1] || "").length;
            const proxy = { v: 0 };
            gsap.to(proxy, {
              v: target,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = raw.replace(
                  match[1],
                  proxy.v.toFixed(dec),
                );
              },
            });
          });
        },
      });
    }, metricsRef);
    return () => ctx.revert();
  }, []);

  return (
    <article>
      {/* Full-bleed cover */}
      <div
        ref={coverRef}
        className="relative h-[70vh] overflow-hidden"
      >
        <div
          ref={coverInnerRef}
          className="absolute inset-0 -top-[10%] h-[120%] bg-gradient-to-br from-ink-soft to-[#1b2410]"
        />
        <div className="dot-grid absolute inset-0" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-16">
            <Eyebrow>
              {`${study.industry} · ${study.year}`}
            </Eyebrow>
            <h1
              className="mt-6 max-w-4xl font-display font-medium leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.25rem, 6vw, 5rem)" }}
            >
              {study.headline}
            </h1>
          </div>
        </div>
      </div>

      {/* Meta + content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-[18rem_1fr]">
        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <dl className="flex flex-col gap-6 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.15em] text-paper/40">
                Client
              </dt>
              <dd className="mt-1">{study.client}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.15em] text-paper/40">
                Industry
              </dt>
              <dd className="mt-1">{study.industry}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.15em] text-paper/40">
                Year
              </dt>
              <dd className="mt-1">{study.year}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.15em] text-paper/40">
                What we used
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {study.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-paper/70"
                  >
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </aside>

        <div className="max-w-2xl">
          <p className="text-xl leading-relaxed md:text-2xl">{study.summary}</p>

          <h2 className="mt-14 font-display text-2xl tracking-tight">
            The challenge
          </h2>
          <p className="mt-4 leading-relaxed text-muted-dark">
            {study.client} was leaking revenue in the gaps between
            conversations — leads going cold, appointments missed, renewals
            slipping past their date. Follow-ups depended on someone remembering
            to send them, and people forget.
          </p>

          <h2 className="mt-12 font-display text-2xl tracking-tight">
            What we did
          </h2>
          <p className="mt-4 leading-relaxed text-muted-dark">
            We rolled out NHS Autopilot on top of their existing tools. Every
            contact now flows into the CRM automatically, and the agent owns the
            timing and delivery of each reminder across the channels their
            customers actually read.
          </p>

          <h2 className="mt-12 font-display text-2xl tracking-tight">
            The outcome
          </h2>
          <p className="mt-4 leading-relaxed text-muted-dark">
            Within a quarter the numbers moved — and stayed moved, because the
            system runs whether anyone is watching it or not.
          </p>
        </div>
      </div>

      {/* Metrics band */}
      <div ref={metricsRef} className="border-y border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-3">
          {study.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div
                data-num
                data-raw={m.value}
                className="font-display tracking-tight text-accent"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
              >
                {m.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-paper/50">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next case study */}
      <Link
        href={`/case-studies/${next.slug}`}
        className="group block border-b border-white/10"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-20">
          <span className="text-[11px] uppercase tracking-[0.2em] text-paper/40">
            Next case study
          </span>
          <span className="flex items-center gap-4 font-display leading-tight tracking-tight transition-colors group-hover:text-accent"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            {next.headline}
            <span className="text-accent transition-transform group-hover:translate-x-2">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
