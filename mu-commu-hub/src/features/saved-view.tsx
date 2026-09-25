"use client";
import { useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import {
  CompetitionCard,
  EventCard,
  PostCard,
  TeamCard,
} from "@/components/shared/cards";
import { useApp } from "@/stores/app";
import { Segmented } from "./shared-controls";

export function SavedView() {
  const { bookmarks, posts, teams, competitions, events } = useApp();
  const [tab, setTab] = useState("Posts");
  const ids = bookmarks
    .filter((b) => b.kind === tab.toLowerCase())
    .map((b) => b.itemId);
  return (
    <div>
      <PageHeader
        eyebrow="YOUR COLLECTION"
        title="Saved for later"
        subtitle="Every opportunity and conversation you want to return to."
      />
      <div className="mb-5">
        <Segmented
          options={["Posts", "Teams", "Competitions", "Events"]}
          value={tab}
          setValue={setTab}
        />
      </div>
      {ids.length === 0 ? (
        <EmptyState
          icon={<Bookmark />}
          title={`No saved ${tab.toLowerCase()} yet`}
          description="Use the bookmark icon on anything interesting. You'll find it here whenever you need it."
          action={
            <Link href={tab === "Posts" ? "/home" : `/${tab.toLowerCase()}`}>
              <Button variant="secondary">Explore {tab.toLowerCase()}</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tab === "Posts" &&
            posts
              .filter((x) => ids.includes(x.id))
              .map((x) => <PostCard key={x.id} post={x} />)}
          {tab === "Teams" &&
            teams
              .filter((x) => ids.includes(x.id))
              .map((x) => <TeamCard key={x.id} team={x} />)}
          {tab === "Competitions" &&
            competitions
              .filter((x) => ids.includes(x.id))
              .map((x) => <CompetitionCard key={x.id} competition={x} />)}
          {tab === "Events" &&
            events
              .filter((x) => ids.includes(x.id))
              .map((x) => <EventCard key={x.id} event={x} />)}
        </div>
      )}
    </div>
  );
}
