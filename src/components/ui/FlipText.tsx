import React from 'react';

interface FlipTextProps {
  text: string;
  duration?: number;
  className?: string;
}

export default function FlipText({
  text,
  duration = 3,
  className = '',
}: FlipTextProps) {
  return (
    <span
      className={`flip-text-wrapper inline-flex ${className}`}
      aria-label={text}
      style={{ perspective: '600px' }}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="flip-char"
          data-char={char}
          aria-hidden="true"
          style={
            {
              '--flip-duration': `${duration}s`,
              '--flip-delay': '0s',
              display: 'inline-block',
              transformStyle: 'preserve-3d',
              position: 'relative',
            } as React.CSSProperties
          }
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}