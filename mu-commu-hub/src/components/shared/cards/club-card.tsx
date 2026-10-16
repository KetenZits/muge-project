"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useCardMotion } from "@/lib/motion/use-card-motion";
import { Button, Tag } from "@/components/ui";
import { withReturnTo } from "@/lib/navigation";
import { useApp } from "@/stores/app";
import type { Club } from "@/types";

export function ClubCard({ club }: { club: Club }) {
  const cardMotion = useCardMotion();
  const toggleClub = useApp((state) => state.toggleClub);
  const joined = useApp((state) => state.joinedClubs.includes(club.id));
  const related = useApp((state) =>
    state.posts.find((post) =>
      post.tags.some((tag) => club.tags.includes(tag)),
    ),
  );
  const [pending, setPending] = useState(false);
  const join = async () => {
    setPending(true);
    try {
      await toggleClub(club.id);
    } catch {
      toast.error("Could not save your community choice. Please try again.");
    } finally {
      setPending(false);
    }
  };
  return (
    <motion.article
      {...cardMotion}
      className="card flex min-w-0 flex-col p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--section-tint)] text-[var(--section-accent)]">
          <MessageCircle size={20} />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold">
            <Link
              href={withReturnTo("/communities/" + club.slug)}
              className="hover:text-[#17468c]"
            >
              {club.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs leading-5 text-muted">Sample community</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#53647c]">
        {club.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {club.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <div className="mt-4 border-t border-[#e5ebf2] pt-4">
        <p className="text-xs font-semibold text-[var(--section-accent)]">
          Related conversation
        </p>
        {related ? (
          <Link
            href={withReturnTo("/posts/" + related.id)}
            className="mt-2 block text-sm font-semibold leading-6 text-[#17468c] hover:underline"
          >
            {related.title ||
              related.content.slice(0, 100) ||
              "Photo conversation"}
          </Link>
        ) : (
          <p className="mt-2 text-sm leading-6 text-muted">
            No related conversations in the sample data yet.
          </p>
        )}
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <span className="text-xs text-muted">
          {club.members.toLocaleString()} sample members
        </span>
        <Button
          className="min-h-11"
          variant={joined ? "secondary" : "primary"}
          disabled={pending}
          onClick={() => void join()}
          aria-pressed={joined}
        >
          {pending
            ? "Saving..."
            : joined
              ? "Leave community"
              : "Join community"}
        </Button>
      </div>
      {joined && (
        <p role="status" className="mt-3 text-xs leading-5 text-muted">
          Joined in this browser&apos;s demo only.
        </p>
      )}
    </motion.article>
  );
}
