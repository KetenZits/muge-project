"use client";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ErrorState } from "@/components/ui";
import { motionTiming } from "@/lib/motion/config";
import { useApp } from "@/stores/app";
import { CreatePostModal } from "@/components/posts/create-post-modal";
import { Sidebar, Topbar, MobileNav } from "./navigation";
import { RightRail } from "./right-rail";
import { SearchPalette } from "./search-palette";
import { PageLoading } from "./page-loading";

export function AppShell({ children }: { children: React.ReactNode }) {
  const ready = useApp((s) => s.ready);
  const error = useApp((s) => s.error);
  const load = useApp((s) => s.load);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="min-h-screen lg:pl-[240px]">
        <Topbar />
        <div className="page-wrap flex gap-7 px-4 pb-28 pt-7 md:px-8 lg:px-9 lg:pb-10">
          <motion.main
            key={pathname}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0 : motionTiming.normal,
              ease: motionTiming.easeOut,
            }}
            className="min-w-0 flex-1"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={!ready ? "loading" : error ? "error" : "content"}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : motionTiming.fast }}
              >
                {!ready ? (
                  <PageLoading pathname={pathname} />
                ) : error ? (
                  <ErrorState
                    title="Could not load the demo"
                    description={error}
                    onRetry={load}
                  />
                ) : (
                  children
                )}
              </motion.div>
            </AnimatePresence>
          </motion.main>
          {ready && !error && <RightRail />}
        </div>
      </div>
      <MobileNav />
      <CreatePostModal />
      <SearchPalette />
    </div>
  );
}
