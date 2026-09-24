"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useLenis } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";

export type MarqueeProps = {
  children: ReactNode;
  /** Higher = faster. Pixels-per-second is derived from content width. */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * Seamless marquee: children are rendered twice inside a flex track that
 * translates by -50% forever. Duration is measured from the first copy's width
 * so speed is consistent regardless of content length.
 */
export function Marquee({
  children,
  speed = 60,
  direction = "left",
  pauseOnHover = false,
  className,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!track || !copy || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const width = copy.offsetWidth;
      if (!width) return;

      // pixels-per-second → seconds for one full copy width.
      const duration = width / speed;
      const fromX = direction === "left" ? 0 : -width;
      const toX = direction === "left" ? -width : 0;

      gsap.set(track, { x: fromX });
      const tween = gsap.to(track, {
        x: toX,
        duration,
        ease: "none",
        repeat: -1,
      });

      // Subtle: nudge playback rate with scroll velocity (max ~2x).
      let velTween: gsap.core.Tween | null = null;
      const onScroll = (e: { velocity: number }) => {
        const boost = Math.min(2, 1 + Math.abs(e.velocity) * 0.05);
        velTween?.kill();
        velTween = gsap.to(tween, {
          timeScale: boost,
          duration: 0.3,
          overwrite: true,
          onComplete: () => {
            gsap.to(tween, { timeScale: 1, duration: 0.6 });
          },
        });
      };
      lenis?.on("scroll", onScroll);

      return () => {
        lenis?.off("scroll", onScroll);
      };
    }, trackRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, direction, lenis]);

  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={pauseOnHover ? () => pause(trackRef, true) : undefined}
      onMouseLeave={pauseOnHover ? () => pause(trackRef, false) : undefined}
    >
      <div ref={trackRef} className="flex w-max flex-nowrap">
        <div ref={copyRef} className="flex flex-nowrap">
          {children}
        </div>
        <div className="flex flex-nowrap" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

function pause(ref: React.RefObject<HTMLDivElement | null>, paused: boolean) {
  const track = ref.current;
  if (!track) return;
  const tweens = gsap.getTweensOf(track);
  tweens.forEach((t) => (paused ? t.pause() : t.resume()));
}
