/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

const COLORS = [
  '#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0',
  '#b0b0b0', '#909090', '#707070', '#505050',
  '#383838', '#202020', '#141414'
];

const BALL_COUNT = 160;
const GRAVITY = 0.35;
const DAMPING = 0.72;
const FRICTION = 0.992;
const REPULSION_RADIUS = 90;
const GRAB_RADIUS = 50;
const SUBSTEPS = 3;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  mass: number;
  color: string;
}

export default function PhysicsBallsEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, down: false });
  const grabbedRef = useRef<number | null>(null);
  const prevMouseRef = useRef<{ x: number; y: number }[]>([]);
  const activeRef = useRef(false);

  useEffect(() => {
    // Disable on touch devices to avoid interference with scrolling
    if ('ontouchstart' in window) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      return { w: rect.width, h: rect.height };
    };

    const makeBall = (w: number, h: number): Ball => {
      const r = 10 + Math.random() * 14;
      return {
        x: r + Math.random() * (w - r * 2),
        y: r + Math.random() * (h * 0.5),
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2,
        r,
        mass: r * r,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };
    };

    const initBalls = () => {
      const dims = resize();
      if (!dims) return;
      ballsRef.current = Array.from({ length: BALL_COUNT }, () => makeBall(dims.w, dims.h));
    };

    const resolveCollisions = (balls: Ball[]) => {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i];
          const b = balls[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          const minDist = a.r + b.r;
          if (distSq >= minDist * minDist || distSq === 0) continue;

          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = (minDist - dist) * 0.5;
          const totalMass = a.mass + b.mass;
          const ra = b.mass / totalMass;
          const rb = a.mass / totalMass;

          a.x -= nx * overlap * ra * 2;
          a.y -= ny * overlap * ra * 2;
          b.x += nx * overlap * rb * 2;
          b.y += ny * overlap * rb * 2;

          const relVx = b.vx - a.vx;
          const relVy = b.vy - a.vy;
          const dot = relVx * nx + relVy * ny;
          if (dot >= 0) continue;

          const restitution = 0.55;
          const imp = (-(1 + restitution) * dot) / totalMass;
          a.vx -= imp * b.mass * nx;
          a.vy -= imp * b.mass * ny;
          b.vx += imp * a.mass * nx;
          b.vy += imp * a.mass * ny;
        }
      }
    };

    const loop = () => {
      if (!activeRef.current) return;
      const rect = container.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      prevMouseRef.current.push({ x: mx, y: my });
      if (prevMouseRef.current.length > 5) prevMouseRef.current.shift();

      for (let step = 0; step < SUBSTEPS; step++) {
        ballsRef.current.forEach((b, i) => {
          if (grabbedRef.current === i) {
            b.x = mx;
            b.y = my;
            b.vx = 0;
            b.vy = 0;
            return;
          }

          b.vy += GRAVITY / SUBSTEPS;
          const dx = b.x - mx;
          const dy = b.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (!mouseRef.current.down && dist < REPULSION_RADIUS && dist > 1) {
            const force = ((REPULSION_RADIUS - dist) / REPULSION_RADIUS) * 2.5;
            b.vx += (dx / dist) * (force / SUBSTEPS);
            b.vy += (dy / dist) * (force / SUBSTEPS);
          }

          b.x += b.vx / SUBSTEPS;
          b.y += b.vy / SUBSTEPS;

          // Robustness checks
          if (!Number.isFinite(b.x)) b.x = W * 0.5;
          if (!Number.isFinite(b.y)) b.y = H * 0.5;
          if (!Number.isFinite(b.vx)) b.vx = 0;
          if (!Number.isFinite(b.vy)) b.vy = 0;

          // Boundary checks
          if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx = Math.abs(b.vx) * DAMPING;
          }
          if (b.x + b.r > W) {
            b.x = W - b.r;
            b.vx = -Math.abs(b.vx) * DAMPING;
          }
          if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy = Math.abs(b.vy) * DAMPING;
          }
          if (b.y + b.r > H) {
            b.y = H - b.r;
            b.vy = -Math.abs(b.vy) * DAMPING;
          }

          b.vx *= FRICTION;
          b.vy *= FRICTION;
        });
        resolveCollisions(ballsRef.current);
      }

      ballsRef.current.forEach((b, i) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        if (grabbedRef.current === i) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Cursor feedback
      const hovering = ballsRef.current.some(b => Math.hypot(b.x - mx, b.y - my) < b.r + 4);
      canvas.style.cursor = grabbedRef.current !== null ? 'grabbing' : hovering ? 'grab' : 'default';

      animRef.current = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !activeRef.current) {
        activeRef.current = true;
        initBalls();
        animRef.current = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && activeRef.current) {
        activeRef.current = false;
        cancelAnimationFrame(animRef.current);
      }
    }, { threshold: 0.1 });

    observer.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const onMouseDown = () => {
      mouseRef.current.down = true;
      prevMouseRef.current = [];
      let closest = -1;
      let closestDist = GRAB_RADIUS;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ballsRef.current.forEach((b, i) => {
        const d = Math.hypot(b.x - mx, b.y - my);
        if (d < closestDist) {
          closestDist = d;
          closest = i;
        }
      });
      grabbedRef.current = closest >= 0 ? closest : null;
    };

    const onMouseUp = () => {
      mouseRef.current.down = false;
      if (grabbedRef.current !== null && prevMouseRef.current.length >= 2) {
        const b = ballsRef.current[grabbedRef.current];
        const n = prevMouseRef.current.length;
        b.vx = (prevMouseRef.current[n - 1].x - prevMouseRef.current[0].x) * 0.5;
        b.vy = (prevMouseRef.current[n - 1].y - prevMouseRef.current[0].y) * 0.5;
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > 18) {
          b.vx = (b.vx / speed) * 18;
          b.vy = (b.vy / speed) * 18;
        }
      }
      grabbedRef.current = null;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const ro = new ResizeObserver(() => {
      if (activeRef.current) {
        cancelAnimationFrame(animRef.current);
        initBalls();
        animRef.current = requestAnimationFrame(loop);
      }
    });
    ro.observe(container);

    return () => {
      observer.disconnect();
      ro.disconnect();
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[2] pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none', pointerEvents: 'auto' }}
      />
    </div>
  );
}
