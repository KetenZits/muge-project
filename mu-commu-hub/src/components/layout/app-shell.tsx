"use client";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ErrorState } from "@/components/ui";
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
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="min-h-screen lg:pl-[240px]">
        <Topbar />
        <div className="page-wrap flex gap-7 px-4 pb-28 pt-7 md:px-8 lg:px-9 lg:pb-10">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
            className="min-w-0 flex-1"
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
