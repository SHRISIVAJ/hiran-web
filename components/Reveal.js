"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Scroll effects for the whole site:
//  • .reveal            → fades / rises in when scrolled into view (siblings are staggered)
//  • [data-parallax="n"] → moves at a different speed than the page while scrolling (n = speed, e.g. 0.2 or -0.15)
//  • [data-hero-fade]   → drifts down and fades out as you scroll away from the top
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- reveal on scroll, staggered among siblings ---
    const els = [...document.querySelectorAll(".reveal:not(.in)")];
    els.forEach((el) => {
      const sibs = [...(el.parentElement?.children ?? [])].filter((c) => c.classList.contains("reveal"));
      const i = sibs.indexOf(el);
      if (i > 0) el.style.transitionDelay = `${Math.min(i * 90, 450)}ms`;
    });
    let io;
    if (!("IntersectionObserver" in window) || reduce) {
      els.forEach((el) => el.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { rootMargin: "0px 0px -10% 0px" }
      );
      els.forEach((el) => io.observe(el));
    }

    // --- parallax ---
    const par = [...document.querySelectorAll("[data-parallax]")];
    const fades = [...document.querySelectorAll("[data-hero-fade]")];
    let raf = 0;
    let pending = els.filter((el) => !el.classList.contains("in"));
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      // backup for IntersectionObserver: reveal anything that has entered the viewport
      if (pending.length) {
        pending = pending.filter((el) => {
          if (el.classList.contains("in")) return false;
          if (el.getBoundingClientRect().top < vh * 0.92) {
            el.classList.add("in");
            return false;
          }
          return true;
        });
      }
      if (reduce) return;
      for (const el of par) {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const offset = r.top + r.height / 2 - vh / 2;
        // never move further than the extra image height, so no gap ever shows (tall mobile sections)
        const max = Math.max((el.offsetHeight - r.height) / 2, 0);
        const ty = Math.max(-max, Math.min(max, offset * parseFloat(el.dataset.parallax)));
        el.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0)`;
      }
      const y = window.scrollY;
      for (const el of fades) {
        if (y > vh * 1.2) {
          el.style.opacity = "0";
          continue;
        }
        el.style.transform = `translate3d(0, ${(y * 0.35).toFixed(1)}px, 0)`;
        el.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
