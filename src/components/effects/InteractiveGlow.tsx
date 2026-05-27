import React, { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
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

      {/* Lightweight grain */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-soft-light"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)',
          backgroundSize: '4px 4px',
        }}
      />
    </div>
  );
}