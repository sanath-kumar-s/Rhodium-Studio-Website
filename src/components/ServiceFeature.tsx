import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { cn } from '../lib/utils';
import { usePerformance } from '../hooks/usePerformance';

interface ServiceFeatureProps {
  label: string;
  title: string;
  description: string;
  index: string;
  align: 'top-left' | 'bottom-right' | 'top-right' | 'bottom-left';
  className?: string;
  effect?: React.ReactNode;
}

export default function ServiceFeature({
  label,
  title,
  description,
  index,
  align,
  className,
  effect,
}: ServiceFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLowEnd } = usePerformance();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], isLowEnd ? [0, 0] : [-100, 100]);
  
  // Dynamic alignment classes
  const alignmentStyles = {
    'top-left': 'justify-start items-start text-left md:text-left',
    'bottom-right': 'justify-end items-end text-left md:text-right ml-auto',
    'top-right': 'justify-end items-start text-left md:text-right ml-auto',
    'bottom-left': 'justify-start items-end text-left md:text-left',
  };

  const containerAlignment = {
    'top-left': 'items-start justify-start',
    'bottom-right': 'items-start md:items-end justify-start md:justify-end',
    'top-right': 'items-start justify-start md:justify-end',
    'bottom-left': 'items-start md:items-end justify-start',
  };

  return (
    <section 
      ref={containerRef}
      className={cn(
        "relative min-h-[70vh] md:min-h-[90vh] w-full flex p-6 md:p-24 overflow-hidden border-b border-white/[0.03] will-change-transform",
        containerAlignment[align],
        className
      )}
    >
      {/* Background Number with subtle parallax */}
      <motion.div 
        style={{ y: isLowEnd ? 0 : y }}
        className={cn(
          "absolute pointer-events-none select-none font-display font-black text-[30vw] leading-none opacity-[0.02] text-white z-0",
          align.includes('right') ? 'left-0' : 'right-0',
          align.includes('bottom') ? 'top-0' : 'bottom-0'
        )}
      >
        {index}
      </motion.div>

      {/* Subtle Glow Overlay */}
      {!isLowEnd && (
        <div className={cn(
          "absolute w-[600px] h-[600px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none z-0",
          align === 'top-left' && '-top-48 -left-48',
          align === 'bottom-right' && '-bottom-48 -right-48',
          align === 'top-right' && '-top-48 -right-48',
          align === 'bottom-left' && '-bottom-48 -left-48',
        )} />
      )}

      {/* Scoped Interactive Effect Layer */}
      {effect}

      {/* Content Container */}
      <motion.div 
        initial={isLowEnd ? { opacity: 0 } : { opacity: 0, y: 30, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: isLowEnd ? 0.4 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn("relative z-10 max-w-4xl", alignmentStyles[align])}
      >
        {/* Label */}
        <div className="label-text mb-8 flex items-center gap-4">
          <span className="w-8 h-[1px] bg-white/20" />
          {label}
        </div>

        {/* Heading */}
        <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-display font-extrabold leading-[0.9] tracking-[-0.06em] mb-10 text-white">
          {title}
        </h2>

        {/* Divider (Optional accent) */}
        <div className={cn(
          "w-24 h-[1px] bg-white/10 mb-10",
          align.includes('right') ? 'ml-auto' : ''
        )} />

        {/* Description */}
        <p className={cn(
          "text-muted text-base md:text-xl font-body leading-relaxed max-w-[420px] tracking-tight",
          align.includes('right') ? 'md:ml-auto' : ''
        )}>
          {description}
        </p>
      </motion.div>
    </section>
  );
}
