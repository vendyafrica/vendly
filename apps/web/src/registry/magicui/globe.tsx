"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type GlobeProps = {
  className?: string;
  dotColor?: string;
  speed?: number;
  density?: number;
};

type Vec3 = { x: number; y: number; z: number };

const toRad = (deg: number) => (deg * Math.PI) / 180;

function generateSpherePoints(stepDeg = 12): Vec3[] {
  const pts: Vec3[] = [];
  for (let lat = -80; lat <= 80; lat += stepDeg) {
    const latR = toRad(lat);
    const cosLat = Math.cos(latR);
    const sinLat = Math.sin(latR);
    for (let lon = 0; lon < 360; lon += stepDeg) {
      const lonR = toRad(lon);
      const x = cosLat * Math.cos(lonR);
      const y = sinLat;
      const z = cosLat * Math.sin(lonR);
      pts.push({ x, y, z });
    }
  }
  return pts;
}

export function Globe({
  className,
  dotColor = "rgba(148,163,184,0.9)",
  speed = 0.25,
  density = 12,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const points = generateSpherePoints(Math.max(4, Math.min(30, density)));

    let width = 0;
    let height = 0;
    let dpr = Math.max(window.devicePixelRatio || 1, 1);

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;

      const { clientWidth, clientHeight } = parent;
      width = clientWidth;
      height = clientHeight;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }

    let lastTime = performance.now();
    let angle = 0;

    function draw(ts: number) {
      const dt = (ts - lastTime) / 1000;
      lastTime = ts;
      angle += speed * dt;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radiusPx = Math.min(width, height) * 0.42;

      const cam = 3.2;

      const grd = ctx.createRadialGradient(
        cx,
        cy,
        radiusPx * 0.2,
        cx,
        cy,
        radiusPx * 1.1
      );
      grd.addColorStop(0, "rgba(255,255,255,0.0)");
      grd.addColorStop(1, "rgba(0,0,0,0.06)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, radiusPx * 1.1, 0, Math.PI * 2);
      ctx.fill();

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Back hemisphere (fainter)
      for (let i = 0; i < points.length; i++) {
        const { x, y, z } = points[i];

        const xr = x * cosA - z * sinA;
        const zr = x * sinA + z * cosA;
        const yr = y;

        if (zr >= 0) continue;

        const proj = cam / (cam - zr);
        const sx = cx + xr * radiusPx * proj;
        const sy = cy + yr * radiusPx * proj;

        const alpha = 0.25 * (0.2 + 0.8 * (1 - (zr + 1) / 2));
        ctx.fillStyle = colorWithAlpha(dotColor, alpha);
        drawDot(ctx, sx, sy, Math.max(0.8, 1.2 * proj));
      }

      // Front hemisphere (brighter)
      for (let i = 0; i < points.length; i++) {
        const { x, y, z } = points[i];

        const xr = x * cosA - z * sinA;
        const zr = x * sinA + z * cosA;
        const yr = y;

        if (zr < 0) continue;

        const proj = cam / (cam - zr);
        const sx = cx + xr * radiusPx * proj;
        const sy = cy + yr * radiusPx * proj;

        const alpha = 0.65 * (0.3 + 0.7 * ((zr + 1) / 2));
        ctx.fillStyle = colorWithAlpha(dotColor, alpha);
        drawDot(ctx, sx, sy, Math.max(1.0, 1.6 * proj));
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [density, speed, dotColor]);

  return (
    <div className={cn("absolute inset-0", className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full block" />
    </div>
  );
}

function drawDot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function colorWithAlpha(color: string, alpha: number): string {
  const rgbaMatch =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(
      color
    );
  if (rgbaMatch) {
    const r = clamp255(parseInt(rgbaMatch[1], 10));
    const g = clamp255(parseInt(rgbaMatch[2], 10));
    const b = clamp255(parseInt(rgbaMatch[3], 10));
    return `rgba(${r},${g},${b},${clamp01(alpha)})`;
  }

  const hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color);
  if (hexMatch) {
    const hex = hexMatch[1];
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    return `rgba(${r},${g},${b},${clamp01(alpha)})`;
  }

  return color;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function clamp255(v: number) {
  return Math.max(0, Math.min(255, v));
}