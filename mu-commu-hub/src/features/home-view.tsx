"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Compass,
  LayoutGrid,
  MessageCircle,
  Plus,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import { Avatar, Button, PageHeader } from "@/components/ui";
import { TeamCard } from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { filterPeople } from "@/lib/discovery";
import { deadline } from "@/lib/utils";
import { useUrlState } from "@/lib/navigation";
import { SectionHead } from "./shared-controls";
import { CampusFeed } from "./home-feed";

export function HomeView() {
  const [state] = useUrlState({ view: "dashboard" });
  const { user, users, teams, openComposer } = useApp(
    useShallow((s) => ({
      user: s.user,
      users: s.users,
      teams: s.teams,
      openComposer: s.openComposer,
    })),
  );
  if (state.view === "feed")
    return (
      <>
        <Link
          href="/home"
          className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#17468c]"
        >
          <ArrowLeft size={16} />
          Back to your dashboard
        </Link>
        <CampusFeed />
      </>
    );
  const people = filterPeople(users, user, {
    query: "",
    faculty: "",
    major: "",
    year: "",
    skill: "",
    interest: "",
    availability: "",
    sort: "Best match",
  }).slice(0, 3);
  const recruiting = teams
    .filter(
      (t) =>
        t.leaderId !== user.id &&
        t.members < t.capacity &&
        deadline(t.deadline) !== "Closed" &&
        t.roles.some((r) => !r.filled),
    )
    .slice(0, 2);
  const shortcuts = [
    {
      title: "Discover People",
      description: "Find skills that complement yours.",
      icon: Compass,
      tone: "blue",
      href: "/discover?scope=People",
    },
    {
      title: "Find Teams",
      description: "Find a project you want to be part of.",
      icon: Users,
      tone: "purple",
      href: "/teams",
    },
    {
      title: "Create a Team",
      description: "Bring your next idea to life.",
      icon: Plus,
      tone: "green",
      action: () => openComposer("Team"),
    },
    {
      title: "My Teams",
      description: "Your teams and join requests.",
      icon: LayoutGrid,
      tone: "orange",
      href: "/teams?view=mine",
    },
    {
      title: "Messages",
      description: "Keep the conversation going.",
      icon: MessageCircle,
      tone: "pink",
      href: "/messages",
    },
    {
      title: "My Profile",
      description: "Show what you can bring to a team.",
      icon: UserRound,
      tone: "cyan",
      href: "/profile/" + user.username,
    },
  ];
  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}.`}
        subtitle="Find your people. Build something together."
        action={
          <Button asChild variant="secondary">
            <Link href="/home?view=feed">
              <MessageCircle size={16} />
              Campus conversations
            </Link>
          </Button>
        }
      />
      <section aria-label="What would you like to do?">
        <h2 className="mb-4 text-sm font-semibold text-muted">
          Where would you like to start?
        </h2>
        <AnimatedContent
          trigger="mount"
          distance={10}
          duration={0.32}
          initialOpacity={0.7}
          stagger={0.035}
          className="dashboard-shortcuts grid gap-3 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4"
        >
          {shortcuts.map(
            ({ title, description, icon: Icon, tone, href, action }) => {
              const content = (
                <>
                  <span className="shortcut-top flex items-center justify-between">
                    <Icon size={26} strokeWidth={1.7} aria-hidden="true" />
                    <ArrowRight
                      size={19}
                      className="shortcut-arrow"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-6 block text-lg font-bold tracking-tight">
                    {title}
                  </span>
                  <span className="mt-1 block text-sm leading-5">
                    {description}
                  </span>
                </>
              );
              return href ? (
                <Link
                  key={title}
                  href={href}
                  className={`shortcut-tile ${tone}`}
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={title}
                  type="button"
                  onClick={action}
                  className={`shortcut-tile ${tone} text-left`}
                >
                  {content}
                </button>
              );
            },
          )}
        </AnimatedContent>
      </section>
      <section className="mt-9" aria-label="More around campus">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-y border-[var(--line)] py-3">
          <span className="text-sm font-semibold text-muted">
            More around campus
          </span>
          {[
            { href: "/communities", label: "Communities", icon: LayoutGrid },
            { href: "/competitions", label: "Competitions", icon: Trophy },
            { href: "/events", label: "Events", icon: CalendarDays },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#17468c]"
            >
              <Icon size={16} />
              {label}
              <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </section>
      {people.length > 0 && (
        <section className="mt-8">
          <SectionHead
            title="People you could connect with"
            href="/discover?scope=People"
          />
          <p className="-mt-2 mb-4 text-xs leading-5 text-muted">
            Based on shared selections in your local demo profile.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {people.map((person) => (
              <Link
                key={person.id}
                href={"/profile/" + person.username}
                className="card flex min-w-0 items-start gap-3 p-4 transition-colors hover:border-[#b6c9e2]"
              >
                <Avatar user={person} />
                <span className="min-w-0">
                  <strong className="block text-sm">{person.name}</strong>
                  <span className="mt-1 block text-xs text-muted">
                    {person.major}
                  </span>
                  <span className="mt-3 block text-xs font-semibold text-[#17468c]">
                    {person.skills.slice(0, 2).join(" · ")}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {recruiting.length > 0 && (
        <section className="mt-8">
          <SectionHead title="Teams looking for members" href="/teams" />
          <div className="grid gap-4 xl:grid-cols-2">
            {recruiting.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
