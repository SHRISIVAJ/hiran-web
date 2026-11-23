"use client";

import { useEffect, useRef, useState } from "react";
import { themes } from "@/data/products";

// Full-bleed hero: 3D molecules + glassware float around the centred content.
// Drag / swipe anywhere on the hero to spin them 360°.
// A pre-rendered poster shows until WebGL is ready (and stays if WebGL is unavailable).
export default function Hero3D({ children, className = "" }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    let cleanup;
    let cancelled = false;
    // start 3D only after the page has settled, so first load / first scroll stay smooth
    const start = () =>
      import("@/lib/heroScene").then((m) => {
        if (cancelled || !canvasRef.current) return;
        cleanup = m.mountHero(canvasRef.current, sectionRef.current, themes, {
          onReady: () => setReady(true),
          onInteract: () => setTouched(true),
          onFallback: () => setReady(false), // only if WebGL is not available at all
        });
      });
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 600);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className={`relative isolate overflow-hidden bg-teal-50 select-none ${className}`}>
      {/* placeholder = exact first frame of the 3D scene, so the hand-over is seamless */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/images/hero-3d-mobile.webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-3d.webp"
          alt=""
          fetchPriority="high"
          className={`pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        />
      </picture>
      <div ref={canvasRef} className="absolute inset-0 -z-10" aria-hidden="true" />
      {/* soft glow behind the text keeps it readable over the 3D objects */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_34%_36%_at_50%_52%,rgba(255,255,255,0.72),rgba(255,255,255,0.3)_60%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_32%_at_50%_50%,rgba(255,255,255,0.7),transparent_100%)] sm:hidden" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white to-transparent" />

      {children}

      <div
        className={`pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
          ready && !touched ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-teal-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-teal-800 shadow-sm">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 4v5h-5" />
          </svg>
          Drag to rotate 360°
        </span>
      </div>
    </section>
  );
}
