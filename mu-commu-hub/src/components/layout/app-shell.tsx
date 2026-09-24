"use client";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Command } from "cmdk";
import * as Popover from "@radix-ui/react-popover";
import {
  Bell,
  Bookmark,
  CalendarDays,
  ChevronDown,
  Compass,
  Home,
  LayoutGrid,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { Avatar, Button, LoadingCards, Modal } from "@/components/ui";
import { useApp } from "@/stores/app";
import { CreatePostModal } from "@/components/posts/create-post-modal";
const nav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/communities", label: "Communities", icon: LayoutGrid },
  { href: "/competitions", label: "Competitions", icon: Trophy },
  { href: "/teams", label: "Team Finder", icon: Users },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/me", label: "My Activity", icon: UserRound },
];
function Brand() {
  return (
    <Link href="/home" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#17468c] text-lg font-black text-white shadow-[0_4px_14px_#17468c25]">
        <span className="relative">
          M<span className="absolute -right-2 -top-2 text-[#fac334]">.</span>
        </span>
      </span>
      <span className="text-[19px] font-bold tracking-[-.06em] text-[#17468c]">
        MU <span className="font-medium text-[#233a59]">Connect</span>
      </span>
    </Link>
  );
}
function Sidebar() {
  const pathname = usePathname();
  const user = useApp((s) => s.user);
  const open = useApp((s) => s.setCreateOpen);
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r border-[#e4ebf2] bg-white px-4 py-6 lg:flex">
      <div className="px-3">
        <Brand />
      </div>
      <button
        onClick={() => open(true)}
        className="mt-9 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#17468c] text-sm font-semibold text-white shadow-[0_5px_14px_#17468c24] transition hover:bg-[#0f3775]"
      >
        <Plus size={18} /> Create post
      </button>
      <nav className="mt-6 space-y-1" aria-label="Main navigation">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition ${active ? "bg-[#eaf1fc] text-[#17468c]" : "text-[#687990] hover:bg-[#f5f8fc] hover:text-[#17468c]"}`}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 1.9} />
              {item.label}
              {item.label === "Notifications" && <UnreadBadge />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <div className="rounded-2xl bg-[#f8f5ec] p-4">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#fac334] text-[#715416]">
            <Sparkles size={16} />
          </div>
          <p className="text-sm font-bold">Find your next big thing</p>
          <p className="mt-1 text-xs leading-5 text-[#82755b]">
            Connect with people who share your ambition.
          </p>
          <Link
            href="/people"
            className="mt-3 inline-flex text-xs font-bold text-[#17468c]"
          >
            Explore people →
          </Link>
        </div>
        <Link
          href={`/profile/${user.username}`}
          className="mt-5 flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[#f5f8fc]"
        >
          <Avatar user={user} size="sm" />
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-xs">{user.name}</strong>
            <small className="text-[11px] text-[#8998a8]">
              Year {user.year} · {user.faculty}
            </small>
          </span>
          <ChevronDown size={14} className="text-[#a1adba]" />
        </Link>
      </div>
    </aside>
  );
}
function UnreadBadge() {
  const count = useApp((s) => s.notifications.filter((n) => !n.read).length);
  return count > 0 ? (
    <span className="ml-auto flex min-w-5 items-center justify-center rounded-full bg-[#fac334] px-1 text-[10px] text-[#654b0b]">
      {count}
    </span>
  ) : null;
}
function Topbar() {
  const setSearch = useApp((s) => s.setSearchOpen);
  const user = useApp((s) => s.user);
  const notifications = useApp((s) => s.notifications);
  const markRead = useApp((s) => s.markRead);
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-4 border-b border-[#e5ebf2] bg-white/95 px-4 backdrop-blur md:px-8 lg:px-9">
      <div className="lg:hidden">
        <Brand />
      </div>
      <div className="hidden text-sm font-semibold text-[#66768a] lg:block">
        {nav.find(
          (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
        )?.label ?? "Campus"}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setSearch(true)}
          className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-[#e2e9f0] bg-[#f8fafc] px-3 text-left text-xs text-[#98a6b6] transition hover:border-[#c6d6e7] sm:flex"
        >
          <Search size={16} /> Search anything{" "}
          <kbd className="ml-auto rounded border border-[#dbe4ee] bg-white px-1.5 py-0.5 text-[10px]">
            ⌘ K
          </kbd>
        </button>
        <button
          onClick={() => setSearch(true)}
          className="rounded-xl p-2.5 text-[#64758c] hover:bg-[#f0f4f9] sm:hidden"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className="relative rounded-xl p-2.5 text-[#64758c] hover:bg-[#f0f4f9]"
              aria-label="Open notifications"
            >
              <Bell size={20} />
              {notifications.some((n) => !n.read) && (
                <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-[#fac334] ring-2 ring-white" />
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
              {notifications.slice(0, 4).map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className="block w-full rounded-xl px-3 py-2 text-left hover:bg-[#f5f8fc]"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    {!n.read && (
                      <i className="h-2 w-2 rounded-full bg-[#17468c]" />
                    )}
                    {n.title}
                  </span>
                  <span className="mt-1 block text-xs text-[#7b8b9e]">
                    {n.body}
                  </span>
                </button>
              ))}
              <Link
                href="/notifications"
                className="block border-t border-[#e8eef4] px-3 py-3 text-center text-xs font-bold text-[#17468c]"
              >
                View all notifications
              </Link>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <Link href={`/profile/${user.username}`} aria-label="Your profile">
          <Avatar user={user} size="sm" />
        </Link>
      </div>
    </header>
  );
}
function MobileNav() {
  const pathname = usePathname();
  const open = useApp((s) => s.setCreateOpen);
  const items = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/notifications", label: "Alerts", icon: Bell },
    { href: "/me", label: "Profile", icon: UserRound },
  ];
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex h-[74px] items-center justify-around border-t border-[#e2eaf2] bg-white px-3 pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      {items.slice(0, 2).map((x) => (
        <MobileLink key={x.href} {...x} active={pathname === x.href} />
      ))}
      <button
        onClick={() => open(true)}
        className="-mt-7 flex h-13 w-13 items-center justify-center rounded-2xl bg-[#17468c] text-white shadow-[0_7px_18px_#17468c55]"
        aria-label="Create post"
      >
        <Plus size={26} />
      </button>
      {items.slice(2).map((x) => (
        <MobileLink key={x.href} {...x} active={pathname === x.href} />
      ))}
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
      className={`flex min-w-13 flex-col items-center gap-1 text-[10px] font-semibold ${active ? "text-[#17468c]" : "text-[#8b9aab]"}`}
    >
      <Icon size={21} strokeWidth={active ? 2.5 : 2} />
      {label}
    </Link>
  );
}
function RightRail() {
  const users = useApp((s) => s.users);
  const events = useApp((s) => s.events);
  const following = useApp((s) => s.following);
  const toggleFollow = useApp((s) => s.toggleFollow);
  return (
    <aside className="hidden w-[270px] shrink-0 space-y-5 xl:block">
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <strong className="text-sm">Trending topics</strong>
          <Sparkles size={16} className="text-[#a5812d]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["#Hackathon", "#AI", "#Startup", "#WebDev", "#Cybersecurity"].map(
            (x) => (
              <Link
                key={x}
                href={`/discover?q=${encodeURIComponent(x.slice(1))}`}
                className="chip blue hover:bg-[#dceafb]"
              >
                {x}
              </Link>
            ),
          )}
        </div>
      </div>
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <strong className="text-sm">People to meet</strong>
          <Link href="/people" className="text-xs font-bold text-[#17468c]">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {users.slice(1, 4).map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <Avatar user={user} size="sm" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/profile/${user.username}`}
                  className="block truncate text-xs font-semibold hover:text-[#17468c]"
                >
                  {user.name}
                </Link>
                <span className="text-[11px] text-[#8b9aab]">{user.major}</span>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className="text-[#17468c]"
                aria-label={following.includes(user.id) ? "Unfollow" : "Follow"}
              >
                {following.includes(user.id) ? "✓" : <Plus size={17} />}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <strong className="text-sm">Coming up</strong>
          <CalendarDays size={16} className="text-[#a5812d]" />
        </div>
        {events.slice(0, 2).map((e) => (
          <Link
            href="/events"
            key={e.id}
            className="block border-t border-[#edf1f5] py-3 first:border-0"
          >
            <span className="text-xs font-semibold">{e.title}</span>
            <span className="mt-1 block text-[11px] text-[#8b9aab]">
              {new Date(e.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              · {e.location}
            </span>
          </Link>
        ))}
      </div>
      <p className="px-2 text-[11px] leading-5 text-[#a0acb9]">
        MU Connect is an independent frontend prototype. Not an official
        university service.
      </p>
    </aside>
  );
}
function SearchPalette() {
  const open = useApp((s) => s.searchOpen);
  const setOpen = useApp((s) => s.setSearchOpen);
  const { users, posts, teams, competitions, events, clubs } = useApp();
  const router = useRouter();
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);
  const groups = useMemo(
    () => [
      {
        name: "People",
        items: users
          .slice(0, 15)
          .map((x) => ({
            id: x.id,
            label: x.name,
            href: `/profile/${x.username}`,
          })),
      },
      {
        name: "Posts",
        items: posts
          .slice(0, 20)
          .map((x) => ({ id: x.id, label: x.title, href: `/posts/${x.id}` })),
      },
      {
        name: "Teams",
        items: teams.map((x) => ({
          id: x.id,
          label: x.title,
          href: `/teams/${x.id}`,
        })),
      },
      {
        name: "Competitions",
        items: competitions.map((x) => ({
          id: x.id,
          label: x.title,
          href: `/competitions/${x.id}`,
        })),
      },
      {
        name: "Events",
        items: events.map((x) => ({
          id: x.id,
          label: x.title,
          href: "/events",
        })),
      },
      {
        name: "Communities",
        items: clubs.map((x) => ({
          id: x.id,
          label: x.name,
          href: `/communities/${x.slug}`,
        })),
      },
    ],
    [users, posts, teams, competitions, events, clubs],
  );
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Search campus"
      description="Find students, posts, teams, events and communities."
      className="max-w-2xl"
    >
      <Command className="overflow-hidden">
        <Command.Input
          autoFocus
          placeholder="Try “AI hackathon” or “Figma”..."
          className="mb-3 h-12 w-full rounded-xl border border-[#dfe8f1] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[#17468c]"
        />
        <Command.List className="max-h-[50vh] overflow-y-auto">
          <Command.Empty className="px-4 py-10 text-center text-sm text-[#8190a2]">
            No results. Try another search.
          </Command.Empty>
          {groups.map((group) => (
            <Command.Group
              key={group.name}
              heading={group.name}
              className="mb-3 text-xs font-bold text-[#a5812d] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
            >
              {group.items.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${group.name} ${item.label}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                  className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-[#33445a] data-[selected=true]:bg-[#eef4fc] data-[selected=true]:text-[#17468c]"
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </Modal>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  const ready = useApp((s) => s.ready);
  const error = useApp((s) => s.error);
  const load = useApp((s) => s.load);
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="min-h-screen lg:pl-[240px]">
        <Topbar />
        <div className="page-wrap flex gap-7 px-4 pb-28 pt-7 md:px-8 lg:px-9 lg:pb-10">
          <motion.main
            key={usePathname()}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
            className="min-w-0 flex-1"
          >
            {!ready ? (
              <LoadingCards />
            ) : error ? (
              <div className="card p-8">
                <h2 className="text-lg font-bold">Could not load the demo</h2>
                <p className="mt-2 text-sm text-[#718096]">{error}</p>
                <Button className="mt-4" onClick={load}>
                  Try again
                </Button>
              </div>
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
