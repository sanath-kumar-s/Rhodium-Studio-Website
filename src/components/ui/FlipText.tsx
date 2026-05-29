import React from 'react';

interface FlipTextProps {
  text: string;
  duration?: number;
  className?: string;
}

export default function FlipText({
  text,
  duration = 6,
  className = '',
}: FlipTextProps) {
  return (
    <span
      className={`flip-text-wrapper inline-flex ${className}`}
      aria-label={text}
      style={{ perspective: '600px' }}
    >
      {text.split('').map((char, i) => {
        const c = char === ' ' ? '\u00A0' : char;

        return (
          <span
            key={i}
            className="flip-char"
            aria-hidden="true"
            style={
              {
                '--flip-duration': `${duration}s`,
                '--flip-delay': '0s',
                display: 'inline-block',
                position: 'relative',
                transformStyle: 'preserve-3d',
                width: '1em',
                height: '1em',
              } as React.CSSProperties
            }
          >
            <span className="face front">{c}</span>
            <span className="face back">{c}</span>
            <span className="face top">{c}</span>
            <span className="face bottom">{c}</span>
          </span>
        );
      })}
    </span>
  );
}