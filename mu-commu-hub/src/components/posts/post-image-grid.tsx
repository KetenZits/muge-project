"use client";
import { useRef, useState } from "react";
import { usePostImages } from "@/lib/images/use-post-images";
import { cn } from "@/lib/utils";
import { LocalPostImage } from "./local-post-image";
import { PostImageLightbox } from "./post-image-lightbox";
import type { Post } from "@/types";

export function PostImageGrid({ post }: { post: Post }) {
  const ids = (post.imageIds ?? []).slice(0, 5);
  const { images, loading, error } = usePostImages(post.id, ids);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  if (!ids.length) return null;
  return (
    <div className="mt-4 min-w-0" data-post-gallery={post.id}>
      <div
        className={cn(
          "grid gap-1.5 overflow-hidden rounded-2xl border border-[#e4ebf4] bg-[#f5f8fc]",
          ids.length === 1
            ? "grid-cols-1"
            : ids.length === 2
              ? "grid-cols-1 min-[400px]:grid-cols-2"
              : "grid-cols-2",
          ids.length === 3 && "h-72 sm:h-80",
          ids.length === 4 && "h-80 sm:h-96",
          ids.length === 5 &&
            "h-80 grid-rows-3 sm:h-96 sm:grid-cols-3 sm:grid-rows-2",
        )}
      >
        {ids.map((id, index) => (
          <button
            key={id}
            type="button"
            aria-label={`View photo ${index + 1} of ${ids.length}`}
            disabled={loading || !images[index]}
            onClick={(event) => {
              returnFocus.current = event.currentTarget;
              setActiveIndex(index);
            }}
            className={cn(
              "relative min-h-0 min-w-0 overflow-hidden bg-[#eef3f9] transition hover:brightness-95 focus-visible:z-10 focus-visible:outline-offset-[-4px]",
              ids.length === 1 && "max-h-[420px]",
              ids.length === 2 && "aspect-[4/3]",
              ids.length === 3 && index === 0 && "row-span-2",
              ids.length === 5 &&
                index === 0 &&
                "col-span-2 sm:col-span-1 sm:row-span-2",
            )}
            style={
              ids.length === 1
                ? {
                    aspectRatio: images[0]
                      ? `${images[0].width} / ${images[0].height}`
                      : "4 / 3",
                  }
                : undefined
            }
          >
            <LocalPostImage
              image={images[index]}
              loading={loading}
              alt={`Photo ${index + 1}: ${post.title}`}
              className={ids.length === 1 ? "object-contain" : undefined}
            />
          </button>
        ))}
      </div>
      {error && (
        <p role="status" className="mt-2 text-xs text-[var(--text-muted)]">
          Photos could not be read from this browser&apos;s storage. Refresh to
          try again.
        </p>
      )}
      {activeIndex !== null && (
        <PostImageLightbox
          images={images}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          returnFocus={returnFocus}
          title={post.title}
        />
      )}
    </div>
  );
}
