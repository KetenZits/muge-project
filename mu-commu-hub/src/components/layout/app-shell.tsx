"use client";
import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ErrorState } from "@/components/ui";
import { motionTiming } from "@/lib/motion/config";
import { useApp } from "@/stores/app";
import { Sidebar, Topbar, MobileNav } from "./navigation";
import { RightRail } from "./right-rail";
import { PageLoading } from "./page-loading";

const CreatePostModal = dynamic(() =>
  import("@/components/posts/create-post-modal").then(
    (module) => module.CreatePostModal,
  ),
);
const SearchPalette = dynamic(() =>
  import("./search-palette").then((module) => module.SearchPalette),
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const ready = useApp((s) => s.ready);
  const error = useApp((s) => s.error);
  const sessionStatus = useApp((s) => s.sessionStatus);
  const sessionError = useApp((s) => s.sessionError);
  const initializeSession = useApp((s) => s.initializeSession);
  const load = useApp((s) => s.load);
  const createOpen = useApp((s) => s.createOpen);
  const searchOpen = useApp((s) => s.searchOpen);
  const setSearchOpen = useApp((s) => s.setSearchOpen);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", openSearch);
    return () => document.removeEventListener("keydown", openSearch);
  }, [setSearchOpen]);
  return (
    <div
      className="min-h-screen"
      data-section={pathname.split("/")[1] || "home"}
    >
      <Sidebar />
      <div className="min-h-screen lg:pl-[240px]">
        <Topbar />
        <div className="page-wrap flex gap-7 px-4 pb-28 pt-7 md:px-8 lg:px-9 lg:pb-10">
          <motion.main
            key={pathname}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0 : motionTiming.normal,
              ease: motionTiming.easeOut,
            }}
            className="min-w-0 flex-1"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={
                  sessionError
                    ? "error"
                    : !ready
                      ? "loading"
                      : error
                        ? "error"
                        : "content"
                }
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : motionTiming.fast }}
              >
                {sessionError ? (
                  <ErrorState
                    title="Could not restore your demo profile"
                    description={sessionError}
                    onRetry={initializeSession}
                  />
                ) : !ready || sessionStatus === "initializing" ? (
                  <PageLoading pathname={pathname} />
                ) : error ? (
                  <ErrorState
                    title="Could not load the demo"
                    description={error}
                    onRetry={load}
                  />
                ) : (
                  <Suspense fallback={<PageLoading pathname={pathname} />}>
                    {children}
                  </Suspense>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.main>
          {ready && !error && sessionStatus === "ready" && <RightRail />}
        </div>
      </div>
      <MobileNav />
      {createOpen && <CreatePostModal />}
      {searchOpen && <SearchPalette />}
    </div>
  );
}
