import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactContent } from './ContactContent';
import { usePerformance } from '../hooks/usePerformance';
import { cn } from '../lib/utils';

interface ContactOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactOverlay({ isOpen, onClose }: ContactOverlayProps) {
  const { isLowEnd } = usePerformance();

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll bleed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.overflowX = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.overflowX = 'hidden';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop dimming/blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={cn(
              "fixed inset-0 z-[150] bg-black/60 cursor-pointer",
              !isLowEnd && "backdrop-blur-sm"
            )}
          />

          {/* Immersive Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={isLowEnd ? { duration: 0.3 } : {
              type: "spring",
              damping: 30,
              stiffness: 150,
              mass: 0.8,
            }}
            drag={isLowEnd ? false : "y"}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 200) onClose();
            }}
            className="fixed inset-0 z-[200] flex flex-col bg-bg overflow-y-auto overflow-x-hidden touch-pan-y will-change-transform"
          >
            {/* Close Button & Header */}
            <div className="sticky top-0 z-50 flex justify-end p-10 pointer-events-none">
              <motion.button
                onClick={onClose}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={isLowEnd ? {} : { scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "pointer-events-auto bg-white/5 hover:bg-white/10 border border-white/10 rounded-full p-4 transition-colors group",
                  !isLowEnd && "backdrop-blur-md"
                )}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            </div>

            <div className="flex-1 flex flex-col items-center">
              <ContactContent />
              
              <footer className="mt-auto py-10 w-full px-10 md:px-20 border-t border-white/5 opacity-40">
                <div className="font-ui text-[10px] uppercase tracking-widest text-center">
                  © 2024 RHODIUM STUDIO / ALL RIGHTS RESERVED
                </div>
              </footer>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
