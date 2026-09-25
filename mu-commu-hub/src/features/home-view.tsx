"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Plus } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { PostCard } from "@/components/shared/cards";
import { useApp } from "@/stores/app";
import { Segmented, SearchInput } from "./shared-controls";

export function HomeView() {
  const { user, posts, following, setCreateOpen } = useApp();
  const [tab, setTab] = useState("For You");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    let list = [...posts];
    if (tab === "Following")
      list = list.filter((x) => following.includes(x.authorId));
    if (tab === "Popular") list.sort((a, b) => b.likes - a.likes);
    if (tab === "Latest")
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (query)
      list = list.filter((x) =>
        `${x.title} ${x.content} ${x.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
    return list.slice(0, 16);
  }, [posts, following, tab, query]);
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[24px] bg-[#17468c] p-6 text-white sm:p-8">
        <div className="absolute -right-8 -top-22 h-64 w-64 rounded-full border-[45px] border-white/6" />
        <div className="absolute right-20 top-5 h-25 w-25 rotate-12 rounded-3xl border-[20px] border-[#fac33422]" />
        <div className="relative">
          <p className="mb-2 text-xs font-semibold text-[#f9d982]">
            GOOD TO SEE YOU, {user.name.split(" ")[0].toUpperCase()} 👋
          </p>
          <h1 className="max-w-lg text-[27px] font-bold leading-tight tracking-[-.04em] sm:text-[32px]">
            Your next idea starts with the right people.
          </h1>
          <p className="mt-3 max-w-lg text-[13px] leading-6 text-[#dbe8fa]">
            Discover conversations, find teammates, and make something worth
            sharing.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              variant="gold"
              size="sm"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={15} /> Create a post
            </Button>
            <Link href="/teams">
              <Button
                size="sm"
                className="border border-white/30 bg-white/10 hover:bg-white/20"
              >
                Find a team <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="card flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf1fc] text-[#17468c]">
          <Plus size={18} />
        </span>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex-1 text-left text-sm text-[#a0adbc]"
        >
          What&apos;s happening on campus, {user.name.split(" ")[0]}?
        </button>
        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="hidden sm:inline-flex"
        >
          Post
        </Button>
      </div>
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">Community feed</h2>
            <p className="text-xs text-[#8a9aac]">
              Stories and opportunities from students like you
            </p>
          </div>
          <Link
            href="/discover"
            className="text-xs font-semibold text-[#17468c]"
          >
            Explore more →
          </Link>
        </div>
        <div className="mb-4">
          <Segmented
            options={["For You", "Following", "Latest", "Popular"]}
            value={tab}
            setValue={setTab}
          />
        </div>
        <div className="mb-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search posts or topics..."
          />
        </div>
        <div className="space-y-4">
          {visible.length ? (
            visible.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState
              icon={<MessageCircle />}
              title="Nothing in this feed yet"
              description={
                tab === "Following"
                  ? "Follow a few students to see their posts here."
                  : "Try a different search to discover more conversations."
              }
              action={
                <Link href="/people">
                  <Button variant="secondary">Find people</Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
