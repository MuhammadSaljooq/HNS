"use client";

import { Marquee } from "@/components/ui/Marquee";

const PHRASE = "NEVER MISS A FOLLOW-UP";

function Row({
  outlined,
  direction,
}: {
  outlined: boolean;
  direction: "left" | "right";
}) {
  return (
    <Marquee speed={70} direction={direction}>
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              "px-8 font-display uppercase tracking-tight" +
              (outlined ? " text-outline" : "")
            }
            style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
          >
            {PHRASE}
          </span>
          <span
            aria-hidden
            className="text-accent"
            style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
          >
            ✦
          </span>
        </span>
      ))}
    </Marquee>
  );
}

export function TextTicker() {
  return (
    <section
      aria-label={PHRASE}
      className="flex flex-col gap-2 border-y border-white/10 py-8"
    >
      <Row outlined={false} direction="left" />
      <Row outlined direction="right" />
    </section>
  );
}
