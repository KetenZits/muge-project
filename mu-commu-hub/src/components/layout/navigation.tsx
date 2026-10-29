"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { Avatar, Button } from "@/components/ui";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useApp } from "@/stores/app";

const destinations = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageCircle },
];
export const campusDestinations = [
  {
    href: "/home?view=feed",
    label: "Campus conversations",
    description: "Share ideas and see what’s happening",
    icon: MessageCircle,
  },
  {
    href: "/people",
    label: "People directory",
    description: "Browse students across faculties",
    icon: Users,
  },
  {
    href: "/communities",
    label: "Communities",
    description: "Find a place for your interests",
    icon: LayoutGrid,
  },
  {
    href: "/competitions",
    label: "Competitions",
    description: "Find your next challenge",
    icon: Trophy,
  },
  {
    href: "/events",
    label: "Events & gatherings",
    description: "Learn, meet, and make plans",
    icon: CalendarDays,
  },
  {
    href: "/saved",
    label: "Saved for later",
    description: "Pick up something you bookmarked",
    icon: Bookmark,
  },
  {
    href: "/me",
    label: "My Activity",
    description: "Your posts, requests, and plans",
    icon: UserRound,
  },
];
const isCurrent = (path: string, href: string) =>
  path === href || path.startsWith(href + "/");

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/home"
      className="app-brand flex min-h-11 shrink-0 items-center gap-3"
      aria-label="MU Connect home"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#17468c] text-lg font-bold text-white">
        M<span className="text-[#fac334]">·</span>
      </span>
      {!compact && (
        <span className="brand-label whitespace-nowrap text-lg font-bold tracking-tight text-[#17468c]">
          MU <span className="font-medium text-[#233a59]">Connect</span>
        </span>
      )}
    </Link>
  );
}
function usePrimary() {
  const username = useApp((s) => s.user.username);
  return [
    ...destinations,
    { href: "/profile/" + username, label: "Profile", icon: UserRound },
  ];
}
export function Sidebar() {
  const pathname = usePathname();
  const primary = usePrimary();
  return (
    <div className="hidden lg:block">
      <UISidebar collapsible="icon" className="app-sidebar">
        <SidebarHeader className="px-4 pb-8 pt-6">
          <Brand />
        </SidebarHeader>
        <SidebarContent className="px-3">
          <nav aria-label="Main navigation">
            <SidebarMenu className="gap-2">
              {primary.map(({ href, label, icon: Icon }) => {
                const active =
                  isCurrent(pathname, href) ||
                  (href === "/discover" && pathname === "/people");
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={label}
                      className="app-nav-link"
                    >
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        aria-label={label}
                      >
                        <Icon size={20} aria-hidden="true" />
                        <span>{label}</span>
                        {active && (
                          <Check
                            className="nav-active-mark ml-auto"
                            size={15}
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </nav>
          <div className="mt-6 border-t border-[var(--line)] pt-5">
            <ExploreMenu />
          </div>
        </SidebarContent>
        <SidebarFooter className="gap-3 border-t border-[var(--line)] p-3">
          <p className="sidebar-note px-2 text-xs leading-5 text-muted">
            Your campus, connected.
            <br />
            Independent local demo.
          </p>
          <AccountMenu expanded />
        </SidebarFooter>
      </UISidebar>
    </div>
  );
}
export function ExploreMenu() {
  const [open, setOpen] = useState(false);
  const openComposer = useApp((s) => s.openComposer);
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          title="Explore campus"
          className="explore-trigger flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted hover:bg-[#eef3fa]"
          aria-label="Explore campus"
        >
          <LayoutGrid size={20} className="shrink-0" />
          <span className="sidebar-label">Explore campus</span>
        </button>
      </SheetTrigger>
      <SheetContent
        className="w-[min(400px,100vw)] overflow-y-auto bg-white p-6"
        side="right"
      >
        <SheetHeader className="p-0 pr-8">
          <SheetTitle className="text-2xl font-bold text-[#17263c]">
            Explore campus
          </SheetTitle>
          <SheetDescription>
            More ways to connect, all in one place.
          </SheetDescription>
        </SheetHeader>
        <Button
          className="mt-3 w-full"
          onClick={() => {
            setOpen(false);
            openComposer();
          }}
        >
          <Plus size={18} /> Create post
        </Button>
        <nav aria-label="Campus navigation" className="space-y-1">
          {campusDestinations.map(
            ({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={pathname === href ? "page" : undefined}
                className="flex min-h-16 items-center gap-3 rounded-xl p-3 hover:bg-[#f0f4fa]"
              >
                <Icon size={20} className="shrink-0 text-[#17468c]" />
                <span>
                  <strong className="block text-sm">{label}</strong>
                  <span className="mt-1 block text-xs text-muted">
                    {description}
                  </span>
                </span>
              </Link>
            ),
          )}
        </nav>
        <Link
          href="/login"
          onClick={() => setOpen(false)}
          className="flex min-h-11 items-center gap-3 border-t border-[var(--line)] px-3 pt-3 text-sm font-semibold text-[#17468c]"
        >
          <LogOut size={18} />
          Return to login
        </Link>
        <p className="text-xs leading-5 text-muted">
          Activity stays in this browser. Sample people and opportunities; no
          one is contacted.
        </p>
      </SheetContent>
    </Sheet>
  );
}
function AccountMenu({ expanded = false }: { expanded?: boolean }) {
  const user = useApp((s) => s.user);
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button
          aria-label="Open account menu"
          className={
            expanded
              ? "account-trigger flex min-h-12 w-full items-center gap-2 rounded-xl p-2 text-left hover:bg-[#eef3fa]"
              : "icon-button"
          }
        >
          <Avatar user={user} size="sm" />
          {expanded && (
            <>
              <span className="sidebar-label min-w-0 flex-1">
                <strong className="block truncate text-sm">{user.name}</strong>
                <span className="block text-xs text-muted">Your account</span>
              </span>
              <ChevronDown size={15} className="sidebar-label" />
            </>
          )}
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content
          align="end"
          sideOffset={8}
          className="z-50 w-60 rounded-2xl border border-[var(--line)] bg-white p-2 shadow-lg"
        >
          <Dropdown.Label className="px-3 py-2 text-xs text-muted">
            {user.name} · Demo profile
          </Dropdown.Label>
          {[
            {
              href: "/profile/" + user.username,
              label: "View & edit profile",
              icon: UserRound,
            },
            { href: "/me", label: "My Activity", icon: LayoutGrid },
            { href: "/saved", label: "Saved for later", icon: Bookmark },
            { href: "/notifications", label: "Notifications", icon: Bell },
            { href: "/login", label: "Return to login", icon: LogOut },
          ].map(({ href, label, icon: Icon }) => (
            <Dropdown.Item key={href} asChild>
              <Link
                href={href}
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm outline-none hover:bg-[#eef3fa] focus:bg-[#eef3fa]"
              >
                <Icon size={17} />
                {label}
              </Link>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
export function Topbar() {
  const setSearch = useApp((s) => s.setSearchOpen);
  const openComposer = useApp((s) => s.openComposer);
  const unread = useApp((s) => s.notifications.filter((n) => !n.read).length);
  const pathname = usePathname();
  const label = pathname.startsWith("/profile/")
    ? "Profile"
    : pathname === "/people"
      ? "People"
      : (destinations.find((d) => isCurrent(pathname, d.href))?.label ??
        campusDestinations.find((d) => isCurrent(pathname, d.href))?.label ??
        "Campus");
  return (
    <header className="app-topbar sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-2 border-b border-[var(--line)] bg-white px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden lg:block">
          <SidebarTrigger className="min-h-11 min-w-11" />
        </div>
        <div className="lg:hidden">
          <Brand compact />
        </div>
        <span className="truncate text-sm font-semibold text-muted">
          {label}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <button
          onClick={() => openComposer()}
          className="icon-button text-[#17468c]"
          aria-label="Create post"
        >
          <Plus size={21} />
        </button>
        <button
          onClick={() => setSearch(true)}
          className="hidden min-h-11 items-center gap-3 rounded-xl bg-[#f5f7fb] px-4 text-sm text-muted sm:flex"
        >
          <Search size={17} />
          Search campus<kbd className="ml-5 text-xs">⌘ K</kbd>
        </button>
        <button
          onClick={() => setSearch(true)}
          className="icon-button sm:hidden"
          aria-label="Search campus"
        >
          <Search size={20} />
        </button>
        <div className="w-11 lg:hidden">
          <SheetExploreIcon />
        </div>
        <Link
          href="/notifications"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          className="icon-button relative"
        >
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#17468c] text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        <div className="hidden sm:block">
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
function SheetExploreIcon() {
  return (
    <div className="mobile-explore">
      <ExploreMenu />
      <Menu
        size={20}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-3"
      />
    </div>
  );
}
export function MobileNav() {
  const primary = usePrimary();
  const pathname = usePathname();
  return (
    <nav
      className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-[var(--line)] bg-white px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      {primary.map(({ href, label, icon: Icon }) => {
        const active =
          isCurrent(pathname, href) ||
          (href === "/discover" && pathname === "/people");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active ? "text-[#17468c]" : "text-muted"}`}
          >
            <span
              className={`flex h-7 w-12 items-center justify-center rounded-full ${active ? "bg-[#eaf1fc]" : ""}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
