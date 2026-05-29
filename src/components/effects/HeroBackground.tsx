import React, { useEffect, useRef } from 'react';

/**
 * HeroBackground
 *
 * Cinematic layered hero background:
 * - Ultra-dark premium base
 * - Perspective grid
 * - Animated vertical light streak overlay
 * - Ambient radial spotlight
 * - Massive geometric wireframe
 * - Floating star particles
 * - Bottom vignette fade
 */

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    interface Particle {
      x: number;
      y: number;
      r: number;
      opacity: number;
      speed: number;
      phase: number;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 140;

    const generateParticles = () => {
      particles.length = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          r: Math.random() > 0.8 ? 1.2 : 0.7,
          opacity: Math.random() * 0.18 + 0.03,
          speed: Math.random() * 0.01 + 0.003,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    generateParticles();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    let frame = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      frame += 1;

      particles.forEach((p) => {
        const twinkle =
          Math.sin(frame * p.speed + p.phase) * 0.08;

        const alpha = p.opacity + twinkle;

        const x = p.x * w;
        const y = p.y * h;

        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255,255,255,${Math.max(
          0,
          alpha
        )})`;

        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#050505',
      }}
    >
      {/* ========================================================= */}
      {/* BASE GRID */}
      {/* ========================================================= */}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(circle at center, white, transparent 92%)',
        }}
      />

      {/* ========================================================= */}
      {/* AMBIENT CENTRAL SPOTLIGHT */}
      {/* ========================================================= */}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(
              ellipse 45% 60% at 50% 38%,
              rgba(255,255,255,0.08) 0%,
              rgba(255,255,255,0.04) 25%,
              rgba(255,255,255,0.015) 45%,
              transparent 72%
            )
          `,
          filter: 'blur(40px)',
        }}
      />

      {/* ========================================================= */}
      {/* VERTICAL LIGHT BEAM */}
      {/* ========================================================= */}

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '-10%',
          transform: 'translateX(-50%)',
          width: '38vw',
          height: '120%',
          background: `
            linear-gradient(
              180deg,
              transparent 0%,
              rgba(255,255,255,0.08) 20%,
              rgba(255,255,255,0.12) 50%,
              rgba(255,255,255,0.08) 80%,
              transparent 100%
            )
          `,
          filter: 'blur(120px)',
          opacity: 0.5,
        }}
      />

      {/* ========================================================= */}
      {/* ANIMATED LIGHT LINES OVERLAY */}
      {/* ========================================================= */}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.22,
        }}
      >
        <g opacity="0.12">
          <rect x="320" width="1" height="1080" fill="white" />
          <rect x="620" width="2" height="1080" fill="white" />
          <rect x="870" width="1" height="1080" fill="white" />
          <rect x="1100" width="1" height="1080" fill="white" />
          <rect x="1250" width="2" height="1080" fill="white" />
          <rect x="1540" width="1" height="1080" fill="white" />
        </g>

        <g opacity="0.85">
          <rect
            x="619"
            y="-400"
            width="2"
            height="160"
            fill="white"
          >
            <animate
              attributeName="y"
              from="-400"
              to="1400"
              dur="7s"
              repeatCount="indefinite"
            />
          </rect>

          <rect
            x="1249"
            y="1200"
            width="2"
            height="140"
            fill="white"
          >
            <animate
              attributeName="y"
              from="1200"
              to="-400"
              dur="9s"
              repeatCount="indefinite"
            />
          </rect>

          <rect
            x="870"
            y="-300"
            width="1"
            height="100"
            fill="white"
          >
            <animate
              attributeName="y"
              from="-300"
              to="1300"
              dur="6s"
              repeatCount="indefinite"
            />
          </rect>

          <rect
            x="1540"
            y="-500"
            width="1"
            height="180"
            fill="white"
          >
            <animate
              attributeName="y"
              from="-500"
              to="1300"
              dur="10s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      </svg>

      {/* ========================================================= */}
      {/* MASSIVE DIAMOND WIREFRAME */}
      {/* ========================================================= */}

      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(82vw, 900px)',
          height: 'min(82vw, 900px)',
          transform: 'translate(-50%, -50%)',
          opacity: 0.05,
        }}
      >
        <rect
          x="80"
          y="80"
          width="440"
          height="440"
          stroke="white"
          strokeWidth="1"
          transform="rotate(45 300 300)"
        />

        <rect
          x="150"
          y="150"
          width="300"
          height="300"
          stroke="white"
          strokeWidth="0.8"
          transform="rotate(45 300 300)"
        />

        <line
          x1="300"
          y1="0"
          x2="300"
          y2="600"
          stroke="white"
          strokeWidth="0.5"
        />

        <line
          x1="0"
          y1="300"
          x2="600"
          y2="300"
          stroke="white"
          strokeWidth="0.5"
        />

        <circle
          cx="300"
          cy="300"
          r="6"
          stroke="white"
          strokeWidth="0.6"
        />
      </svg>

      {/* ========================================================= */}
      {/* BOTTOM VIGNETTE */}
      {/* ========================================================= */}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(
              to bottom,
              transparent 0%,
              transparent 72%,
              rgba(0,0,0,0.35) 100%
            )
          `,
        }}
      />

      {/* ========================================================= */}
      {/* EDGE VIGNETTE */}
      {/* ========================================================= */}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(
              circle at center,
              transparent 45%,
              rgba(0,0,0,0.55) 100%
            )
          `,
        }}
      />

      {/* ========================================================= */}
      {/* PARTICLE LAYER */}
      {/* ========================================================= */}

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}