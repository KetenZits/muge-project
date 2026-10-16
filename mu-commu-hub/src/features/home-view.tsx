"use client";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Plus } from "lucide-react";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { PostCard } from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { useUrlState } from "@/lib/navigation";
import { Segmented, SearchInput } from "./shared-controls";

const defaults = { query: "", tab: "All posts", limit: "16" };
const tabs = ["All posts", "Following", "Latest", "Popular"];

export function HomeView() {
  const { user, posts, following, openComposer } = useApp(
    useShallow((state) => ({
      user: state.user,
      posts: state.posts,
      following: state.following,
      openComposer: state.openComposer,
    })),
  );
  const [filters, setFilters] = useUrlState(defaults);
  const tab = tabs.includes(filters.tab) ? filters.tab : "All posts";
  const limit = Math.max(16, Math.min(1000, Number(filters.limit) || 16));
  const visible = useMemo(() => {
    let list = [...posts];
    if (tab === "Following")
      list = list.filter((post) => following.includes(post.authorId));
    if (tab === "Popular") list.sort((a, b) => b.likes - a.likes);
    if (tab === "Latest")
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (filters.query.trim())
      list = list.filter((post) =>
        [post.title, post.content, ...post.tags]
          .join(" ")
          .toLowerCase()
          .includes(filters.query.trim().toLowerCase()),
      );
    return list;
  }, [posts, following, tab, filters.query]);
  return (
    <div>
      <PageHeader
        title="Campus conversations"
        subtitle={
          "Hi, " +
          user.name.split(" ")[0] +
          ". See what students are sharing and building."
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/teams"
              className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-[#17468c]"
            >
              Find a team <ArrowRight size={16} />
            </Link>
            <Button onClick={() => openComposer()} className="lg:hidden">
              <Plus size={16} /> Create post
            </Button>
          </div>
        }
      />
      <div className="mb-6 space-y-3">
        <Segmented
          options={tabs}
          value={tab}
          setValue={(value) => setFilters({ tab: value, limit: "16" })}
          label="Feed order"
        />
        <SearchInput
          value={filters.query}
          onChange={(query) =>
            setFilters({ query, limit: "16" }, { replace: true })
          }
          placeholder="Search posts or topics..."
          label="Search campus posts"
        />
        <p className="text-sm text-muted" role="status">
          {visible.length}{" "}
          {visible.length === 1 ? "conversation" : "conversations"}
          {filters.query && " matching “" + filters.query + "”"}
        </p>
      </div>
      <div className="space-y-4">
        {visible.length ? (
          visible
            .slice(0, limit)
            .map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <EmptyState
            icon={<MessageCircle />}
            title={
              filters.query
                ? "No posts match your search"
                : "Nothing in this feed yet"
            }
            description={
              tab === "Following"
                ? "Follow students to keep their posts together here."
                : "Try another topic or return to all campus conversations."
            }
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setFilters(defaults)}
                >
                  Reset feed
                </Button>
                <Link
                  href="/people"
                  className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-[#17468c]"
                >
                  Find people
                </Link>
              </div>
            }
          />
        )}
      </div>
      {visible.length > limit && (
        <div className="mt-6 text-center">
          <Button
            variant="secondary"
            onClick={() =>
              setFilters({ limit: String(limit + 16) }, { replace: true })
            }
          >
            Load more posts
          </Button>
        </div>
      )}
    </div>
  );
}
