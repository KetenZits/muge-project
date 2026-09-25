"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Users } from "lucide-react";
import { Button, EmptyState, Tag } from "@/components/ui";
import { PersonCard, PostCard } from "@/components/shared/cards";
import { useApp } from "@/stores/app";

export function CommunityDetailView({ slug }: { slug: string }) {
  const { clubs, joinedClubs, toggleClub, posts, users } = useApp();
  const [tab, setTab] = useState("Posts");
  const club = clubs.find((x) => x.slug === slug);
  if (!club)
    return (
      <EmptyState
        icon={<Users />}
        title="Community not found"
        description="This community is not available in the demo."
      />
    );
  const joined = joinedClubs.includes(club.id);
  const related = posts
    .filter((x) => x.tags.some((tag) => club.tags.includes(tag)))
    .slice(0, 5);
  return (
    <div>
      <Link
        href="/communities"
        className="mb-5 inline-flex items-center gap-1 text-xs font-semibold text-[#71839a] hover:text-[#17468c]"
      >
        <ArrowLeft size={14} /> Back to communities
      </Link>
      <div className="card overflow-hidden">
        <div
          className="relative flex h-36 items-center px-8"
          style={{ background: club.color }}
        >
          <span className="text-7xl text-[#17468c]">{club.icon}</span>
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[45px] border-white/25" />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3 p-6">
          <div>
            <h1 className="text-2xl font-bold">{club.name}</h1>
            <p className="mt-2 max-w-lg text-sm text-[#718196]">
              {club.description}
            </p>
            <p className="mt-3 text-xs text-[#8d9bad]">
              {club.members.toLocaleString()} members · {club.activePosts}{" "}
              active posts
            </p>
          </div>
          <Button
            variant={joined ? "secondary" : "primary"}
            onClick={() => toggleClub(club.id)}
          >
            {joined ? "Joined ✓" : "Join community"}
          </Button>
        </div>
      </div>
      <div className="my-6 flex gap-1 rounded-xl border border-[#e5ecf3] bg-white p-1">
        {["Posts", "Members", "About"].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold ${tab === x ? "bg-[#17468c] text-white" : "text-[#7b8c9e]"}`}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "Posts" ? (
        related.length ? (
          <div className="space-y-4">
            {related.map((x) => (
              <PostCard key={x.id} post={x} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MessageCircle />}
            title="No conversations yet"
            description="Community discussions will appear here."
          />
        )
      ) : tab === "Members" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {users.slice(1, 7).map((x) => (
            <PersonCard key={x.id} person={x} />
          ))}
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="section-title">About {club.name}</h2>
          <p className="mt-3 text-sm leading-7 text-[#718196]">
            {club.description} Share what you are learning, ask questions, and
            find friendly collaborators from across campus.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {club.tags.map((x) => (
              <Tag key={x} tone="gold">
                {x}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
