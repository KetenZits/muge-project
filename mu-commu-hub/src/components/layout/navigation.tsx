"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { motion, useReducedMotion } from "motion/react";
import {
  Bell,
  Bookmark,
  CalendarDays,
  Compass,
  Home,
  LayoutGrid,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Trophy,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { motionTiming } from "@/lib/motion/config";
import { useApp } from "@/stores/app";

const nav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/teams", label: "Team Finder", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/communities", label: "Communities", icon: LayoutGrid },
  { href: "/competitions", label: "Competitions", icon: Trophy },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/me", label: "My Activity", icon: UserRound },
];
const isCurrent = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/");

function Brand() {
  return (
    <Link
      href="/home"
      className="flex items-center gap-3"
      aria-label="MU Connect home"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#17468c] text-lg font-bold text-white">
        M<span className="text-[#fac334]">·</span>
      </span>
      <span className="text-[19px] font-bold tracking-[-.03em] text-[#17468c]">
        MU <span className="font-medium text-[#233a59]">Connect</span>
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const user = useApp((state) => state.user);
  const openComposer = useApp((state) => state.openComposer);
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col overflow-y-auto border-r border-[#e4ebf2] bg-white px-4 py-6 lg:flex">
      <div className="px-3">
        <Brand />
      </div>
      <button
        onClick={() => openComposer()}
        className="mt-7 flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#17468c] text-sm font-semibold text-white transition hover:bg-[#0f3672]"
      >
        <Plus size={18} /> Create post
      </button>
      <nav className="mt-5 space-y-1" aria-label="Main navigation">
        {nav.map((item, index) => {
          const Icon = item.icon;
          const active = isCurrent(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                "relative isolate flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors " +
                (index === 4 || index === 7 ? "mt-4 " : "") +
                (active
                  ? "text-[#17468c]"
                  : "text-[#68778c] hover:bg-[#f5f8fc] hover:text-[#17468c]")
              }
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-[#eaf1fc]"
                  transition={
                    reducedMotion ? { duration: 0 } : motionTiming.softSpring
                  }
                />
              )}
              <Icon size={18} strokeWidth={active ? 2.4 : 1.9} />
              <span>{item.label}</span>
              {item.href === "/notifications" && <UnreadBadge />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        <Link
          href="/people"
          className="flex min-h-11 items-center gap-3 px-3 text-sm font-semibold text-[#17468c]"
        >
          <Users size={18} /> Find people
        </Link>
        <Link
          href={"/profile/" + user.username}
          aria-current={
            pathname === "/profile/" + user.username ? "page" : undefined
          }
          className="mt-2 flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-[#f5f8fc]"
        >
          <Avatar user={user} size="sm" />
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-sm">{user.name}</strong>
            <span className="block text-xs text-muted">View your profile</span>
          </span>
        </Link>
        <p className="px-3 pt-3 text-xs leading-5 text-muted">
          Local demo · activity stays in this browser.
        </p>
      </div>
    </aside>
  );
}

function UnreadBadge() {
  const count = useApp(
    (state) =>
      state.notifications.filter((notification) => !notification.read).length,
  );
  return count > 0 ? (
    <span
      className="ml-auto inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#fac334] px-1 text-xs font-semibold text-[#4c390c]"
      aria-label={count + " unread notifications"}
    >
      {count}
    </span>
  ) : null;
}

export function Topbar() {
  const setSearch = useApp((state) => state.setSearchOpen);
  const user = useApp((state) => state.user);
  const notifications = useApp((state) => state.notifications);
  const markRead = useApp((state) => state.markRead);
  const pathname = usePathname();
  const pageLabel = pathname.startsWith("/profile/")
    ? "Profile"
    : pathname === "/people"
      ? "People"
      : (nav.find((item) => isCurrent(pathname, item.href))?.label ?? "Campus");
  return (
    <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-2 border-b border-[#e5ebf2] bg-white px-4 md:px-8 lg:px-9">
      <div className="lg:hidden">
        <Brand />
      </div>
      <p className="hidden text-sm font-semibold text-muted lg:block">
        {pageLabel}
      </p>
      <div className="flex items-center gap-1 sm:gap-3">
        <button
          onClick={() => setSearch(true)}
          className="hidden min-h-11 w-64 items-center gap-2 rounded-xl border border-[#e2e9f0] bg-[#f8fafc] px-3 text-left text-sm text-[#68778c] hover:border-[#b9cce3] sm:flex"
        >
          <Search size={17} /> Search campus{" "}
          <kbd className="ml-auto rounded border border-[#dbe4ee] bg-white px-1.5 py-1 text-xs">
            Ctrl/⌘ K
          </kbd>
        </button>
        <button
          onClick={() => setSearch(true)}
          className="icon-button sm:hidden"
          aria-label="Search campus"
        >
          <Search size={20} />
        </button>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className="icon-button relative"
              aria-label="Open notifications"
            >
              <Bell size={20} />
              {notifications.some((notification) => !notification.read) && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#a5812d] ring-2 ring-white" />
              )}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={8}
              align="end"
              className="z-50 w-[min(360px,calc(100vw-24px))] rounded-2xl border border-[#e2eaf2] bg-white p-2 shadow-xl"
            >
              <div className="flex items-center justify-between px-3 py-3">
                <strong className="text-sm">Notifications</strong>
                <UnreadBadge />
              </div>
              {notifications.slice(0, 4).map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markRead(notification.id)}
                  className="block w-full rounded-xl px-3 py-3 text-left hover:bg-[#f5f8fc]"
                  aria-label={
                    notification.title +
                    (notification.read ? ", read" : ", mark as read")
                  }
                >
                  <span className="block text-sm font-semibold">
                    {notification.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted">
                    {notification.body}
                  </span>
                </button>
              ))}
              <Link
                href="/notifications"
                className="flex min-h-11 items-center justify-center border-t border-[#e8eef4] px-3 py-3 text-sm font-semibold text-[#17468c]"
              >
                View all notifications
              </Link>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <Link
          href={"/profile/" + user.username}
          aria-label="Your profile"
          className="inline-flex min-h-11 min-w-11 items-center justify-center"
        >
          <Avatar user={user} size="sm" />
        </Link>
      </div>
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const user = useApp((state) => state.user);
  const openComposer = useApp((state) => state.openComposer);
  const [moreOpen, setMoreOpen] = useState(false);
  const primary = nav.slice(0, 4).map((item) => ({
    ...item,
    label: item.href === "/teams" ? "Teams" : item.label,
  }));
  const moreItems = [
    ...nav.slice(4),
    { href: "/people", label: "People", icon: Users },
    {
      href: "/profile/" + user.username,
      label: "Your profile",
      icon: UserRound,
    },
  ];
  const moreActive = moreItems.some((item) => isCurrent(pathname, item.href));
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex min-h-[74px] items-center justify-around border-t border-[#e2eaf2] bg-white px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      {primary.map((item) => (
        <MobileLink
          key={item.href}
          {...item}
          active={isCurrent(pathname, item.href)}
        />
      ))}
      <Popover.Root open={moreOpen} onOpenChange={setMoreOpen}>
        <Popover.Trigger asChild>
          <button
            className={
              "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold " +
              (moreActive || moreOpen
                ? "bg-[#eaf1fc] text-[#17468c]"
                : "text-[#68778c]")
            }
            aria-label="More navigation"
          >
            <MoreHorizontal size={21} />
            More
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side="top"
            align="end"
            sideOffset={12}
            aria-label="More navigation"
            className="z-50 max-h-[75svh] w-[min(360px,calc(100vw-24px))] overflow-y-auto rounded-2xl border border-[#dce5ef] bg-white p-3 shadow-xl"
          >
            <div className="mb-2 flex items-center justify-between px-2">
              <strong className="text-base">More on MU Connect</strong>
              <Popover.Close
                className="icon-button"
                aria-label="Close navigation"
              >
                <X size={18} />
              </Popover.Close>
            </div>
            <button
              onClick={() => {
                setMoreOpen(false);
                openComposer();
              }}
              className="mb-2 flex min-h-11 w-full items-center gap-3 rounded-xl bg-[#17468c] px-3 text-sm font-semibold text-white"
            >
              <Plus size={18} /> Create post
            </button>
            {moreItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold " +
                    (active
                      ? "bg-[#eaf1fc] text-[#17468c]"
                      : "text-[#53647c] hover:bg-[#f5f8fc]")
                  }
                >
                  <Icon size={18} />
                  {item.label}
                  {item.href === "/notifications" && <UnreadBadge />}
                </Link>
              );
            })}
            <p className="border-t border-[#e5ebf2] px-3 pt-3 text-xs leading-5 text-muted">
              Independent local demo. Activity stays in this browser; no one is
              contacted.
            </p>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </nav>
  );
}

function MobileLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold " +
        (active ? "bg-[#eaf1fc] text-[#17468c]" : "text-[#68778c]")
      }
    >
      <Icon size={21} strokeWidth={active ? 2.5 : 2} />
      {label}
    </Link>
  );
}
