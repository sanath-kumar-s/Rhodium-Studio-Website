import React, { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
} from 'motion/react';

import { usePerformance } from '../../hooks/usePerformance';

export default function InteractiveGlow() {
  const { isMobile, isLowEnd } = usePerformance();

  const containerRef = useRef<HTMLDivElement>(null);

  // Raw mouse positions
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  // Visibility motion value
  const visibility = useMotionValue(0);

  // Smooth interpolation
  const smoothX = useSpring(mouseX, {
    stiffness: 180,
    damping: 28,
    mass: 0.6,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 180,
    damping: 28,
    mass: 0.6,
  });

  // Smooth opacity transition
  const opacity = useSpring(visibility, {
    stiffness: 120,
    damping: 20,
  });

  useEffect(() => {
    if (isMobile || isLowEnd) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      mouseX.set(relativeX);
      mouseY.set(relativeY);

      const padding = 120;

      const inside =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      visibility.set(inside ? 1 : 0);
    };

    window.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, isLowEnd, mouseX, mouseY, visibility]);

  if (isMobile || isLowEnd) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Interactive Glow */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          opacity,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        className="absolute w-[550px] h-[550px] rounded-full"
      >
        {/* Main soft glow */}
        <div className="absolute inset-0 rounded-full bg-white/5 blur-3xl" />

        {/* Secondary depth layer */}
        <div className="absolute inset-0 rounded-full bg-white/[0.03] blur-2xl scale-125" />

        {/* Tiny bright core */}
        <div className="absolute inset-[35%] rounded-full bg-white/[0.08] blur-xl" />
      </motion.div>

      {/* Ambient static lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.025),transparent_60%)]" />

      {/* Fine grain layer */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(rgba(255,255,255,0.18) 0.6px, transparent 0.6px),
            radial-gradient(rgba(255,255,255,0.08) 0.4px, transparent 0.4px)
          `,
          backgroundPosition: '0 0, 2px 2px',
          backgroundSize: '4px 4px, 3px 3px',
        }}
      />

      {/* Organic noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-soft-light"
        style={{
          backgroundImage: `
            repeating-radial-gradient(
              circle at 0 0,
              rgba(255,255,255,0.08) 0px,
              transparent 2px
            )
          `,
          backgroundSize: '6px 6px',
        }}
      />

      {/* Film grain flicker */}
      <motion.div
        animate={{
          opacity: [0.015, 0.03, 0.02, 0.025],
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.03) 0px,
              rgba(255,255,255,0.01) 1px,
              transparent 2px,
              transparent 4px
            )
          `,
        }}
      />
    </div>
  );
}