"use client";

import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(images[0]);
  return (
    <div className="grid gap-3">
      <div className="aspect-square overflow-hidden rounded-[2rem] bg-silver-100 shadow-soft">
        <img src={active} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) => (
          <button key={image} className="aspect-square overflow-hidden rounded-2xl border border-silver-200 bg-white p-1" onClick={() => setActive(image)}>
            <img src={image} alt={title} className="h-full w-full rounded-xl object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
