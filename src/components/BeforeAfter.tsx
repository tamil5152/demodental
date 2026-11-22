"use client";

import { useId, useState } from "react";

interface Props {
  title: string;
  caption: string;
  before?: string;
  after?: string;
}

/** Drag-to-compare slider. Falls back to a labelled placeholder until real photos are added. */
export function BeforeAfter({ title, caption, before, after }: Props) {
  const [pos, setPos] = useState(50);
  const [missing, setMissing] = useState(!before || !after);
  const id = useId();

  return (
    <figure className="card !p-3">
      <div className="relative aspect-[4/3] select-none overflow-hidden rounded-xl bg-brand-50">
        {missing ? (
          <>
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900">
              
            </div>
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-stone-300 to-stone-400 text-stone-800" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              
            </div>
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs text-muted">
              Sample: add real photos in /public/gallery
            </p>
          </>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- patient photos are swapped in as static files */}
            <img src={after!} alt={`${title}: after treatment`} className="absolute inset-0 size-full object-cover" onError={() => setMissing(true)} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={before!} alt={`${title}: before treatment`} className="absolute inset-0 size-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} onError={() => setMissing(true)} />
          </>
        )}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }} />
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">Before</span>
        <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">After</span>
        <label htmlFor={id} className="sr-only">Compare before and after for {title}</label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="px-2 pb-1 pt-3">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted">{caption}</p>
      </figcaption>
    </figure>
  );
}
