import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePerformance } from '../hooks/usePerformance';

// Lazy load below-the-fold or heavy components
const ServiceFeature = lazy(() => import('../components/ServiceFeature'));
const SpotlightNavbar = lazy(() => import('../components/SpotlightNavbar').then(m => ({ default: m.SpotlightNavbar })));
const CustomCursor = lazy(() => import('../components/effects/CustomCursor'));
const IridescentSpheres = lazy(() => import('../components/effects/IridescentSpheres'));
const PhysicsBallsEffect = lazy(() => import('../components/effects/PhysicsBallsEffect'));
const InteractiveGlow = lazy(() => import('../components/effects/InteractiveGlow'));
const SphereWrapper = lazy(() => import('../components/effects/SphereWrapper'));
const LiquidEffectAnimation = lazy(() => import('../components/ui/liquid-effect-animation').then(m => ({ default: m.LiquidEffectAnimation })));
const IntroOverlay = lazy(() => import('../components/IntroOverlay'));
const ContactOverlay = lazy(() => import('../components/ContactOverlay').then(m => ({ default: m.ContactOverlay })));
const CinematicScrollProgress = lazy(() => import('../components/effects/CinematicScrollProgress'));

export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { isLowEnd, isMobile } = usePerformance();

  useEffect(() => {
    if (!isIntroComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.overflowX = 'hidden';
    }
  }, [isIntroComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isLowEnd ? 0 : 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isLowEnd ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isLowEnd ? 0.3 : 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-bg selection:bg-white selection:text-black">
      <Suspense fallback={null}>
        <AnimatePresence>
          {!isIntroComplete && (
            <IntroOverlay onComplete={() => setIsIntroComplete(true)} />
          )}
        </AnimatePresence>
      </Suspense>

      <Suspense fallback={null}>
        {!isMobile && <CustomCursor />}
      </Suspense>

      <Suspense fallback={null}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isIntroComplete ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="fixed inset-0 w-full h-screen z-[100] pointer-events-none"
        >
          <div className="w-full h-full relative">
            <SpotlightNavbar onContactClick={() => setIsContactOpen(true)} />
          </div>
        </motion.div>
      </Suspense>
      
      <Suspense fallback={null}>
        <CinematicScrollProgress />
      </Suspense>

      <motion.div
        animate={{ 
          scale: isContactOpen ? 0.98 : 1,
          opacity: isContactOpen ? 0.4 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="will-change-transform"
      >

        <motion.div
          initial="hidden"
          animate={isIntroComplete ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Hero Section */}
          <section id="home" className="relative min-h-screen md:min-h-screen flex items-center justify-center p-6 md:p-20 overflow-hidden" style={{ minHeight: '100svh' }}>
            <div className="hero-glow pointer-events-none" />
            
            <div className="relative z-10 max-w-5xl w-full text-center">
              <motion.div
                variants={itemVariants}
                className="blur-reveal"
              >
                <h1 className="fluid-h1 mb-8">
                  Create With <br />
                  Perfection.
                </h1>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-muted text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-body tracking-tight"
              >
                Engineering high-performance landing pages for modern tech brands. 
                Delivered with surgical focus and cinematic quality.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center gap-20"
              >
                <button 
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary md:group"
                >
                  Start Building 
                  <span className="hidden md:inline-block md:group-hover:translate-x-1 transition-transform ml-2">→</span>
                </button>

                {!isLowEnd && (
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
                    <span className="font-ui text-[10px] uppercase tracking-[0.3em] text-muted/50">Scroll</span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </section>

          <Suspense fallback={<div className="h-screen bg-black" />}>
            <motion.div variants={itemVariants} className="content-visibility-auto">
              <IridescentSpheres />
            </motion.div>
          </Suspense>

          {/* Services Section */}
          <div id="services" className="bg-bg">
            <Suspense fallback={<div className="h-screen bg-black" />}>
              <motion.div variants={itemVariants} className="content-visibility-auto">
                <ServiceFeature 
                  index="01"
                  label="01 / LANDING ARCHITECTURE"
                  title="Landing pages engineered for conversion."
                  description="Strategically structured interfaces designed to guide attention, reduce friction, and maximize customer action through precision-focused layouts."
                  align="top-left"
                  effect={!isLowEnd ? <LiquidEffectAnimation /> : null}
                />
              </motion.div>
            </Suspense>

            <Suspense fallback={<div className="h-screen bg-black" />}>
              <motion.div variants={itemVariants} className="content-visibility-auto">
                <ServiceFeature 
                  index="02"
                  label="02 / PERFORMANCE"
                  title="Built for speed at every layer."
                  description="Optimized frontend systems with lightweight architecture, fast rendering, and seamless interactions that improve engagement and retention."
                  align="bottom-right"
                  effect={!isLowEnd ? <PhysicsBallsEffect /> : null}
                />
              </motion.div>
            </Suspense>

            <Suspense fallback={<div className="h-screen bg-black" />}>
              <motion.div variants={itemVariants} className="content-visibility-auto">
                <ServiceFeature 
                  index="03"
                  label="03 / TECHNICAL SEO"
                  title="Search visibility integrated from the foundation."
                  description="Modern technical SEO principles implemented directly into the build process to strengthen discoverability and long-term growth."
                  align="top-right"
                  effect={!isLowEnd ? <SphereWrapper /> : null}
                />
              </motion.div>
            </Suspense>

            <Suspense fallback={<div className="h-screen bg-black" />}>
              <motion.div variants={itemVariants} className="content-visibility-auto">
                <ServiceFeature 
                  index="04"
                  label="04 / SCALABLE SYSTEMS"
                  title="Digital systems designed to evolve with your brand."
                  description="Flexible and maintainable structures built to support future expansion without sacrificing performance, consistency, or usability."
                  align="bottom-left"
                  effect={!isLowEnd ? <InteractiveGlow /> : null}
                />
              </motion.div>
            </Suspense>
          </div>

          {/* Why Section */}
          <section id="why" className="py-[clamp(3rem,8vw,8rem)] px-6 md:px-20 bg-[#050505] border-y border-white/5 relative overflow-hidden content-visibility-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-white/[0.02] blur-[100px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 md:gap-20">
                <motion.div variants={itemVariants}>
                   <div className="font-ui text-[13px] uppercase tracking-[0.2em] text-muted mb-6">WHY RHODIUM / PHILOSOPHY</div>
                   <h2 className="fluid-h2">Simplicity is sophistication.</h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                  {[
                    { t: "01 / Speed", d: "Production-ready within 5 business days." },
                    { t: "02 / Focus", d: "One niche. One expert. Professional result." },
                    { t: "03 / Tech", d: "React, Tailwind, Framer. No bloat." },
                    { t: "04 / Value", d: "Conversion optimization as standard." }
                  ].map((item, i) => (
                    <motion.div key={i} variants={itemVariants}>
                      <div className="text-white font-display text-xl font-bold mb-4 tracking-tight">{item.t}</div>
                      <p className="text-muted text-base leading-relaxed max-w-xs font-body">{item.d}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* Large Footnote Branding */}
          <section className="py-[140px] flex items-center justify-center overflow-hidden pointer-events-none select-none content-visibility-auto">
            <motion.h2
              variants={itemVariants}
              className="font-display text-[18vw] md:text-[18vw] font-extrabold leading-none tracking-tighter uppercase whitespace-nowrap text-white"
            >
              Rhodium
            </motion.h2>
          </section>

          {/* Footer */}
          <footer className="py-[clamp(3rem,6vw,5rem)] px-6 md:px-20 border-t border-white/10 relative z-10 bg-black content-visibility-auto">
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
        </motion.div>
      </motion.div>

      <Suspense fallback={null}>
        <ContactOverlay isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </Suspense>
    </div>
  );
}
