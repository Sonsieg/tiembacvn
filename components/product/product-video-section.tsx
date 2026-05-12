"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import type { ProductVideo } from "@/types/commerce";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function ProductVideoSection({ videos }: { videos: ProductVideo[] }) {
  const [active, setActive] = useState<ProductVideo | null>(null);
  if (!videos.length) return null;

  return (
    <section className="section">
      <div className="container-page grid gap-6">
        <div>
          <p className="eyebrow">Video sản phẩm</p>
          <h2 className="heading-lg">Xem sản phẩm thực tế</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {videos.map((video) => (
            <article key={video.id} className="overflow-hidden rounded-[1.5rem] border border-silver-200 bg-white shadow-soft">
              <button className="relative block aspect-video w-full overflow-hidden bg-ink" onClick={() => setActive(video)}>
                <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover opacity-80" />
                <span className="absolute inset-0 grid place-items-center text-white"><Play className="h-12 w-12 fill-current" /></span>
              </button>
              <div className="grid gap-3 p-4">
                <Badge>{video.type}</Badge>
                <h3 className="font-semibold text-ink">{video.title}</h3>
                <ButtonLink href={video.youtubeUrl} target="_blank" variant="secondary" className="w-fit"><ExternalLink className="h-4 w-4" /> Mở trên YouTube</ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Modal open={Boolean(active)} onClose={() => setActive(null)}>
        {active ? <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1`} title={active.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : null}
      </Modal>
    </section>
  );
}
