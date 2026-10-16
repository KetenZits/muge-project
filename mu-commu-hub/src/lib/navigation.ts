"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

/** URL-backed directory state. Native history updates integrate with Next's router. */
export function useUrlState<T extends { [K in keyof T]: string }>(defaults: T) {
  const searchParams = useSearchParams();
  const serializedDefaults = JSON.stringify(defaults);
  const read = useCallback((): T => {
    const initial = JSON.parse(serializedDefaults) as T;
    const params = new URLSearchParams(searchParams.toString());
    for (const key of Object.keys(initial) as (keyof T & string)[]) {
      const value = params.get(key === "query" ? "q" : key) ?? params.get(key);
      if (value !== null) initial[key] = value as T[typeof key];
    }
    return initial;
  }, [searchParams, serializedDefaults]);
  const state = read();
  const setState = useCallback(
    (
      update: Partial<T> | ((current: T) => Partial<T>),
      options: { replace?: boolean } = {},
    ) => {
      const currentDefaults = JSON.parse(serializedDefaults) as T;
      const current = { ...currentDefaults };
      const params = new URLSearchParams(window.location.search);
      for (const key of Object.keys(current) as (keyof T & string)[]) {
        const value =
          params.get(key === "query" ? "q" : key) ?? params.get(key);
        if (value !== null) current[key] = value as T[typeof key];
      }
      const next = {
        ...current,
        ...(typeof update === "function" ? update(current) : update),
      };
      for (const key of Object.keys(currentDefaults) as (keyof T & string)[]) {
        const urlKey = key === "query" ? "q" : key;
        if (key === "query") params.delete("query");
        if (!next[key] || next[key] === currentDefaults[key])
          params.delete(urlKey);
        else params.set(urlKey, next[key]);
      }
      const query = params.toString();
      const destination = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
      if (
        destination ===
        `${window.location.pathname}${window.location.search}${window.location.hash}`
      )
        return;
      window.history[options.replace ? "replaceState" : "pushState"](
        null,
        "",
        destination,
      );
    },
    [serializedDefaults],
  );
  return [state, setState] as const;
}

export function safeReturnTo(
  value: string | null | undefined,
  fallback: string,
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  )
    return fallback;
  try {
    const url = new URL(value, "https://mu-connect.local");
    if (
      url.origin !== "https://mu-connect.local" ||
      /[\u0000-\u001f]/.test(value)
    )
      return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function withReturnTo(href: string) {
  if (
    typeof window === "undefined" ||
    !href.startsWith("/") ||
    href.startsWith("//")
  )
    return href;
  const url = new URL(href, window.location.origin);
  url.searchParams.set(
    "returnTo",
    `${window.location.pathname}${window.location.search}`,
  );
  return `${url.pathname}${url.search}${url.hash}`;
}
