import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePerformance } from '../hooks/usePerformance';

// Lazy load heavy components
const ServiceFeature = lazy(() => import('../components/ServiceFeature'));
const SpotlightNavbar = lazy(() =>
  import('../components/SpotlightNavbar').then(m => ({
    default: m.SpotlightNavbar
  }))
);
const SpotlightNavbarMobile = lazy(() =>
  import('../components/SpotlightNavbarMobile').then(m => ({
    default: m.SpotlightNavbarMobile
  }))
);
const CustomCursor = lazy(() => import('../components/effects/CustomCursor'));
const IridescentSpheres = lazy(() => import('../components/effects/IridescentSpheres'));
const PhysicsBallsEffect = lazy(() => import('../components/effects/PhysicsBallsEffect'));
const InteractiveGlow = lazy(() => import('../components/effects/InteractiveGlow'));
const SphereWrapper = lazy(() => import('../components/effects/SphereWrapper'));
const LiquidEffectAnimation = lazy(() =>
  import('../components/ui/liquid-effect-animation').then(m => ({
    default: m.LiquidEffectAnimation
  }))
);
const IntroOverlay = lazy(() => import('../components/IntroOverlay'));
const ContactOverlay = lazy(() =>
  import('../components/ContactOverlay').then(m => ({
    default: m.ContactOverlay
  }))
);
const CinematicScrollProgress = lazy(() =>
  import('../components/effects/CinematicScrollProgress')
);
const Interactive3DText = lazy(() =>
  import('../components/effects/Interactive3DText')
);

