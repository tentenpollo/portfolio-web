"use client";

import { useEffect, useRef } from "react";
import { getStroke, type StrokeOptions } from "perfect-freehand";

type InputPoint = [x: number, y: number, pressure: number];

type Stroke = {
  points: InputPoint[];
  updatedAt: number;
  lifetime: number;
  seed: number;
  path: Path2D | null;
};

const MARK_LIFETIME_MS = 1250;
const MAX_STROKES = 120;
const STROKE_GAP_MS = 120;
const BRUSH_OPTIONS: StrokeOptions = {
  size: 24,
  thinning: 0.62,
  smoothing: 0.5,
  streamline: 0.55,
  simulatePressure: false,
  easing: (t) => t * t * (2.2 - 1.2 * t),
  start: {
    cap: false,
    taper: 18,
    easing: (t) => 1 - (1 - t) * (1 - t),
  },
  end: {
    cap: false,
    taper: 42,
    easing: (t) => t * t,
  },
  last: true,
};

const average = (a: number, b: number) => (a + b) / 2;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getSvgPathFromStroke(points: number[][]) {
  if (points.length < 4) {
    return "";
  }

  let path = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  path += ` Q${points[1][0].toFixed(2)},${points[1][1].toFixed(2)}`;
  path += ` ${average(points[1][0], points[2][0]).toFixed(2)},${average(
    points[1][1],
    points[2][1],
  ).toFixed(2)}`;

  for (let i = 2; i < points.length - 1; i += 1) {
    path += ` T${average(points[i][0], points[i + 1][0]).toFixed(2)},${average(
      points[i][1],
      points[i + 1][1],
    ).toFixed(2)}`;
  }

  return `${path} Z`;
}

function buildStrokePath(points: InputPoint[]) {
  if (points.length === 0) {
    return null;
  }

  const outline = getStroke(points, BRUSH_OPTIONS);

  if (outline.length >= 4) {
    return new Path2D(getSvgPathFromStroke(outline));
  }

  const [x, y, pressure] = points[points.length - 1];
  const radius = Math.max(1.2, 3.4 + pressure * 5.2);
  const dot = new Path2D();
  dot.arc(x, y, radius, 0, Math.PI * 2);
  return dot;
}

function getTipState(points: InputPoint[]) {
  const last = points[points.length - 1];
  const prev = points[Math.max(0, points.length - 2)] ?? last;
  const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0]);
  return {
    x: last[0],
    y: last[1],
    pressure: last[2],
    angle,
  };
}

export default function CursorInk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const pointerRef = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );
  const frameRef = useRef<number | null>(null);
  const activeStrokeRef = useRef<Stroke | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createStroke = (
      x: number,
      y: number,
      now: number,
      pressure = 0.72,
    ) => {
      const stroke: Stroke = {
        points: [[x, y, pressure]],
        updatedAt: now,
        lifetime: MARK_LIFETIME_MS,
        seed: Math.random(),
        path: null,
      };

      stroke.path = buildStrokePath(stroke.points);
      strokesRef.current.push(stroke);
      activeStrokeRef.current = stroke;
    };

    const drawTipBristles = (
      ctx: CanvasRenderingContext2D,
      stroke: Stroke,
      life: number,
    ) => {
      if (stroke.points.length < 2) {
        return;
      }

      const tip = getTipState(stroke.points);
      const baseLength = 16 + tip.pressure * 18;
      const baseSpread = 2 + tip.pressure * 5;
      const normalAngle = tip.angle + Math.PI / 2;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#120f10";
      ctx.globalAlpha = life * 0.18;

      for (let index = -2; index <= 2; index += 1) {
        const spread = index * baseSpread * 0.42;
        const jitter = Math.sin(stroke.seed * 100 + index * 1.7) * 1.8;
        const startX = tip.x + Math.cos(normalAngle) * spread;
        const startY = tip.y + Math.sin(normalAngle) * spread;
        const endX =
          startX +
          Math.cos(tip.angle) * (baseLength + jitter) +
          Math.cos(normalAngle) * jitter;
        const endY =
          startY +
          Math.sin(tip.angle) * (baseLength + jitter) +
          Math.sin(normalAngle) * jitter;

        ctx.lineWidth = Math.max(0.35, 0.9 - Math.abs(index) * 0.12);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawStroke = (
      ctx: CanvasRenderingContext2D,
      stroke: Stroke,
      now: number,
    ) => {
      if (!stroke.path) {
        return false;
      }

      const life = clamp(1 - (now - stroke.updatedAt) / stroke.lifetime, 0, 1);
      if (life <= 0) {
        return false;
      }

      ctx.save();
      ctx.fillStyle = "#171314";
      ctx.globalAlpha = 0.14 * life * life;
      ctx.shadowColor = "rgba(36, 25, 26, 0.38)";
      ctx.shadowBlur = 18;
      ctx.fill(stroke.path);

      ctx.globalAlpha = 0.84 * Math.pow(life, 1.15);
      ctx.shadowBlur = 0;
      ctx.fill(stroke.path);

      ctx.globalAlpha = 0.16 * life;
      ctx.fillStyle = "#241c1d";
      ctx.fill(stroke.path);
      ctx.restore();

      drawTipBristles(ctx, stroke, life);
      return true;
    };

    const render = () => {
      frameRef.current = window.requestAnimationFrame(render);
      const now = performance.now();
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      strokesRef.current = strokesRef.current.filter((stroke) =>
        drawStroke(context, stroke, now),
      );

      if (
        activeStrokeRef.current &&
        !strokesRef.current.includes(activeStrokeRef.current)
      ) {
        activeStrokeRef.current = null;
      }

      if (strokesRef.current.length > MAX_STROKES) {
        strokesRef.current.splice(0, strokesRef.current.length - MAX_STROKES);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const now = performance.now();
      const prev = pointerRef.current;

      pointerRef.current = { x, y, time: now };

      if (!prev) {
        createStroke(x, y, now, event.pressure || 0.72);
        return;
      }

      const paused = now - prev.time > STROKE_GAP_MS;
      if (paused) {
        createStroke(x, y, now, event.pressure || 0.72);
        return;
      }

      const dx = x - prev.x;
      const dy = y - prev.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 2.4) {
        activeStrokeRef.current && (activeStrokeRef.current.updatedAt = now);
        return;
      }

      const dt = Math.max(now - prev.time, 8);
      const speed = (distance / dt) * 1000;
      const normalizedSpeed = clamp(speed / 1800, 0, 1);
      const basePressure =
        event.pressure > 0 ? event.pressure : 0.92 - normalizedSpeed * 0.78;
      const pressure = clamp(basePressure, 0.12, 0.95);

      if (!activeStrokeRef.current) {
        createStroke(x, y, now, pressure);
        return;
      }

      activeStrokeRef.current.points.push([x, y, pressure]);
      activeStrokeRef.current.updatedAt = now;
      activeStrokeRef.current.path = buildStrokePath(
        activeStrokeRef.current.points,
      );
    };

    const resetPointer = () => {
      pointerRef.current = null;
      activeStrokeRef.current = null;
    };

    resize();
    render();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", resetPointer);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetPointer);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="cursor-ink-layer" aria-hidden="true" />
  );
}
