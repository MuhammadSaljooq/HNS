import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { phases } from "@/content/method";

/** Compact vertical rendering of the Autopilot flow. */
export function ProcessStrip() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-32">
      <div className="mb-12">
        <Eyebrow>HOW IT WORKS</Eyebrow>
      </div>
      <ol className="flex flex-col">
        {phases.map((phase, i) => (
          <Reveal key={phase.id} delay={i * 0.05} y={24}>
            <li className="flex flex-col gap-3 border-t border-white/10 py-8 md:flex-row md:items-baseline md:gap-10">
              <span className="font-display text-sm text-accent">
                {phase.index}
              </span>
              <span
                className="font-display tracking-tight md:w-56"
                style={{ fontSize: "clamp(1.25rem, 3vw, 2rem)" }}
              >
                {phase.title}
              </span>
              <span className="max-w-xl text-sm leading-relaxed text-muted-dark">
                {phase.claim}
              </span>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
