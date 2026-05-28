/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { usePerformance } from "../hooks/usePerformance";

interface SpotlightNavbarMobileProps {
  onContactClick?: () => void;
}

export function SpotlightNavbarMobile({ onContactClick }: SpotlightNavbarMobileProps) {
  const { isLowEnd } = usePerformance();

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 1.2,
        duration: 1.0,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <button
        onClick={onContactClick}
        style={{ pointerEvents: "auto" }}
        className={[
          "flex items-center gap-2 px-7 py-4 rounded-full",
          "bg-black/70 border border-white/10",
          "font-ui text-[13px] font-medium tracking-widest uppercase text-white",
          "shadow-[0_0_40px_rgba(255,255,255,0.04)]",
          "active:scale-95 transition-transform duration-150",
          isLowEnd ? "" : "backdrop-blur-[20px]",
        ].join(" ")}
        aria-label="Open contact"
      >
        {/* Subtle dot indicator */}
        <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
        Contact
      </button>
    </motion.div>
  );
}
