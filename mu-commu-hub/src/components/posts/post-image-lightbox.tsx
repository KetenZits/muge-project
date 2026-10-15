"use client";
import { useRef } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { LocalPostImage } from "./local-post-image";
import type { PreparedPostImage } from "@/types";

export function PostImageLightbox({
  images,
  index,
  onIndexChange,
  onClose,
  returnFocus,
  title,
}: {
  images: (PreparedPostImage | undefined)[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  returnFocus: React.RefObject<HTMLButtonElement | null>;
  title: string;
}) {
  const reducedMotion = useReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const navigate = (direction: number) =>
    onIndexChange((index + direction + images.length) % images.length);
  const controlClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-[#fac334] disabled:opacity-30";
  return (
    <DialogPrimitive.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-[#080f1d]/97" />
        <DialogPrimitive.Content
          aria-describedby="post-gallery-description"
          className="fixed inset-0 z-[81] flex h-dvh min-w-0 flex-col p-3 text-white outline-none sm:p-6"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              navigate(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          <DialogPrimitive.Title className="sr-only">
            Photos: {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description
            id="post-gallery-description"
            className="sr-only"
          >
            Use the left and right arrow keys or swipe to browse photos. Press
            Escape to close.
          </DialogPrimitive.Description>
          <div className="flex shrink-0 items-center justify-between gap-4 pb-3">
            <p className="min-w-0 truncate text-sm text-white/80">{title}</p>
            <DialogPrimitive.Close
              aria-label="Close image viewer"
              className={controlClass}
            >
              <X size={22} />
            </DialogPrimitive.Close>
          </div>
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
            style={{ touchAction: "pan-y" }}
            onPointerDown={(event) => {
              if (event.pointerType === "touch")
                touchStart.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerUp={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!start) return;
              const dx = event.clientX - start.x;
              if (
                Math.abs(dx) > 50 &&
                Math.abs(dx) > Math.abs(event.clientY - start.y)
              )
                navigate(dx < 0 ? 1 : -1);
            }}
            onPointerCancel={() => {
              touchStart.current = null;
            }}
          >
            <motion.div
              key={images[index]?.id ?? index}
              className="h-full min-h-0 w-full"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.16 }}
            >
              <LocalPostImage
                image={images[index]}
                alt={`Photo ${index + 1} of ${images.length}: ${title}`}
                className="object-contain"
                eager
              />
            </motion.div>
          </div>
          <div className="flex shrink-0 items-center justify-center gap-6 pb-[env(safe-area-inset-bottom)] pt-4">
            <button
              type="button"
              className={controlClass}
              disabled={images.length < 2}
              onClick={() => navigate(-1)}
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>
            <span
              className="min-w-14 text-center text-sm tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {index + 1} / {images.length}
            </span>
            <button
              type="button"
              className={controlClass}
              disabled={images.length < 2}
              onClick={() => navigate(1)}
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
