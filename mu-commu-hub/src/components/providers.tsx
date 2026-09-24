"use client";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useApp } from "@/stores/app";
let workerPromise: Promise<unknown> | null = null;
export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [started, setStarted] = useState(false);
  const load = useApp((s) => s.load);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!workerPromise)
          workerPromise = import("@/mocks/browser").then(({ worker }) =>
            worker.start({
              onUnhandledRequest: "bypass",
              serviceWorker: { url: "/mockServiceWorker.js" },
            }),
          );
        await workerPromise;
        if (active) {
          await load();
          setStarted(true);
        }
      } catch (error) {
        console.error("Mock API startup failed", error);
        if (active) {
          useApp.setState({
            ready: true,
            error:
              error instanceof Error ? error.message : "Mock API unavailable",
          });
          setStarted(true);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [load]);
  return (
    <>
      <div data-mock-ready={started}>{children}</div>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
