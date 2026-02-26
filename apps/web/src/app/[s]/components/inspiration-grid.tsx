"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@vendly/ui/components/dialog";

type TikTokVideo = {
  id: string;
  title?: string;
  video_description?: string;
  cover_image_url?: string;
  embed_link?: string;
  share_url?: string;
};

interface InspirationGridProps {
  videos: TikTokVideo[];
}

export function InspirationGrid({ videos }: InspirationGridProps) {
  const [playerOpen, setPlayerOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<TikTokVideo | null>(null);

  const getEmbedSrc = React.useCallback((video?: TikTokVideo | null) => {
    if (!video?.embed_link) return undefined;
    const hasQuery = video.embed_link.includes("?");
    const autoplayParams = "autoplay=1&muted=0";
    return `${video.embed_link}${hasQuery ? "&" : "?"}${autoplayParams}`;
  }, []);

  if (videos.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
        No inspiration videos available right now.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        {videos.map((video, index) => {
          const title = video.title || video.video_description || `Inspiration ${index + 1}`;
          return (
            <button
              key={video.id}
              type="button"
              className="group block text-left"
              onClick={() => {
                setSelectedVideo(video);
                setPlayerOpen(true);
              }}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square bg-muted">
                {video.cover_image_url ? (
                  <Image
                    src={video.cover_image_url}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No cover image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/85 text-black/80 flex items-center justify-center shadow-md transition duration-300 group-hover:scale-105">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 translate-x-px"
                    >
                      <path d="M8 5.14v13.72L19 12 8 5.14Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog
        open={playerOpen}
        onOpenChange={(open) => {
          setPlayerOpen(open);
          if (!open) setSelectedVideo(null);
        }}
      >
        <DialogContent className="w-[min(95vw,1200px)] p-0 overflow-hidden" showCloseButton={false}>
          <div className="p-3 sm:p-5">
            <div className="relative overflow-hidden rounded-lg aspect-video bg-black">
              {selectedVideo?.embed_link ? (
                <iframe
                  key={selectedVideo.id}
                  src={getEmbedSrc(selectedVideo)}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={selectedVideo.title || selectedVideo.video_description || "TikTok inspiration video"}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                  Missing embed link.
                </div>
              )}
            </div>

            {(selectedVideo?.share_url || selectedVideo?.embed_link) && (
              <a
                href={selectedVideo.share_url || selectedVideo.embed_link || "#"}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs font-medium text-foreground underline"
              >
                Open on TikTok
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