export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const { isLowEnd, isMobile } = usePerformance();

  useEffect(() => {
    if (!isIntroComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    };
  }, [isIntroComplete]);

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isLowEnd ? 0 : 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: isLowEnd ? 0 : 20
    },
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
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-bg selection:bg-white selection:text-black">

      {/* INTRO */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {!isIntroComplete && (
            <IntroOverlay onComplete={() => setIsIntroComplete(true)} />
          )}
        </AnimatePresence>
      </Suspense>

      {/* CURSOR */}
      <Suspense fallback={null}>
        {!isMobile && <CustomCursor />}
      </Suspense>

      {/* DESKTOP NAVBAR */}
      {!isMobile && (
        <Suspense fallback={null}>
          <div className="fixed top-0 left-0 w-full z-[100]">
            <SpotlightNavbar
              onContactClick={() => setIsContactOpen(true)}
            />
          </div>
        </Suspense>
      )}

      {/* MOBILE NAVBAR */}
      {isMobile && isIntroComplete && (
        <Suspense fallback={null}>
          <SpotlightNavbarMobile
            onContactClick={() => setIsContactOpen(true)}
          />
        </Suspense>
      )}

      {/* SCROLL PROGRESS */}
      <Suspense fallback={null}>
        <CinematicScrollProgress />
      </Suspense>

      {/* MAIN CONTENT */}
      <motion.div
        animate={{
          opacity: isContactOpen ? 0.45 : 1
        }}
        transition={{
          duration: 0.4
        }}
      >
        <motion.div
          initial="hidden"
          animate={isIntroComplete ? 'visible' : 'hidden'}
          variants={containerVariants}
        >

          {/* HERO SECTION */}
          <section
            id="home"
            className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-6 py-24 md:min-h-screen md:p-20"
          >
            <div className="hero-glow pointer-events-none" />

            <div className="relative z-10 w-full max-w-5xl text-center">

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
                className="mx-auto mb-16 max-w-2xl text-xl tracking-tight text-muted md:text-2xl font-body"
              >
                Engineering high-performance landing pages for modern tech brands.
                Delivered with surgical focus and cinematic quality.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center gap-20"
              >

                <button
                  onClick={() =>
                    document
                      .getElementById('services')
                      ?.scrollIntoView({
                        behavior: 'smooth'
                      })
                  }
                  className="btn-primary md:group"
                >
                  Start Building

                  <span className="ml-2 hidden transition-transform md:inline-block md:group-hover:translate-x-1">
                    →
                  </span>
                </button>

                {!isLowEnd && (
                  <motion.div
                    animate={{
                      y: [0, 10, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: 'easeInOut'
                    }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="h-12 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />

                    <span className="font-ui text-[10px] uppercase tracking-[0.3em] text-muted/50">
                      Scroll
                    </span>
                  </motion.div>
                )}

              </motion.div>
            </div>
          </section>

          {/* IRIDESCENT SPHERES */}
          <Suspense fallback={<div className="h-screen bg-black" />}>
            <motion.div variants={itemVariants}>
              <IridescentSpheres />
            </motion.div>
          </Suspense>

          {/* SERVICES */}
          <div id="services" className="bg-bg">

            {/* SERVICE 1 */}
            <Suspense fallback={<div className="h-screen bg-black" />}>
              <motion.div variants={itemVariants}>
                <ServiceFeature
                  index="01"
                  label="01 / LANDING ARCHITECTURE"
                  title="Landing pages engineered for conversion."
                  description="Strategically structured interfaces designed to guide attention, reduce friction, and maximize customer action through precision-focused layouts."
                  align="top-left"
                  effect={
                    !isLowEnd
                      ? <LiquidEffectAnimation />
                      : null
                  }
                />
              </motion.div>
            </Suspense>

            {/* SERVICE 2 */}
            <Suspense fallback={<div className="h-screen bg-black" />}>
              <motion.div variants={itemVariants}>
                <ServiceFeature
                  index="02"
                  label="02 / PERFORMANCE"
                  title="Built for speed at every layer."
                  description="Optimized frontend systems with lightweight architecture, fast rendering, and seamless interactions that improve engagement and retention."
                  align="bottom-right"
                  effect={
                    !isLowEnd
                      ? <PhysicsBallsEffect />
                      : null
                  }
                />
              </motion.div>
            </Suspense>

            {/* SERVICE 3 */}
            <Suspense fallback={<div className="h-screen bg-black" />}>
              <motion.div variants={itemVariants}>
                <ServiceFeature
                  index="03"
                  label="03 / TECHNICAL SEO"
                  title="Search visibility integrated from the foundation."
                  description="Modern technical SEO principles implemented directly into the build process to strengthen discoverability and long-term growth."
                  align="top-right"
                  effect={
                    !isLowEnd
                      ? <SphereWrapper />
                      : null
                  }
                />
              </motion.div>
            </Suspense>

            {/* SERVICE 4 */}
            <Suspense fallback={<div className="h-screen bg-black" />}>
              <motion.div variants={itemVariants}>
                <ServiceFeature
                  index="04"
                  label="04 / SCALABLE SYSTEMS"
                  title="Digital systems designed to evolve with your brand."
                  description="Flexible and maintainable structures built to support future expansion without sacrificing performance, consistency, or usability."
                  align="bottom-left"
                  effect={
                    !isLowEnd
                      ? <InteractiveGlow />
                      : null
                  }
                />
              </motion.div>
            </Suspense>

          </div>

          {/* WHY SECTION */}
          <section
            id="why"
            className="relative overflow-hidden border-y border-white/5 bg-[#050505] px-6 py-[clamp(3rem,8vw,8rem)] md:px-20"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-full -translate-x-1/2 -translate-y-1/2 bg-white/[0.02] blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-7xl">

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr] md:gap-20">

                <motion.div variants={itemVariants}>
                  <div className="mb-6 font-ui text-[13px] uppercase tracking-[0.2em] text-muted">
                    WHY RHODIUM / PHILOSOPHY
                  </div>

                  <h2 className="fluid-h2">
                    Simplicity is sophistication.
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-12">

                  {[
                    {
                      t: '01 / Speed',
                      d: 'Production-ready within 5 business days.'
                    },
                    {
                      t: '02 / Focus',
                      d: 'One niche. One expert. Professional result.'
                    },
                    {
                      t: '03 / Tech',
                      d: 'React, Tailwind, Framer. No bloat.'
                    },
                    {
                      t: '04 / Value',
                      d: 'Conversion optimization as standard.'
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                    >
                      <div className="mb-4 font-display text-xl font-bold tracking-tight text-white">
                        {item.t}
                      </div>

                      <p className="max-w-xs text-base leading-relaxed text-muted font-body">
                        {item.d}
                      </p>
                    </motion.div>
                  ))}

                </div>
              </div>
            </div>
          </section>

          {/* BRANDING */}
          <section className="flex items-center justify-center overflow-hidden py-[140px]">

            <Suspense
              fallback={
                <div className="flex w-full select-none items-center justify-center py-6 pointer-events-none">
                  <h2 className="whitespace-nowrap font-display text-[16vw] font-extrabold uppercase leading-none tracking-tighter text-white/5">
                    Rhodium
                  </h2>
                </div>
              }
            >
              <motion.div
                variants={itemVariants}
                className="w-full"
              >
                <Interactive3DText />
              </motion.div>
            </Suspense>

          </section>

          {/* FOOTER */}
          <footer className="relative z-10 border-t border-white/10 bg-black px-6 py-[clamp(3rem,6vw,5rem)] md:px-20">

            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 md:flex-row">

              <div className="flex flex-col items-center gap-4 md:items-start">

                <div className="font-display text-2xl font-bold tracking-tighter text-white">
                  RHODIUM.
                </div>

                <p className="font-ui text-sm uppercase tracking-widest text-muted">
                  © 2024 Design Studio / Est. London
                </p>

              </div>

              <div className="flex items-center gap-10">

                <a
                  href="#"
                  className="font-ui text-xs uppercase tracking-widest text-muted transition-colors hover:text-white"
                >
                  Instagram
                </a>

                <a
                  href="#"
                  className="font-ui text-xs uppercase tracking-widest text-muted transition-colors hover:text-white"
                >
                  Github
                </a>

                <a
                  href="#"
                  className="font-ui text-xs uppercase tracking-widest text-muted transition-colors hover:text-white"
                >
                  LinkedIn
                </a>

              </div>

            </div>
          </footer>

        </motion.div>
      </motion.div>

      {/* CONTACT OVERLAY */}
      <Suspense fallback={null}>
        <ContactOverlay
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </Suspense>

    </div>
  );
}