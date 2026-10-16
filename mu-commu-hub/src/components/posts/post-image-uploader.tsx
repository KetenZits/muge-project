"use client";
import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  GripVertical,
  ImagePlus,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { preparePostImage } from "@/lib/images/prepare-image";
import { MAX_POST_IMAGES } from "@/lib/validation/post-images";
import { LocalPostImage } from "./local-post-image";
import type { PreparedPostImage } from "@/types";

export function PostImageUploader({
  images,
  onChange,
  disabled,
  onProcessingChange,
  error,
}: {
  images: PreparedPostImage[];
  onChange: (images: PreparedPostImage[]) => void;
  disabled: boolean;
  onProcessingChange: (processing: boolean) => void;
  error?: string;
}) {
  const inputId = useId();
  const picker = useRef<HTMLInputElement>(null);
  const working = useRef(false);
  const dragDepth = useRef(0);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const reducedMotion = useReducedMotion();
  const locked = disabled || processing;
  const atLimit = images.length >= MAX_POST_IMAGES;
  const addFiles = async (files: File[]) => {
    if (disabled || working.current || !files.length) return;
    working.current = true;
    setProcessing(true);
    onProcessingChange(true);
    setMessages([]);
    const next = [...images];
    const failures: string[] = [];
    try {
      for (const file of files) {
        if (next.length >= MAX_POST_IMAGES) {
          failures.push(
            "You can attach up to 5 photos per post. Your selected photos have been kept; remove one to add another.",
          );
          break;
        }
        try {
          const image = await preparePostImage(file);
          next.push(image);
          onChange([...next]);
        } catch (reason) {
          failures.push(
            reason instanceof Error
              ? reason.message
              : `${file.name}: could not read this photo.`,
          );
        }
      }
      setMessages(failures);
      setAnnouncement(`${next.length} of 5 photos selected.`);
    } finally {
      working.current = false;
      setProcessing(false);
      onProcessingChange(false);
      if (picker.current) picker.current.value = "";
    }
  };
  const move = (from: number, to: number) => {
    if (locked || from === to || from < 0 || to < 0 || to >= images.length)
      return;
    const reordered = [...images];
    const [image] = reordered.splice(from, 1);
    reordered.splice(to, 0, image);
    onChange(reordered);
    setAnnouncement(
      `${image.fileName} moved to position ${to + 1} of ${images.length}.`,
    );
  };
  const fileDrag = (event: React.DragEvent) =>
    event.dataTransfer.types.includes("Files");
  const actionClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#17468c] hover:bg-[#eaf1fc] disabled:cursor-default disabled:opacity-30";
  return (
    <section
      aria-labelledby={`${inputId}-heading`}
      aria-busy={processing}
      className="min-w-0"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3
          id={`${inputId}-heading`}
          className="text-sm font-semibold text-[#33445c]"
        >
          Photos{" "}
          <span className="text-xs font-normal text-[var(--text-muted)]">
            (optional)
          </span>
        </h3>
        <span className="text-xs font-medium tabular-nums text-[var(--text-muted)]">
          {images.length} / 5 photos
        </span>
      </div>
      <input
        ref={picker}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-label="Choose photos"
        disabled={locked}
        onChange={(event) => {
          void addFiles(Array.from(event.target.files ?? []));
        }}
      />
      <div
        data-image-dropzone="true"
        className={`flex flex-wrap items-center gap-3 rounded-xl border border-dashed bg-white p-4 transition-colors ${dragging ? "border-[#17468c] bg-[#eaf1fc] ring-2 ring-[#17468c20]" : "border-[#cdd9e8] hover:border-[#17468c] focus-within:border-[#17468c]"}`}
        onDragEnter={(event) => {
          if (fileDrag(event)) {
            event.preventDefault();
            dragDepth.current++;
            setDragging(true);
          }
        }}
        onDragOver={(event) => {
          if (fileDrag(event)) {
            event.preventDefault();
            event.dataTransfer.dropEffect = locked ? "none" : "copy";
          }
        }}
        onDragLeave={(event) => {
          if (fileDrag(event)) {
            event.preventDefault();
            if (--dragDepth.current <= 0) {
              dragDepth.current = 0;
              setDragging(false);
            }
          }
        }}
        onDrop={(event) => {
          if (!fileDrag(event)) return;
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          void addFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf1fc] text-[#17468c]">
          {processing ? (
            <LoaderCircle className="animate-spin" size={21} />
          ) : dragging ? (
            <Upload size={21} />
          ) : (
            <ImagePlus size={21} />
          )}
        </span>
        <div className="min-w-0 flex-1 basis-32">
          <p className="text-xs font-semibold text-[#33445c]">
            {processing
              ? "Preparing your photos..."
              : dragging
                ? "Drop photos to attach"
                : "Drag and drop images here"}
          </p>
          <p
            id={`${inputId}-help`}
            className="mt-1 text-xs leading-5 text-[var(--text-muted)]"
          >
            JPG, PNG, WebP · Up to 5 photos · 8 MB each
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={locked || atLimit}
          aria-describedby={`${inputId}-help`}
          onClick={() => picker.current?.click()}
        >
          <ImagePlus size={15} /> {atLimit ? "5 photos added" : "Add Photos"}
        </Button>
      </div>
      {images.length > 0 && (
        <>
          <ol
            className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"
            aria-label="Selected photos"
          >
            <AnimatePresence initial={false}>
              {images.map((image, index) => (
                <motion.li
                  key={image.id}
                  layout={reducedMotion ? false : "position"}
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: reducedMotion ? 0 : 0.16 }}
                  className="min-w-0 overflow-hidden rounded-xl border border-[#dce5ef] bg-white"
                  data-photo-id={image.id}
                  onDragOver={(event) => {
                    if (
                      event.dataTransfer.types.includes(
                        "application/x-mu-photo",
                      )
                    )
                      event.preventDefault();
                  }}
                  onDrop={(event) => {
                    const id = event.dataTransfer.getData(
                      "application/x-mu-photo",
                    );
                    if (!id) return;
                    event.preventDefault();
                    event.stopPropagation();
                    move(
                      images.findIndex((item) => item.id === id),
                      index,
                    );
                  }}
                >
                  <div className="relative aspect-[4/3] bg-[#f5f8fc]">
                    <LocalPostImage
                      image={image}
                      alt={`Selected photo ${index + 1}: ${image.fileName}`}
                      className="object-contain"
                      eager
                    />
                    <button
                      type="button"
                      disabled={locked}
                      aria-label={`Remove photo ${index + 1}`}
                      onClick={() => {
                        onChange(images.filter((item) => item.id !== image.id));
                        setMessages([]);
                        setAnnouncement(`${image.fileName} removed.`);
                      }}
                      className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#0d234c]/80 text-white shadow-sm hover:bg-[#17468c] disabled:opacity-40"
                    >
                      <X size={16} />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-semibold text-[#17468c]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-0.5 p-1">
                    <button
                      type="button"
                      disabled={locked}
                      draggable={!locked}
                      aria-label={`Drag photo ${index + 1} to reorder`}
                      className={
                        actionClass + " cursor-grab active:cursor-grabbing"
                      }
                      onDragStart={(event) => {
                        event.dataTransfer.setData(
                          "application/x-mu-photo",
                          image.id,
                        );
                        event.dataTransfer.effectAllowed = "move";
                      }}
                    >
                      <GripVertical size={15} />
                    </button>
                    <span className="flex">
                      <button
                        type="button"
                        className={actionClass}
                        disabled={locked || index === 0}
                        aria-label={`Move photo ${index + 1} earlier`}
                        onClick={() => move(index, index - 1)}
                      >
                        <ArrowLeft size={15} />
                      </button>
                      <button
                        type="button"
                        className={actionClass}
                        disabled={locked || index === images.length - 1}
                        aria-label={`Move photo ${index + 1} later`}
                        onClick={() => move(index, index + 1)}
                      >
                        <ArrowRight size={15} />
                      </button>
                    </span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
          <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
            Drag the grip or use the arrows to reorder. The first photo leads
            your gallery.
          </p>
        </>
      )}
      {(error || messages.length > 0) && (
        <div
          role="alert"
          className="mt-2 space-y-1 text-xs leading-5 text-red-600 [overflow-wrap:anywhere]"
        >
          {error && <p>{error}</p>}
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
        Photos are saved locally in this browser. They aren&apos;t shared across
        devices or with other users.
      </p>
      <span role="status" className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </section>
  );
}
