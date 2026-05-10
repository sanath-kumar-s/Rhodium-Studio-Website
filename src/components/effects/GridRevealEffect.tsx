/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ── SECTION 1 EFFECT — Grid Reveal

import React, { useEffect, useRef, useState } from 'react';

const GRID_COLS = 8;
const GRID_ROWS = 6;
const STAGGER = 40; // ms per diagonal step

export default function GridRevealEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !revealed) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed]);

  const cells = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const delay = (col + row) * STAGGER;
      cells.push(
        <div
          key={`${row}-${col}`}
          style={{
            width: `${100 / GRID_COLS}%`,
            height: `${100 / GRID_ROWS}%`,
            backgroundColor: '#1a1a1a',
            transformOrigin: 'top',
            transition: revealed
              ? `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`
              : 'none',
            opacity: revealed ? 0 : 1,
            transform: revealed ? 'scaleY(0)' : 'scaleY(1)',
          }}
        />
      );
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
      <div className="w-full h-full flex flex-wrap">
        {cells}
      </div>
    </div>
  );
}
