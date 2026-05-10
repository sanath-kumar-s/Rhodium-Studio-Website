/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import ServiceFeature from '../components/ServiceFeature';
import { SpotlightNavbar } from '../components/SpotlightNavbar';
import CustomCursor from '../components/CustomCursor';
import IridescentSpheres from '../components/IridescentSpheres';
import PhysicsBallsEffect from '../components/effects/PhysicsBallsEffect';
import InteractiveGlow from '../components/effects/InteractiveGlow';
import SphereWrapper from '../components/effects/SphereWrapper';
import { LiquidEffectAnimation } from '../components/ui/liquid-effect-animation';

export default function Home() {

  return (
    <div className="relative min-h-screen bg-bg selection:bg-white selection:text-black">
      <div className="noise-overlay" />
      <CustomCursor />
      <SpotlightNavbar />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center p-6 md:p-20 overflow-hidden">
        <div className="hero-glow" />
        
        <div className="relative z-10 max-w-5xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="blur-reveal"
          >
            <h1 className="fluid-h1 mb-8">
              Create With <br />
              Perfection.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-muted text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-body tracking-tight"
          >
            Engineering high-performance landing pages for modern tech brands. 
            Delivered with surgical focus and cinematic quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col items-center justify-center gap-20"
          >
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary group"
            >
              Start Building 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {/* Subtle Scroll Indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
              <span className="font-ui text-[10px] uppercase tracking-[0.3em] text-muted/50">Scroll</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <IridescentSpheres />

      {/* Services Section - Redesigned into Cinematic Features */}
      <div id="services" className="bg-bg">
        <ServiceFeature 
          index="01"
          label="01 / LANDING ARCHITECTURE"
          title="Landing pages engineered for conversion."
          description="Strategically structured interfaces designed to guide attention, reduce friction, and maximize customer action through precision-focused layouts."
          align="top-left"
          effect={<LiquidEffectAnimation />}
        />
        <ServiceFeature 
          index="02"
          label="02 / PERFORMANCE"
          title="Built for speed at every layer."
          description="Optimized frontend systems with lightweight architecture, fast rendering, and seamless interactions that improve engagement and retention."
          align="bottom-right"
          effect={<PhysicsBallsEffect />}
        />
        <ServiceFeature 
          index="03"
          label="03 / TECHNICAL SEO"
          title="Search visibility integrated from the foundation."
          description="Modern technical SEO principles implemented directly into the build process to strengthen discoverability and long-term growth."
          align="top-right"
          effect={<SphereWrapper />}
        />
        <ServiceFeature 
          index="04"
          label="04 / SCALABLE SYSTEMS"
          title="Digital systems designed to evolve with your brand."
          description="Flexible and maintainable structures built to support future expansion without sacrificing performance, consistency, or usability."
          align="bottom-left"
          effect={<InteractiveGlow />}
        />
      </div>

      {/* Why Section */}
      <section id="why" className="py-[140px] px-6 md:px-20 bg-[#050505] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-white/[0.02] blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
               <div className="font-ui text-[13px] uppercase tracking-[0.2em] text-muted mb-6">WHY RHODIUM / PHILOSOPHY</div>
               <h2 className="fluid-h2">Simplicity is sophistication.</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {[
                { t: "01 / Speed", d: "Production-ready within 5 business days." },
                { t: "02 / Focus", d: "One niche. One expert. Professional result." },
                { t: "03 / Tech", d: "React, Tailwind, Framer. No bloat." },
                { t: "04 / Value", d: "Conversion optimization as standard." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-white font-display text-xl font-bold mb-4 tracking-tight">{item.t}</div>
                  <p className="text-muted text-base leading-relaxed max-w-xs font-body">{item.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Large Footnote Branding */}
      <section className="py-[140px] flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[18vw] font-extrabold leading-none tracking-tighter uppercase whitespace-nowrap text-white"
        >
          Rhodium
        </motion.h2>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-20 border-t border-white/10 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
             <div className="font-display text-2xl font-bold tracking-tighter text-white">RHODIUM.</div>
             <p className="text-muted text-sm font-ui uppercase tracking-widest">© 2024 Design Studio / Est. London</p>
          </div>
          <div className="flex items-center gap-10">
             <a href="#" className="font-ui text-xs uppercase tracking-widest text-muted hover:text-white transition-colors">Instagram</a>
             <a href="#" className="font-ui text-xs uppercase tracking-widest text-muted hover:text-white transition-colors">Github</a>
             <a href="#" className="font-ui text-xs uppercase tracking-widest text-muted hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
