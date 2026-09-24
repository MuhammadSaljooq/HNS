"use client";

import { Marquee } from "@/components/ui/Marquee";
import { StatsBar } from "@/components/sections/StatsBar";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Invented client names — NOT real companies.
const clients = [
  "MERIDIAN",
  "NORTHWIND",
  "CARGOLOOP",
  "ATLAS·RETAIL",
  "BRIGHTWORK",
  "VERDE",
  "HELIOGRAPH",
  "QUANTA·LABS",
];

function LogoWordmark({ name }: { name: string }) {
  return (
    <span className="mx-10 select-none font-display text-2xl tracking-tight text-paper/40 grayscale transition-all duration-500 hover:text-accent hover:grayscale-0 md:text-3xl">
      {name}
    </span>
  );
}

export function LogoMarquee() {
  return (
    <section className="relative pb-28 pt-20">
      <div className="mb-10 flex justify-center">
        <Eyebrow dot>TRUSTED BY TEAMS THAT NEVER DROP THE BALL</Eyebrow>
      </div>

      <div
        className="relative"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <Marquee speed={40}>
          {clients.map((c) => (
            <LogoWordmark key={c} name={c} />
          ))}
        </Marquee>
      </div>

      {/* Stats pill overlapping the bottom of the marquee. */}
      <div className="absolute inset-x-0 bottom-0 translate-y-1/2">
        <StatsBar />
      </div>
    </section>
  );
}
