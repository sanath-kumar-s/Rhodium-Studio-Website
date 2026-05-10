/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ── SECTION 2 EFFECT — Physics Balls

import React, { useEffect, useRef } from 'react';

const BALL_COUNT = 60;
const GRAVITY = 0.4;
const BOUNCE_DAMPING = 0.75;
const REPULSION_RADIUS = 80;
const GRAB_RADIUS = 60;

interface Ball {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; mass: number;
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
    // Disable on touch devices
    if ('ontouchstart' in window) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !activeRef.current) {
        activeRef.current = true;
        initBalls();
        startLoop();
      } else if (!entry.isIntersecting && activeRef.current) {
        activeRef.current = false;
        cancelAnimationFrame(animRef.current);
      }
    }, { threshold: 0.1 });

    observer.observe(container);

    const initBalls = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      ballsRef.current = Array.from({ length: BALL_COUNT }, () => {
        const r = 12 + Math.random() * 10;
        return {
          x: r + Math.random() * (W - r * 2),
          y: r + Math.random() * (H / 2),
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 2,
          radius: r,
          mass: r,
        };
      });
    };

    const resolveCollisions = (balls: Ball[]) => {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i]; const b = balls[j];
          const dx = b.x - a.x; const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = a.radius + b.radius;
          if (dist < minDist && dist > 0) {
            const nx = dx / dist; const ny = dy / dist;
            const overlap = (minDist - dist) / 2;
            a.x -= nx * overlap; a.y -= ny * overlap;
            b.x += nx * overlap; b.y += ny * overlap;
            const relVx = b.vx - a.vx; const relVy = b.vy - a.vy;
            const dot = relVx * nx + relVy * ny;
            if (dot < 0) {
              const imp = (2 * dot) / (a.mass + b.mass);
              a.vx += imp * b.mass * nx; a.vy += imp * b.mass * ny;
              b.vx -= imp * a.mass * nx; b.vy -= imp * a.mass * ny;
            }
          }
        }
      }
    };

    const drawBall = (ctx: CanvasRenderingContext2D, b: Ball) => {
      const grad = ctx.createRadialGradient(
        b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.1,
        b.x, b.y, b.radius
      );
      grad.addColorStop(0, 'rgba(255,255,255,0.95)');
      grad.addColorStop(1, 'rgba(180,180,180,0.7)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const startLoop = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const loop = () => {
        if (!activeRef.current) return;
        const W = canvas.width; const H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const mx = mouseRef.current.x; const my = mouseRef.current.y;
        prevMouseRef.current.push({ x: mx, y: my });
        if (prevMouseRef.current.length > 3) prevMouseRef.current.shift();

        ballsRef.current.forEach((b, i) => {
          if (grabbedRef.current === i) {
            b.x = mx; b.y = my; b.vx = 0; b.vy = 0;
          } else {
            b.vy += GRAVITY;
            const dx = b.x - mx; const dy = b.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (!mouseRef.current.down && dist < REPULSION_RADIUS) {
              const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS * 2;
              b.vx += (dx / dist) * force;
              b.vy += (dy / dist) * force;
            }
            b.x += b.vx; b.y += b.vy;
            if (b.x - b.radius < 0) { b.x = b.radius; b.vx *= -BOUNCE_DAMPING; }
            if (b.x + b.radius > W) { b.x = W - b.radius; b.vx *= -BOUNCE_DAMPING; }
            if (b.y - b.radius < 0) { b.y = b.radius; b.vy *= -BOUNCE_DAMPING; }
            if (b.y + b.radius > H) { b.y = H - b.radius; b.vy *= -BOUNCE_DAMPING; }
            b.vx *= 0.99; b.vy *= 0.99;
          }
          drawBall(ctx, b);
        });

        resolveCollisions(ballsRef.current);
        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onMouseDown = () => {
      mouseRef.current.down = true;
      const mx = mouseRef.current.x; const my = mouseRef.current.y;
      let closest = -1; let closestDist = GRAB_RADIUS;
      ballsRef.current.forEach((b, i) => {
        const d = Math.hypot(b.x - mx, b.y - my);
        if (d < closestDist) { closestDist = d; closest = i; }
      });
      grabbedRef.current = closest >= 0 ? closest : null;
    };
    const onMouseUp = () => {
      mouseRef.current.down = false;
      if (grabbedRef.current !== null) {
        const hist = prevMouseRef.current;
        if (hist.length >= 2) {
          const b = ballsRef.current[grabbedRef.current];
          b.vx = hist[hist.length - 1].x - hist[0].x;
          b.vy = hist[hist.length - 1].y - hist[0].y;
        }
      }
      grabbedRef.current = null;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const ro = new ResizeObserver(() => {
      if (canvas && container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        initBalls();
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
        style={{ cursor: 'default', pointerEvents: 'auto' }}
      />
    </div>
  );
}
