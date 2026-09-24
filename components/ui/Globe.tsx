"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { WORLD_MAP_SRC, WORLD_MAP_W, WORLD_MAP_H } from "@/lib/worldMap";

type Vec3 = [number, number, number];

// City markers (lat, lon) rendered in the accent color.
const MARKERS: [number, number][] = [
  [30.27, -97.74], // Austin
  [51.51, -0.13], // London
  [40.71, -74.0], // New York
  [1.35, 103.82], // Singapore
  [-33.87, 151.21], // Sydney
];

function latLonToVec3(latDeg: number, lonDeg: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lon),
  ];
}

/** Build evenly-spaced land points by sampling the equirectangular mask. */
function buildLandPoints(pixels: Uint8ClampedArray): Vec3[] {
  const pts: Vec3[] = [];
  const bands = 110; // latitude resolution
  for (let i = 0; i < bands; i++) {
    const lat = (i / (bands - 1)) * Math.PI - Math.PI / 2; // -90..90
    const ring = Math.max(1, Math.round(bands * 2 * Math.cos(lat)));
    for (let j = 0; j < ring; j++) {
      const lon = (j / ring) * 2 * Math.PI - Math.PI; // -180..180
      const u = Math.floor(((lon + Math.PI) / (2 * Math.PI)) * WORLD_MAP_W) % WORLD_MAP_W;
      // map row 0 = +90° (north) at top
      const v = Math.floor(((Math.PI / 2 - lat) / Math.PI) * WORLD_MAP_H);
      const idx = (v * WORLD_MAP_W + u) * 4;
      if (pixels[idx] > 128) {
        pts.push([
          Math.cos(lat) * Math.cos(lon),
          Math.sin(lat),
          Math.cos(lat) * Math.sin(lon),
        ]);
      }
    }
  }
  return pts;
}

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ down: boolean; lastX: number }>({
    down: false,
    lastX: 0,
  });
  const velRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    const tilt = -0.35; // radians, northern hemisphere tips toward viewer
    let rot = -1.6; // start over the Atlantic/Africa
    let raf = 0;
    let points: Vec3[] = [];
    let size = 0;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      size = canvas.offsetWidth || 420;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = (w / 2) * 0.92;
      const dot = Math.max(1, R * 0.008);

      ctx.clearRect(0, 0, w, h);

      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);

      // Land dots
      for (let k = 0; k < points.length; k++) {
        const p = points[k];
        // rotate around Y
        const x = p[0] * cosR - p[2] * sinR;
        const zr = p[0] * sinR + p[2] * cosR;
        const y0 = p[1];
        // tilt around X
        const y = y0 * cosT - zr * sinT;
        const z = y0 * sinT + zr * cosT;

        const sx = cx + x * R;
        const sy = cy - y * R;
        // z>0 faces the viewer
        const front = z;
        const alpha = front > 0 ? 0.35 + 0.65 * front : 0.12 + 0.14 * (1 + front);
        const r = front > 0 ? dot * (0.6 + 0.5 * front) : dot * 0.5;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = "#c9c9cc";
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Accent city markers (front hemisphere only)
      for (const [lat, lon] of MARKERS) {
        const p = latLonToVec3(lat, lon);
        const x = p[0] * cosR - p[2] * sinR;
        const zr = p[0] * sinR + p[2] * cosR;
        const y0 = p[1];
        const y = y0 * cosT - zr * sinT;
        const z = y0 * sinT + zr * cosT;
        if (z <= 0.02) continue;
        const sx = cx + x * R;
        const sy = cy - y * R;
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#c8f751";
        ctx.beginPath();
        ctx.arc(sx, sy, dot * 1.9, 0, Math.PI * 2);
        ctx.fill();
        // soft ring
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(sx, sy, dot * 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      if (!dragRef.current.down) {
        rot += reduce ? 0 : 0.0016;
        rot += velRef.current;
        velRef.current *= 0.94; // inertia decay
      }
      render();
      raf = requestAnimationFrame(tick);
    };

    // Load the land mask, sample it, then start.
    const img = new Image();
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = WORLD_MAP_W;
      off.height = WORLD_MAP_H;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, WORLD_MAP_W, WORLD_MAP_H);
      const data = octx.getImageData(0, 0, WORLD_MAP_W, WORLD_MAP_H).data;
      points = buildLandPoints(data);
      canvas.style.opacity = "1";
      if (reduce) render();
      else raf = requestAnimationFrame(tick);
    };
    img.src = WORLD_MAP_SRC;

    // Drag to spin
    const onDown = (e: PointerEvent) => {
      dragRef.current = { down: true, lastX: e.clientX };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.down) return;
      const dx = e.clientX - dragRef.current.lastX;
      dragRef.current.lastX = e.clientX;
      rot += dx * 0.005;
      velRef.current = dx * 0.0004;
    };
    const onUp = (e: PointerEvent) => {
      dragRef.current.down = false;
      canvas.releasePointerCapture?.(e.pointerId);
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Rotating globe showing where HNS works"
      className={cn(
        "aspect-square w-full max-w-full cursor-grab opacity-0 transition-opacity duration-1000",
        className,
      )}
      style={{ touchAction: "none" }}
    />
  );
}
