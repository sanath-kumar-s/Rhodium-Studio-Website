/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import CustomCursor from '../components/effects/CustomCursor';
import { SpotlightNavbar } from '../components/SpotlightNavbar';

const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');

    if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
      setTimeout(() => setStatus('success'), 1500);
      return;
    }

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  };

  return (
    <div className="relative min-h-screen bg-bg flex flex-col items-center selection:bg-white selection:text-black overflow-hidden">
      <CustomCursor />
      <SpotlightNavbar defaultActiveIndex={3} />
      
      <main className="relative z-10 w-full max-w-7xl px-10 md:px-20 py-[140px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-20">
        
        {/* Left Side — Editorial */}
        <div className="w-full lg:w-1/2 text-left order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="font-ui text-[13px] uppercase tracking-[0.2em] text-muted mb-6">CONTACT / ENQUIRIES</div>
            <h1 className="fluid-h1 mb-10">
              Let's build<br />
              the future.
            </h1>
            <p className="text-muted text-lg max-w-sm font-body leading-relaxed">
              Have a project in mind? Fill out the form or find me on any of these platforms.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-8"
          >
            {[
              { icon: InstagramIcon, link: "https://instagram.com/itz_.sanath" },
              { icon: GitHubIcon, link: "https://github.com/sanath-kumar-s" },
              { icon: LinkedInIcon, link: "https://www.linkedin.com/in/sanath-kumar-s1/" },
              { icon: GmailIcon, link: "mailto:sanathkumar5638@gmail.com" }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: '#FFFFFF' }}
                className="text-muted transition-colors cursor-pointer"
              >
                <social.icon />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Right Side — Form */}
        <div className="w-full lg:w-5/12 order-2">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                <h2 className="font-display text-4xl font-bold text-white tracking-tight">Message received.</h2>
                <p className="font-body text-muted text-lg">I'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#050505] p-10 rounded-3xl border border-white/5 relative shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="font-ui text-[11px] uppercase tracking-[0.15em] text-muted">Name</label>
                    <input 
                      required
                      name="from_name"
                      type="text" 
                      placeholder="Your name"
                      className="bg-transparent border-b border-white/10 py-4 font-body text-base text-text placeholder:text-muted focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="font-ui text-[11px] uppercase tracking-[0.15em] text-muted">Email</label>
                    <input 
                      required
                      name="from_email"
                      type="email" 
                      placeholder="your@email.com"
                      className="bg-transparent border-b border-white/10 py-4 font-body text-base text-text placeholder:text-muted focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="font-ui text-[11px] uppercase tracking-[0.15em] text-muted">Project brief</label>
                    <textarea 
                      required
                      name="message"
                      rows={4}
                      placeholder="Tell me about your project..."
                      className="bg-transparent border-b border-white/10 py-4 font-body text-base text-text placeholder:text-muted focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-wait"
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                    
                    {status === 'error' && (
                      <p className="mt-4 font-body text-[13px] text-red-400">
                        Something went wrong. Email me directly at sanathkumar5638@gmail.com
                      </p>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-auto py-10 w-full px-10 md:px-20 border-t border-white/5 opacity-40">
        <div className="font-ui text-[10px] uppercase tracking-widest text-center">
          © 2024 RHODIUM STUDIO / ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
