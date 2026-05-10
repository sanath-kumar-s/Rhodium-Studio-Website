/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

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
  
  // Dynamic alignment classes
  const alignmentStyles = {
    'top-left': 'justify-start items-start text-left',
    'bottom-right': 'justify-end items-end text-right ml-auto',
    'top-right': 'justify-end items-start text-right ml-auto',
    'bottom-left': 'justify-start items-end text-left',
  };

  const containerAlignment = {
    'top-left': 'items-start justify-start',
    'bottom-right': 'items-end justify-end',
    'top-right': 'items-start justify-end',
    'bottom-left': 'items-end justify-start',
  };

  return (
    <section className={cn(
      "relative min-h-[90vh] w-full flex p-10 md:p-24 overflow-hidden border-b border-white/[0.03]",
      containerAlignment[align],
      className
    )}>
      {/* Background Number */}
      <div className={cn(
        "absolute pointer-events-none select-none font-display font-black text-[30vw] leading-none opacity-[0.02] text-white z-0",
        align.includes('right') ? 'left-0' : 'right-0',
        align.includes('bottom') ? 'top-0' : 'bottom-0'
      )}>
        {index}
      </div>

      {/* Subtle Glow Overlay */}
      <div className={cn(
        "absolute w-[600px] h-[600px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none z-0",
        align === 'top-left' && '-top-48 -left-48',
        align === 'bottom-right' && '-bottom-48 -right-48',
        align === 'top-right' && '-top-48 -right-48',
        align === 'bottom-left' && '-bottom-48 -left-48',
      )} />

      {/* Scoped Interactive Effect Layer */}
      {effect}

      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
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
          "text-muted text-lg md:text-xl font-body leading-relaxed max-w-[420px] tracking-tight",
          align.includes('right') ? 'ml-auto' : ''
        )}>
          {description}
        </p>
      </motion.div>
    </section>
  );
}
