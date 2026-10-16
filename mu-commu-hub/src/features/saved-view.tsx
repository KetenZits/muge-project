"use client";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import {
  CompetitionCard,
  EventCard,
  PostCard,
  TeamCard,
} from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { useUrlState } from "@/lib/navigation";

const categories = [
  ["posts", "Posts"],
  ["teams", "Teams"],
  ["competitions", "Competitions"],
  ["events", "Events"],
] as const;
export function SavedView() {
  const { bookmarks, posts, teams, competitions, events } = useApp(
    useShallow((state) => ({
      bookmarks: state.bookmarks,
      posts: state.posts,
      teams: state.teams,
      competitions: state.competitions,
      events: state.events,
    })),
  );
  const [state, setState] = useUrlState({ tab: "" });
  const saved = (kind: string, id: string) =>
    bookmarks.some(
      (bookmark) => bookmark.kind === kind && bookmark.itemId === id,
    );
  const collections = {
    posts: posts.filter((item) => saved("posts", item.id)),
    teams: teams.filter((item) => saved("teams", item.id)),
    competitions: competitions.filter((item) => saved("competitions", item.id)),
    events: events.filter((item) => saved("events", item.id)),
  };
  const tab =
    categories.find(([value]) => value === state.tab.toLowerCase())?.[0] ??
    categories.find(([value]) => collections[value].length > 0)?.[0] ??
    "posts";
  return (
    <div>
      <PageHeader
        title="Saved for later"
        subtitle="Return to the conversations and opportunities you bookmarked in this browser."
      />
      <div
        className="mb-5 flex max-w-full gap-1 overflow-x-auto border-b border-[#e5ebf2]"
        aria-label="Saved categories"
      >
        {categories.map(([value, label]) => (
          <button
            key={value}
            aria-pressed={tab === value}
            aria-controls="saved-results"
            onClick={() => setState({ tab: value })}
            className={`min-h-11 shrink-0 rounded-t-lg px-4 py-2 text-sm font-semibold ${tab === value ? "bg-[#17468c] text-white" : "text-[#53647c] hover:bg-[#eaf1fc]"}`}
          >
            {label} ({collections[value].length})
          </button>
        ))}
      </div>
      <section id="saved-results" aria-label={`Saved ${tab}`}>
        {!collections[tab].length ? (
          <EmptyState
            icon={<Bookmark />}
            title={`No saved ${tab} yet`}
            description="Use Save on an item you want to return to. Your other saved categories are shown above."
            action={
              <Button asChild variant="secondary">
                <Link href={tab === "posts" ? "/home" : `/${tab}`}>
                  Explore {tab}
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            {tab === "posts" &&
              collections.posts.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            {tab === "teams" &&
              collections.teams.map((item) => (
                <TeamCard key={item.id} team={item} />
              ))}
            {tab === "competitions" &&
              collections.competitions.map((item) => (
                <CompetitionCard key={item.id} competition={item} />
              ))}
            {tab === "events" &&
              collections.events.map((item) => (
                <EventCard key={item.id} event={item} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
