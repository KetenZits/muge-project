"use client";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useApp } from "@/stores/app";
export function ClientProviders({ children }: { children: React.ReactNode }) {
  const ready = useApp((s) => s.ready);
  const sessionStatus = useApp((s) => s.sessionStatus);
  const initializeSession = useApp((s) => s.initializeSession);
  const load = useApp((s) => s.load);
  useEffect(() => {
    initializeSession();
    // Both operations belong to the application store, not this effect's
    // lifetime. load() shares its in-flight work across Strict Mode replays.
    void load();
  }, [initializeSession, load]);
  return (
    <>
      <div data-mock-ready={ready} data-session-status={sessionStatus}>
        {children}
      </div>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
