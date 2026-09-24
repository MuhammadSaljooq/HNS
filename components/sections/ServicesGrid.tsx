"use client";

import { ThemeSection } from "@/components/layout/ThemeSection";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { serviceGroups, type Service } from "@/content/services";

function ServiceRow({ service }: { service: Service }) {
  return (
    <a
      href={service.href}
      className="group relative flex items-center justify-between overflow-hidden border-b border-white/10 py-4"
    >
      {/* Fill sweep from the left (CSS only). */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-white/5 transition-transform duration-[400ms] ease-out group-hover:scale-x-100"
      />
      <span className="relative flex items-center gap-2 text-sm transition-transform duration-[400ms] ease-out group-hover:translate-x-2">
        {service.name}
        {service.flag === "ai" && (
          <span className="text-accent" title="AI" aria-label="AI">
            ✦
          </span>
        )}
        {service.flag === "popular" && (
          <span className="rounded-full border border-accent/50 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-accent">
            popular
          </span>
        )}
      </span>
      <span
        aria-hidden
        className="relative text-[var(--fg-muted)] transition-transform duration-[400ms] ease-out group-hover:rotate-45 group-hover:text-accent"
      >
        ↗
      </span>
    </a>
  );
}

export function ServicesGrid() {
  return (
    <ThemeSection theme="dark" id="services">
      <div className="mx-auto max-w-7xl px-6 py-32">
        <div className="mb-16 flex flex-col gap-6">
          <Eyebrow>PRODUCT &amp; SERVICES</Eyebrow>
          <h2
            className="max-w-3xl font-display font-medium leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
          >
            Autopilot up front. A full team behind it.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {serviceGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 0.08} y={30}>
              <div>
                <h3
                  className={
                    "mb-2 flex items-center gap-2 border-t pt-4 text-xs uppercase tracking-[0.2em] " +
                    (group.flagship
                      ? "border-accent text-accent"
                      : "border-white/20 text-[var(--fg-muted)]")
                  }
                >
                  {group.title}
                  {group.flagship && (
                    <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] text-ink">
                      flagship
                    </span>
                  )}
                </h3>
                <div>
                  {group.services.map((s) => (
                    <ServiceRow key={s.name} service={s} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </ThemeSection>
  );
}
