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

  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const visibility = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 140,
    damping: 24,
    mass: 0.8,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 140,
    damping: 24,
    mass: 0.8,
  });

  const opacity = useSpring(visibility, {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    if (isMobile || isLowEnd) return;

    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const rect =
          containerRef.current.getBoundingClientRect();

        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);

        const padding = 100;

        const inside =
          e.clientX >= rect.left - padding &&
          e.clientX <= rect.right + padding &&
          e.clientY >= rect.top - padding &&
          e.clientY <= rect.bottom + padding;

        visibility.set(inside ? 1 : 0);
      });
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove,
      { passive: true }
    );

    return () => {
      cancelAnimationFrame(rafId);

      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, [
    isMobile,
    isLowEnd,
    mouseX,
    mouseY,
    visibility,
  ]);

  if (isMobile || isLowEnd) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Cursor Glow */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          opacity,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        className="absolute w-[380px] h-[380px] rounded-full"
      >
        <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-2xl" />
      </motion.div>

      {/* Ambient Corner Light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at bottom left, rgba(255,255,255,0.02), transparent 60%)',
        }}
      />

      {/* Lightweight Grain */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.15) 0.5px, transparent 0.5px)',
          backgroundSize: '5px 5px',
        }}
      />
    </div>
  );
}