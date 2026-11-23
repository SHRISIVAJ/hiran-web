"use client";

import { useEffect, useRef, useState } from "react";

// Swipeable image gallery (touch swipe, trackpad, mouse drag, arrows, dots, optional thumbnails).
// Safe to use inside a <Link>: its controls never trigger navigation, and a drag doesn't count as a click.
export default function Gallery({ images, className = "", aspect = "aspect-[16/10]", thumbs = false, accent = "#0d9488", priority = false }) {
  const track = useRef(null);
  const drag = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const el = track.current;
    const n = images.length;
    const next = (i + n) % n;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  // mouse drag (touch already scrolls natively)
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
    track.current.style.scrollSnapType = "none";
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.done) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d || d.done) return;
    drag.current = { moved: d.moved, done: true };
    const el = track.current;
    el.style.scrollSnapType = "";
    go(Math.round(el.scrollLeft / el.clientWidth));
  };
  const onClickCapture = (e) => {
    if (drag.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
    drag.current = null;
  };

  const btn =
    "absolute top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur transition hover:scale-110 sm:opacity-0 sm:group-hover/gal:opacity-100";

  return (
    <div className={className}>
      <div className={`group/gal relative overflow-hidden ${aspect}`}>
        <div
          ref={track}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
        >
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.src}
              src={img.src}
              srcSet={`${img.src.replace(".webp", "-800.webp")} 800w, ${img.src} 1600w`}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
              alt={img.alt}
              loading={priority && i === 0 ? "eager" : "lazy"}
              draggable={false}
              className="h-full w-full shrink-0 snap-center object-cover"
            />
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" aria-label="Previous image" className={`${btn} left-3`} onClick={(e) => go(index - 1, e)}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <button type="button" aria-label="Next image" className={`${btn} right-3`} onClick={(e) => go(index + 1, e)}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m9 6 6 6-6 6" /></svg>
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  onClick={(e) => go(i, e)}
                  className="h-2 rounded-full transition-all"
                  style={{ width: i === index ? 20 : 8, background: i === index ? "#fff" : "rgba(255,255,255,.6)" }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {thumbs && images.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={(e) => go(i, e)}
              aria-label={`Show image ${i + 1}`}
              className="overflow-hidden rounded-xl ring-2 ring-offset-2 transition"
              style={{ "--tw-ring-color": i === index ? accent : "transparent" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src.replace(".webp", "-800.webp")} alt="" className="aspect-[16/10] w-full object-cover transition hover:scale-105" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
