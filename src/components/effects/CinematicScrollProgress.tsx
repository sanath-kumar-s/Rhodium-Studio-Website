import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity, useMotionValue, AnimatePresence } from "motion/react";

const CinematicScrollProgress: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const loadingProgress = useMotionValue(0);

  // Choose between loading progress or scroll progress
  const activeProgress = useTransform(
    [scrollYProgress, loadingProgress],
    ([s, l]) => isLoading ? (l as number) : (s as number)
  );

  // Spring configuration for that "premium" overshoot and settle feel
  const scaleX = useSpring(activeProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track scroll velocity for reactive effects
  const scrollVelocity = useVelocity(scrollYProgress);

  // Intensify glow based on scroll velocity
  const glowIntensity = useTransform(
    scrollVelocity,
    [-1, 0, 1],
    [2, 1, 2]
  );

  // Pulse opacity while scrolling
  const lineOpacity = useTransform(
    activeProgress,
    [0, 0.05, 0.95, 1],
    [0.4, 1, 1, 0.4]
  );

  // Responsive stretch based on scroll velocity
  const scaleYVelocity = useTransform(scrollVelocity, [-2, 0, 2], [1.5, 1, 1.5]);

  useEffect(() => {
    setIsMounted(true);

    const handleProgress = (e: any) => {
      loadingProgress.set(e.detail / 100);
      if (e.detail >= 100) {
        // Stay in loading mode for a moment after 100% for the transition
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    window.addEventListener('loading-progress', handleProgress);
    return () => window.removeEventListener('loading-progress', handleProgress);
  }, []);

  // Use visibility: hidden or opacity instead of conditional return to maintain hook order
  return (
    <div
      className="fixed top-0 left-0 w-full z-[10000] pointer-events-none flex justify-center transition-opacity duration-500"
      style={{ opacity: isMounted ? 1 : 0 }}
    >
      {/* Symmetrical Scroll Progress Line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        style={{
          scaleX,
          opacity: lineOpacity,
          originX: 0.5,
          scaleY: scaleYVelocity
        }}
        className="relative w-full h-[1.5px] mt-[1px] premium-line-noise"
      >
        {/* The Core Line */}
        <div className="absolute inset-0 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />

        {/* Animated Noise/Particles inside the line */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
        </div>

        {/* Reactive Glow Layer */}
        <motion.div
          style={{ scaleY: glowIntensity }}
          className="absolute inset-0 bg-white/20 blur-[4px]"
        />

        {/* Ambient Reflection beneath the bar */}
        <motion.div
          animate={isLoading ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.5 }}
          transition={isLoading ? { repeat: Infinity, duration: 2 } : {}}
          className="absolute top-[4px] left-0 w-full h-[8px] bg-gradient-to-b from-white/10 to-transparent blur-[6px]"
        />

        {/* Loading Complete Flare */}
        <AnimatePresence>
          {isLoading && loadingProgress.get() >= 1 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 bg-white blur-[10px] z-10"
            />
          )}
        </AnimatePresence>
      </motion.div>


      {/* Subtle Noise Texture on the bar itself */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-2%, -2%); }
          40% { transform: translate(2%, 2%); }
          50% { transform: translate(-1%, 1%); }
          60% { transform: translate(1%, -1%); }
          70% { transform: translate(2%, 1%); }
          80% { transform: translate(-2%, -1%); }
          90% { transform: translate(1%, 2%); }
        }
        .premium-line-noise::after {
          content: "";
          position: absolute;
          top: -500%;
          left: -500%;
          width: 1000%;
          height: 1000%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.15;
          animation: grain 8s steps(10) infinite;
          pointer-events: none;
        }
      `}} />
    </div>
  );
};

export default CinematicScrollProgress;
