/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

export interface NavItem {
  label: string;
  href: string;
}

export interface SpotlightNavbarProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  defaultActiveIndex?: number;
}

export function SpotlightNavbar({
  items = [
    { label: "Home", href: "home" },
    { label: "Services", href: "services" },
    { label: "Why", href: "why" },
    { label: "Contact", href: "/contact" },
  ],
  className,
  onItemClick,
  defaultActiveIndex = 0,
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  useEffect(() => {
    if (location.pathname !== '/') {
      const contactIndex = items.findIndex(item => item.href === '/contact');
      if (location.pathname === '/contact' && contactIndex !== -1) {
        setActiveIndex(contactIndex);
      }
      return;
    }

    const sectionIds = items.map(item => item.href).filter(href => !href.startsWith('/'));
    
    const observerOptions = {
      root: null,
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = items.findIndex(item => item.href === entry.target.id);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items, location.pathname]);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty("--spotlight-x", `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;
        
        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty("--spotlight-x", `${v}px`);
          }
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty("--ambience-x", `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item: NavItem, index: number) => {
    if (!item.href.startsWith('/')) {
      if (location.pathname !== '/') {
        navigate('/#' + item.href);
      } else {
        const el = document.getElementById(item.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(item.href);
    }
    setActiveIndex(index);
    onItemClick?.(item, index);
  };

  return (
    <motion.div 
      initial={{ y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ 
        delay: 1.2, // Slower pop up as requested
        duration: 1.5, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={cn("fixed bottom-12 left-1/2 z-[100] flex justify-center", className)}
    >
      <nav
        ref={navRef}
        className={cn(
          "spotlight-nav spotlight-nav-bg glass-border spotlight-nav-shadow",
          "relative h-14 rounded-full transition-all duration-300 overflow-hidden px-4 flex items-center"
        )}
        style={{
          // @ts-ignore
          "--spotlight-color": "rgba(255, 255, 255, 0.12)",
          "--ambience-color": "rgba(255, 255, 255, 1)",
        }}
      >
        <ul className="relative flex items-center h-full gap-1 z-[10]">
          {items.map((item, idx) => (
            <li key={idx} className="relative h-full flex items-center justify-center">
              <button
                type="button"
                data-index={idx}
                onClick={() => handleItemClick(item, idx)}
                className={cn(
                  "px-5 py-2 font-ui text-[13px] font-medium tracking-tight transition-colors duration-200 rounded-full outline-none",
                  activeIndex === idx
                    ? "text-white"
                    : "text-muted hover:text-white"
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* 1. Spotlight (Hover) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300"
          style={{ 
            opacity: hoverX !== null ? 1 : 0,
            background: `
              radial-gradient(
                100px circle at var(--spotlight-x) 100%, 
                var(--spotlight-color) 0%, 
                transparent 60%
              )
            `
          }}
        />

        {/* 2. Ambience (Active Indicator) */}
        <div
            className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2]"
            style={{
                background: `
                  radial-gradient(
                    50px circle at var(--ambience-x) 0%, 
                    var(--ambience-color) 0%, 
                    transparent 100%
                  )
                `
            }}
        />
      </nav>
    </motion.div>
  );
}
