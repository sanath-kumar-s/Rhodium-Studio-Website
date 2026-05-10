import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlipFadeTextProps {
  words: string[];
  interval?: number;
  letterDuration?: number;
  staggerDelay?: number;
  exitStaggerDelay?: number;
  className?: string;
}

export const FlipFadeText: React.FC<FlipFadeTextProps> = ({
  words,
  interval = 1500,
  letterDuration = 0.3,
  staggerDelay = 0.05,
  exitStaggerDelay = 0.02,
  className = ""
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  const currentWord = words[index];

  return (
    <div className={`inline-flex items-center justify-center overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="flex whitespace-nowrap"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {currentWord.split("").map((letter, i) => (
            <motion.span
              key={i}
              variants={{
                initial: { opacity: 0, rotateX: -90, y: 5 },
                animate: { opacity: 1, rotateX: 0, y: 0 },
                exit: { opacity: 0, rotateX: 90, y: -5 }
              }}
              transition={{
                duration: letterDuration,
                delay: i * staggerDelay,
                ease: "easeOut"
              }}
              style={{ display: "inline-block", transformOrigin: "center" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
