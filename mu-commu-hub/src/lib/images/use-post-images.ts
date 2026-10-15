"use client";
import { useEffect, useState } from "react";
import { liveQuery } from "dexie";
import { imageRepository, postImageOwner } from "@/lib/db/image-repository";
import type { StoredPostImage } from "@/types";

export function usePostImages(postId: string, ids: string[] = []) {
  const key = JSON.stringify([postId, ids]);
  const [result, setResult] = useState<{
    key: string;
    images: (StoredPostImage | undefined)[];
    error: boolean;
  }>();
  useEffect(() => {
    const [id, imageIds] = JSON.parse(key) as [string, string[]];
    if (!imageIds.length) return;
    const subscription = liveQuery(() =>
      imageRepository.resolve(imageIds, postImageOwner(id)),
    ).subscribe({
      next: (images) => setResult({ key, images, error: false }),
      error: () =>
        setResult({ key, images: imageIds.map(() => undefined), error: true }),
    });
    return () => subscription.unsubscribe();
  }, [key]);
  return {
    images: result?.key === key ? result.images : ids.map(() => undefined),
    loading: result?.key !== key,
    error: result?.key === key && result.error,
  };
}
