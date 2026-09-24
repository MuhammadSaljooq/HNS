import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { team } from "@/content/about";

/** Placeholder silhouette portraits that colorize on hover. */
function Portrait({ initials }: { initials: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft grayscale transition-all duration-500 group-hover:grayscale-0">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div className="dot-grid absolute inset-0" />
      <span className="absolute inset-0 flex items-center justify-center font-display text-6xl text-white/10 transition-colors duration-500 group-hover:text-accent/30">
        {initials}
      </span>
    </div>
  );
}

export function TeamGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-32">
      <div className="mb-14">
        <Eyebrow>THE TEAM</Eyebrow>
        <h2
          className="mt-6 max-w-3xl font-display font-medium leading-[0.95] tracking-[-0.03em]"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          Senior people, no hand-offs.
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
        {team.map((m, i) => {
          const initials = m.name
            .split(" ")
            .map((n) => n[0])
            .join("");
          return (
            <Reveal key={m.name} delay={i * 0.05} y={24}>
              <div className="group">
                <Portrait initials={initials} />
                <div className="mt-3">
                  <div className="text-sm">{m.name}</div>
                  <div className="text-xs text-paper/45">{m.role}</div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
