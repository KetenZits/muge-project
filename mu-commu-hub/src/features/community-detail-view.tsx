"use client";
import { useState } from "react";
import { MessageCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { Button, EmptyState, Tag } from "@/components/ui";
import { PersonCard, PostCard } from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { BackLink } from "@/components/shared/back-link";
import { useUrlState } from "@/lib/navigation";
import { Segmented } from "./shared-controls";

export function CommunityDetailView({ slug }: { slug: string }) {
  const { clubs, joinedClubs, toggleClub, posts, users } = useApp(
    useShallow((state) => ({
      clubs: state.clubs,
      joinedClubs: state.joinedClubs,
      toggleClub: state.toggleClub,
      posts: state.posts,
      users: state.users,
    })),
  );
  const [state, setState] = useUrlState({ tab: "Posts" });
  const tab = ["Posts", "Members", "About"].includes(state.tab)
    ? state.tab
    : "Posts";
  const [pending, setPending] = useState(false);
  const [joinError, setJoinError] = useState("");
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
      <BackLink fallback="/communities" />
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-3 p-6">
          <div>
            <h1 className="section-heading text-2xl font-bold">{club.name}</h1>
            <p className="mt-2 max-w-lg text-sm text-[#68778c]">
              {club.description}
            </p>
            <p className="mt-3 text-xs text-[#68778c]">
              {club.members.toLocaleString()} sample members · {related.length}{" "}
              related conversations shown
            </p>
          </div>
          <Button
            variant={joined ? "secondary" : "primary"}
            aria-pressed={joined}
            disabled={pending}
            onClick={async () => {
              if (pending) return;
              setPending(true);
              setJoinError("");
              try {
                await toggleClub(club.id);
                toast.success(
                  joined
                    ? "Community left in your local demo"
                    : "Community joined in your local demo",
                );
              } catch {
                setJoinError("Could not update your membership. Try again.");
              } finally {
                setPending(false);
              }
            }}
          >
            {pending
              ? "Saving…"
              : joined
                ? "Leave community"
                : "Join community"}
          </Button>
        </div>
        <p className="px-6 pb-5 text-sm text-[#53647c]">
          Membership is saved on this device. Joining does not notify other
          people.
        </p>
        {joinError && (
          <p role="alert" className="px-6 pb-5 text-sm text-red-700">
            {joinError}
          </p>
        )}
      </div>
      <div className="my-6">
        <Segmented
          options={["Posts", "Members", "About"]}
          value={tab}
          setValue={(value) => setState({ tab: value })}
          label="Community section"
        />
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
        <div>
          <h2 className="section-title">Sample students</h2>
          <p className="mb-5 mt-2 text-sm leading-6 text-[#53647c]">
            These example profiles illustrate the demo. This is not a verified
            membership list for {club.name}.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {users.slice(1, 7).map((x) => (
              <PersonCard key={x.id} person={x} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="section-title">About {club.name}</h2>
          <p className="mt-3 text-sm leading-7 text-[#68778c]">
            Share what you are learning, ask questions, and find friendly
            collaborators from across campus.
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
