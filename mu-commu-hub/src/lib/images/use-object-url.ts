"use client";
import { useCallback, useSyncExternalStore } from "react";

// Share URLs while thumbnails and the lightbox use the same Blob. The last subscriber releases it.
const resources = new Map<Blob, { url: string; listeners: Set<() => void> }>();
const emptySnapshot = () => undefined;

export function useObjectUrl(blob?: Blob) {
  const subscribe = useCallback(
    (listener: () => void) => {
      if (!blob) return () => {};
      let resource = resources.get(blob);
      if (!resource) {
        resource = { url: URL.createObjectURL(blob), listeners: new Set() };
        resources.set(blob, resource);
      }
      resource.listeners.add(listener);
      listener();
      return () => {
        resource.listeners.delete(listener);
        if (!resource.listeners.size) {
          URL.revokeObjectURL(resource.url);
          resources.delete(blob);
        }
      };
    },
    [blob],
  );
  const snapshot = useCallback(
    () => (blob ? resources.get(blob)?.url : undefined),
    [blob],
  );
  return useSyncExternalStore(subscribe, snapshot, emptySnapshot);
}
