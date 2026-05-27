/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: any;
}

export default function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  return (
    <div 
      className="group relative p-8 bg-[#050505] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] h-full"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 mb-8 transition-transform duration-500 group-hover:scale-110">
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="font-display text-2xl font-bold text-white mb-4 tracking-tight leading-none group-hover:translate-x-1 transition-transform">
          {title}
        </h3>
        
        <p className="text-muted text-sm leading-relaxed max-w-[280px] font-body">
          {description}
        </p>
      </div>
    </div>
  );
}
