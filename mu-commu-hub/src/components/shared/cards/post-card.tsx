"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  Bookmark,
  CalendarDays,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Users,
} from "lucide-react";
import { Avatar, Tag } from "@/components/ui";
import { deadline, relative, shortDate } from "@/lib/utils";
import { withReturnTo } from "@/lib/navigation";
import { motionTiming } from "@/lib/motion/config";
import { useCardMotion } from "@/lib/motion/use-card-motion";
import { useApp } from "@/stores/app";
import { PostImageGrid } from "@/components/posts/post-image-grid";
import type { Post } from "@/types";

export function PostCard({
  post,
  entranceDelay = 0,
}: {
  post: Post;
  entranceDelay?: number;
}) {
  const cardMotion = useCardMotion({ delay: entranceDelay });
  const reducedMotion = useReducedMotion();
  const author = useApp(
    (state) =>
      state.users.find((person) => person.id === post.authorId) ?? state.user,
  );
  const liked = useApp((state) =>
    state.interactions.some((item) => item.id === "like:" + post.id),
  );
  const saved = useApp((state) =>
    state.bookmarks.some((item) => item.id === "posts:" + post.id),
  );
  const toggleLike = useApp((state) => state.toggleLike);
  const toggleBookmark = useApp((state) => state.toggleBookmark);
  const [liking, setLiking] = useState(false);
  const [saving, setSaving] = useState(false);
  const team = useApp((state) =>
    state.teams.find((item) => item.id === post.recruitmentId),
  );
  const like = async () => {
    setLiking(true);
    try {
      await toggleLike(post.id);
    } catch {
      toast.error("Could not save this like. Please try again.");
    } finally {
      setLiking(false);
    }
  };
  const bookmark = async () => {
    setSaving(true);
    try {
      await toggleBookmark("posts", post.id);
    } catch {
      toast.error("Could not save this bookmark. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(
        location.origin + "/posts/" + post.id,
      );
      toast.success("Post link copied");
    } catch {
      toast.error("Could not copy the link. Copy the page address instead.");
    }
  };
  return (
    <motion.article
      {...cardMotion}
      className="card min-w-0 overflow-hidden p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <Link
          href={withReturnTo("/profile/" + author.username)}
          aria-label={author.name + " profile"}
        >
          <Avatar user={author} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={withReturnTo("/profile/" + author.username)}
            className="text-sm font-semibold hover:text-[#17468c]"
          >
            {author.name}
          </Link>
          <p className="mt-1 text-xs leading-5 text-muted">
            {author.faculty} · Year {author.year}
            <span className="hidden sm:inline"> · {author.major}</span>
          </p>
          <p className="text-xs leading-5 text-muted">
            {relative(post.createdAt)}
          </p>
        </div>
        <span className="max-w-[35%] rounded-lg bg-[#f0f4f9] px-2 py-1 text-xs font-semibold leading-5 text-[#53647c]">
          {post.category === "Team" ? "Recruiting" : post.category}
        </span>
      </div>
      <Link
        href={withReturnTo("/posts/" + post.id)}
        className="group mt-4 block"
      >
        <h3 className="text-lg font-bold leading-snug tracking-tight group-hover:text-[#17468c]">
          {post.title || "Photos from campus"}
        </h3>
        {post.content && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#53647c]">
            {post.content}
          </p>
        )}
      </Link>
      {post.eventDate && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#17468c]">
          <span>
            <CalendarDays size={15} className="mr-1 inline" />
            {shortDate(post.eventDate)} · {post.eventTime}
          </span>
          <span>
            <MapPin size={15} className="mr-1 inline" />
            {post.eventLocation}
          </span>
        </div>
      )}
      {team && (
        <Link
          href={withReturnTo("/teams/" + team.id)}
          className="mt-4 block border-y border-[#e5ebf2] py-3"
        >
          <p className="text-sm font-semibold text-[#17468c]">
            <Users size={15} className="mr-1 inline" />
            Open roles:{" "}
            {team.roles
              .filter((role) => !role.filled)
              .map((role) => role.name)
              .join(", ") || "No open roles"}
          </p>
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs leading-5 text-muted">
            <span>
              {team.members}/{team.capacity} members · {team.mode} ·{" "}
              {team.location}
            </span>
            <span className="font-semibold text-[#8a6820]">
              {deadline(team.deadline)} →
            </span>
          </div>
        </Link>
      )}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <PostImageGrid post={post} />
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#e5ebf2] pt-3">
        <button
          onClick={() => void like()}
          disabled={liking}
          className={
            "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold hover:bg-[#f5f8fc] " +
            (liked ? "text-[#a94354]" : "text-[#68778c]")
          }
          aria-label={liked ? "Unlike post" : "Like post"}
          aria-pressed={liked}
        >
          <motion.span
            key={liked ? "liked" : "not-liked"}
            initial={reducedMotion ? false : { scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={motionTiming.quickSpring}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </motion.span>
          {post.likes + (liked ? 1 : 0)}
        </button>
        <Link
          href={withReturnTo("/posts/" + post.id)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted hover:bg-[#f5f8fc]"
          aria-label={
            post.comments + " comments on " + (post.title || "photo post")
          }
        >
          <MessageCircle size={18} />
          {post.comments}
        </Link>
        <button
          onClick={() => void bookmark()}
          disabled={saving}
          className="icon-button ml-auto"
          aria-label={saved ? "Remove bookmark" : "Save post"}
          aria-pressed={saved}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => void share()}
          className="icon-button"
          aria-label="Share post"
        >
          <Share2 size={18} />
        </button>
      </div>
    </motion.article>
  );
}
