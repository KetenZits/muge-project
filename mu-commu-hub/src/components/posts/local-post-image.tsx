"use client";
import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { useObjectUrl } from "@/lib/images/use-object-url";
import { cn } from "@/lib/utils";
import type { PreparedPostImage } from "@/types";

export function LocalPostImage({
  image,
  alt,
  className,
  loading = false,
  eager = false,
}: {
  image?: PreparedPostImage;
  alt: string;
  className?: string;
  loading?: boolean;
  eager?: boolean;
}) {
  const url = useObjectUrl(image?.blob);
  const [failed, setFailed] = useState(false);
  if (loading || (image && !url))
    return (
      <span
        aria-label="Loading photo"
        className="skeleton block h-full w-full"
      />
    );
  if (!image || !url || failed)
    return (
      <span
        className="flex h-full min-h-24 w-full flex-col items-center justify-center gap-2 bg-[#eef3f9] px-3 text-xs text-[#687a90]"
        role="img"
        aria-label="Photo unavailable"
      >
        <ImageOff size={22} /> Photo unavailable
      </span>
    );
  return (
    <Image
      src={url}
      alt={alt}
      width={image.width}
      height={image.height}
      unoptimized
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
