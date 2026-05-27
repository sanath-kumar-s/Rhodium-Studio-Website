/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { usePerformance } from "../hooks/usePerformance";

export interface NavItem {
  label: string;
  href: string;
}

export interface SpotlightNavbarProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  onContactClick?: () => void;
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
  onContactClick,
  defaultActiveIndex = 0,
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isMobile, isLowEnd } = usePerformance();

  const location = useLocation();
  const navigate = useNavigate();

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!navRef.current || isMobile) return;

    const nav = navRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = nav.getBoundingClientRect();
        const x = e.clientX - rect.left;

        setHoverX(x);

        spotlightX.current = x;

        nav.style.setProperty("--spotlight-x", `${x}px`);
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafRef.current);

      setHoverX(null);

      const activeItem = nav.querySelector(
        `[data-index="${activeIndex}"]`
      );

      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        const targetX =
          itemRect.left -
          navRect.left +
          itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: "spring",
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;

            nav.style.setProperty(
              "--spotlight-x",
              `${v}px`
            );
          },
        });
      }
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      nav.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      cancelAnimationFrame(rafRef.current);
    };
  }, [activeIndex, isMobile]);

  useEffect(() => {
    if (!navRef.current) return;

    const nav = navRef.current;

    const activeItem = nav.querySelector(
      `[data-index="${activeIndex}"]`
    );

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      const targetX =
        itemRect.left -
        navRect.left +
        itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;

          nav.style.setProperty(
            "--ambience-x",
            `${v}px`
          );
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (
    item: NavItem,
    index: number
  ) => {
    if (item.label === "Contact") {
      onContactClick?.();
      return;
    }

    if (!item.href.startsWith("/")) {
      if (location.pathname !== "/") {
        navigate("/#" + item.href);
      } else {
        const el = document.getElementById(item.href);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    } else {
      navigate(item.href);
    }

    setActiveIndex(index);

    onItemClick?.(item, index);

    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <motion.div
      initial={{
        y: 100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        delay: 1.2,
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex justify-center pointer-events-none",
        className
      )}
    >
      {/* Mobile Hamburger */}
      <button
        onClick={toggleMobileMenu}
        style={{ pointerEvents: "auto" }}
        className={cn(
          "md:hidden flex flex-col gap-1.5 p-4 rounded-full spotlight-nav-bg glass-border spotlight-nav-shadow z-50",
          !isLowEnd && "backdrop-blur-md"
        )}
        aria-label="Toggle menu"
      >
        <motion.span
          animate={{
            rotate: isMobileMenuOpen ? 45 : 0,
            y: isMobileMenuOpen ? 7.5 : 0,
          }}
          className="w-6 h-0.5 bg-white block"
        />

        <motion.span
          animate={{
            opacity: isMobileMenuOpen ? 0 : 1,
          }}
          className="w-6 h-0.5 bg-white block"
        />

        <motion.span
          animate={{
            rotate: isMobileMenuOpen ? -45 : 0,
            y: isMobileMenuOpen ? -7.5 : 0,
          }}
          className="w-6 h-0.5 bg-white block"
        />
      </button>

      {/* Desktop Navbar */}
      <nav
        ref={navRef}
        // style={{ pointerEvents: "auto" }}
        className={cn(
          "spotlight-nav spotlight-nav-bg glass-border spotlight-nav-shadow",
          "hidden md:flex relative h-14 rounded-full overflow-hidden px-4 items-center",
          !isLowEnd && "backdrop-blur-md"
        )}
        // @ts-ignore
        style={
          {
            pointerEvents: "auto",
            "--spotlight-color":
              "rgba(255,255,255,0.12)",
            "--ambience-color":
              "rgba(255,255,255,1)",
          } as React.CSSProperties
        }
      >
        <ul className="relative flex items-center h-full gap-1 z-10">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="relative h-full flex items-center justify-center"
            >
              <button
                type="button"
                data-index={idx}
                onClick={() =>
                  handleItemClick(item, idx)
                }
                className={cn(
                  "px-5 py-2 rounded-full outline-none transition-colors duration-200",
                  "font-ui text-[13px] font-medium tracking-tight",
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

        {/* Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
          style={{
            opacity: hoverX !== null ? 1 : 0,
            background: `
              radial-gradient(
                100px circle at var(--spotlight-x) 100%,
                var(--spotlight-color) 0%,
                transparent 60%
              )
            `,
          }}
        />

        {/* Bottom ambient line */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2]"
          style={{
            background: `
              radial-gradient(
                50px circle at var(--ambience-x) 0%,
                var(--ambience-color) 0%,
                transparent 100%
              )
            `,
          }}
        />
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className={cn(
                "fixed inset-0 bg-black/60 z-40 md:hidden",
                !isLowEnd && "backdrop-blur-sm"
              )}
            />

            <motion.div
              initial={{
                y: "100%",
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: "100%",
                opacity: 0,
              }}
              className={cn(
                "fixed bottom-32 left-6 right-6 p-8 rounded-[2rem] z-50 md:hidden overflow-hidden",
                "spotlight-nav-bg glass-border spotlight-nav-shadow",
                !isLowEnd && "backdrop-blur-md"
              )}
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-white blur-[60px] -translate-x-1/2 -translate-y-1/2" />
              </div>

              <ul className="relative flex flex-col gap-6 items-center z-10">
                {items.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() =>
                        handleItemClick(item, idx)
                      }
                      className={cn(
                        "text-2xl font-display font-bold tracking-tight transition-colors duration-200",
                        activeIndex === idx
                          ? "text-white"
                          : "text-muted"
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}