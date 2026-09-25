"use client";
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
import { motionTiming } from "@/lib/motion/config";
import { useCardMotion } from "@/lib/motion/use-card-motion";
import { useApp } from "@/stores/app";
import type { Post } from "@/types";

export function PostCard({
  post,
  entranceDelay = 0,
}: {
  post: Post;
  entranceDelay?: number;
}) {
  const cardMotion = useCardMotion({ reveal: true, delay: entranceDelay });
  const reducedMotion = useReducedMotion();
  const { users, user, bookmarks, interactions, toggleLike, toggleBookmark } =
    useApp();
  const author = users.find((x) => x.id === post.authorId) ?? user;
  const liked = interactions.some((x) => x.id === `like:${post.id}`);
  const saved = bookmarks.some((x) => x.id === `posts:${post.id}`);
  const team = useApp((s) => s.teams.find((t) => t.id === post.recruitmentId));
  const share = async () => {
    await navigator.clipboard.writeText(`${location.origin}/posts/${post.id}`);
    toast.success("Post link copied");
  };
  return (
    <motion.article {...cardMotion} className="card overflow-hidden p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Link href={`/profile/${author.username}`}>
          <Avatar user={author} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/profile/${author.username}`}
              className="text-sm font-bold hover:text-[#17468c]"
            >
              {author.name}
            </Link>
            <span className="text-[11px] text-[#9aabba]">
              · {relative(post.createdAt)}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[#8c9aaa]">
            {author.faculty} · {author.major} · Year {author.year}
          </p>
        </div>
        <Tag
          tone={
            post.category === "Competition"
              ? "gold"
              : post.category === "Team"
                ? "blue"
                : "neutral"
          }
        >
          {post.category === "Team" ? "Looking for team" : post.category}
        </Tag>
      </div>
      <Link href={`/posts/${post.id}`} className="group mt-5 block">
        <h3 className="text-[17px] font-bold leading-snug tracking-tight group-hover:text-[#17468c]">
          {post.title}
        </h3>
        <p className="line-clamp-3 mt-2 text-[13px] leading-6 text-[#66778c]">
          {post.content}
        </p>
      </Link>
      {post.eventDate && (
        <div className="mt-4 flex flex-wrap gap-4 rounded-xl bg-[#f8fafd] px-4 py-3 text-xs text-[#17468c]">
          <span>
            <CalendarDays size={14} className="mr-1 inline" />
            {shortDate(post.eventDate)} · {post.eventTime}
          </span>
          <span>
            <MapPin size={14} className="mr-1 inline" />
            {post.eventLocation}
          </span>
        </div>
      )}
      {team && (
        <Link
          href={`/teams/${team.id}`}
          className="mt-4 block rounded-xl border border-[#e7edf4] bg-[#f8fafd] px-4 py-3"
        >
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#17468c]">
              <Users size={14} className="mr-1 inline" /> {team.members}/
              {team.capacity} members ·{" "}
              {team.roles.filter((role) => !role.filled).length} open roles
            </span>
            <span className="text-xs text-[#a5812d]">
              {deadline(team.deadline)} →
            </span>
          </span>
          <span className="mt-2 block text-xs text-[#687a90]">
            Looking for:{" "}
            {team.roles
              .filter((role) => !role.filled)
              .map((role) => role.name)
              .join(", ") || "No open roles"}
          </span>
          <span className="mt-1 block text-xs text-[#8b9aac]">
            {team.mode} · {team.location}
          </span>
        </Link>
      )}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-1 border-t border-[#edf1f5] pt-4">
        <button
          onClick={() => toggleLike(post.id)}
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition active:scale-95 ${liked ? "text-[#d95e6d]" : "text-[#8392a3] hover:bg-[#f7f9fc] hover:text-[#17468c]"}`}
          aria-label={liked ? "Unlike post" : "Like post"}
          aria-pressed={liked}
        >
          <motion.span
            key={liked ? "liked" : "not-liked"}
            initial={reducedMotion ? false : { scale: 0.72 }}
            animate={{ scale: 1 }}
            transition={motionTiming.quickSpring}
          >
            <Heart size={17} fill={liked ? "currentColor" : "none"} />
          </motion.span>
          {post.likes + (liked ? 1 : 0)}
        </button>
        <Link
          href={`/posts/${post.id}`}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#8392a3] hover:bg-[#f7f9fc] hover:text-[#17468c]"
        >
          <MessageCircle size={17} />
          {post.comments}
        </Link>
        <button
          onClick={() => toggleBookmark("posts", post.id)}
          className={`ml-auto rounded-lg p-2 transition active:scale-90 ${saved ? "text-[#17468c]" : "text-[#8392a3] hover:text-[#17468c]"}`}
          aria-label={saved ? "Remove bookmark" : "Save post"}
          aria-pressed={saved}
        >
          <motion.span
            key={saved ? "saved" : "not-saved"}
            initial={reducedMotion ? false : { scale: 0.72 }}
            animate={{ scale: 1 }}
            transition={motionTiming.quickSpring}
          >
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
          </motion.span>
        </button>
        <button
          onClick={share}
          className="rounded-lg p-2 text-[#8392a3] hover:text-[#17468c]"
          aria-label="Share post"
        >
          <Share2 size={17} />
        </button>
      </div>
    </motion.article>
  );
}
