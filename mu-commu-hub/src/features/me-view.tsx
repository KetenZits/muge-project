"use client";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Heart,
  MessageCircle,
  Plus,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import {
  CompetitionCard,
  EventCard,
  PostCard,
  TeamCard,
} from "@/components/shared/cards";
import { useApp } from "@/stores/app";
import { deadline } from "@/lib/utils";
import { SectionHead } from "./shared-controls";

export function MeView() {
  const {
    user,
    posts,
    teams,
    competitions,
    bookmarks,
    following,
    events,
    interactions,
    messages,
    setCreateOpen,
  } = useApp();
  const mine = posts.filter((post) => post.authorId === user.id);
  const myTeams = teams.filter((team) => team.leaderId === user.id);
  const requested = teams.filter((team) =>
    interactions.some((item) => item.id === `teamRequest:${team.id}`),
  );
  const savedCompetitions = competitions.filter((competition) =>
    bookmarks.some(
      (bookmark) =>
        bookmark.kind === "competitions" && bookmark.itemId === competition.id,
    ),
  );
  const upcomingEvents = events.filter(
    (event) =>
      deadline(event.date) !== "Closed" &&
      interactions.some((item) => item.id === `eventRsvp:${event.id}`),
  );
  const recentActivity = [
    ...mine.map((post) => ({
      id: post.id,
      title: `Posted: ${post.title}`,
      date: post.createdAt,
      href: `/posts/${post.id}`,
    })),
    ...messages
      .filter((message) => message.senderId === user.id)
      .map((message) => ({
        id: message.id,
        title: `Sent a message: ${message.content}`,
        date: message.createdAt,
        href: "/messages",
      })),
  ]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 5);
  return (
    <div>
      <PageHeader
        eyebrow="YOUR SPACE"
        title={`Hi, ${user.name.split(" ")[0]} 👋`}
        subtitle="A quick look at everything you're building and exploring."
        action={
          <Link href={`/profile/${user.username}`}>
            <Button variant="secondary" size="sm">
              View profile <ArrowRight size={14} />
            </Button>
          </Link>
        }
      />
      <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            [mine.length, "Posts created", MessageCircle],
            [myTeams.length, "Teams led", Users],
            [bookmarks.length, "Saved items", Bookmark],
            [following.length, "Connections", Heart],
          ] as const
        ).map(([value, label, Icon]) => (
          <div key={String(label)} className="card p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf1fc] text-[#17468c]">
              <Icon size={17} />
            </span>
            <strong className="mt-3 block text-2xl">{String(value)}</strong>
            <span className="text-xs text-[#8c9bab]">{String(label)}</span>
          </div>
        ))}
      </div>
      <div className="grid min-w-0 gap-6 [&>section]:min-w-0">
        <section>
          <SectionHead title="My posts" href={`/profile/${user.username}`} />
          {mine.length ? (
            <div className="space-y-4">
              {mine.slice(0, 3).map((x) => (
                <PostCard key={x.id} post={x} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Plus />}
              title="Your first post starts here"
              description="Share what you're working on or ask the community a question."
              action={
                <Button onClick={() => setCreateOpen(true)}>
                  Create a post
                </Button>
              }
            />
          )}
        </section>
        <section>
          <SectionHead title="My teams" href="/teams" />
          {myTeams.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {myTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Users />}
              title="You have not started a team"
              description="Create a recruitment post to find collaborators."
              action={
                <Button onClick={() => setCreateOpen(true)}>
                  Create a team post
                </Button>
              }
            />
          )}
        </section>
        <section>
          <h2 className="section-title mb-4">Join requests</h2>
          {requested.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {requested.map((x) => (
                <TeamCard key={x.id} team={x} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Users />}
              title="No requests sent"
              description="Explore the Team Finder to discover projects you could join."
              action={
                <Link href="/teams">
                  <Button variant="secondary">Find a team</Button>
                </Link>
              }
            />
          )}
        </section>
        <section>
          <SectionHead title="Saved competitions" href="/saved" />
          {savedCompetitions.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {savedCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Trophy />}
              title="No saved competitions"
              description="Bookmark opportunities that you may want to enter later."
              action={
                <Link href="/competitions">
                  <Button variant="secondary">Explore competitions</Button>
                </Link>
              }
            />
          )}
        </section>
        <section>
          <SectionHead title="Upcoming events" href="/events" />
          {upcomingEvents.length ? (
            <div className="grid gap-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CalendarDays />}
              title="No upcoming events on your list"
              description="Mark an event as interesting to keep it here."
              action={
                <Link href="/events">
                  <Button variant="secondary">Explore events</Button>
                </Link>
              }
            />
          )}
        </section>
        <section>
          <h2 className="section-title mb-4">Recent activity</h2>
          {recentActivity.length ? (
            <div className="card divide-y divide-[#edf1f5]">
              {recentActivity.map((activity) => (
                <Link
                  key={activity.id}
                  href={activity.href}
                  className="block p-4 hover:bg-[#f8fafc]"
                >
                  <p className="truncate text-sm font-semibold">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs text-[#8b9aab]">
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Sparkles />}
              title="No activity yet"
              description="Your posts and conversations will appear here."
            />
          )}
        </section>
      </div>
    </div>
  );
}
