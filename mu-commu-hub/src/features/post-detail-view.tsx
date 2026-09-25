"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Heart,
  MapPin,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";
import {
  Avatar,
  Button,
  EmptyState,
  ErrorState,
  Tag,
  inputClass,
} from "@/components/ui";
import { postService } from "@/lib/api/client";
import { relative, shortDate } from "@/lib/utils";
import { useApp } from "@/stores/app";
import type { Comment } from "@/types";

export function PostDetailView({ id }: { id: string }) {
  const {
    posts,
    users,
    user,
    interactions,
    toggleLike,
    bookmarks,
    toggleBookmark,
    addComment,
  } = useApp();
  const post = posts.find((x) => x.id === id);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [commentError, setCommentError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    let active = true;
    postService
      .getComments(id)
      .then((items) => {
        if (active) {
          setComments(items);
          setCommentError(false);
        }
      })
      .catch(() => {
        if (active) setCommentError(true);
      });
    return () => {
      active = false;
    };
  }, [id, retryCount]);
  if (!post)
    return (
      <EmptyState
        icon={<MessageCircle />}
        title="Post not found"
        description="This post is not available in the demo."
      />
    );
  const author = users.find((x) => x.id === post.authorId) ?? user;
  const liked = interactions.some((x) => x.id === `like:${id}`);
  const saved = bookmarks.some((x) => x.id === `posts:${id}`);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 2) return;
    const comment: Comment = {
      id: `comment-${crypto.randomUUID()}`,
      postId: id,
      userId: user.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    try {
      await addComment(comment);
      setComments((items) => [...items, comment]);
      setContent("");
      toast.success("Comment added");
    } catch {
      toast.error("Could not add your comment. Try again.");
    }
  };
  return (
    <div>
      <Link
        href="/home"
        className="mb-5 inline-flex items-center gap-1 text-xs font-semibold text-[#71839a] hover:text-[#17468c]"
      >
        <ArrowLeft size={14} /> Back to feed
      </Link>
      <article className="card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Avatar user={author} />
          <div>
            <Link
              href={`/profile/${author.username}`}
              className="text-sm font-bold hover:text-[#17468c]"
            >
              {author.name}
            </Link>
            <p className="mt-0.5 text-xs text-[#8d9bab]">
              {author.major} · {relative(post.createdAt)}
            </p>
          </div>
          <div className="ml-auto">
            <Tag tone="blue">{post.category}</Tag>
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#5f7186]">
          {post.content}
        </p>
        {post.eventDate && (
          <div className="mt-5 flex flex-wrap gap-4 rounded-xl bg-[#f8fafd] p-4 text-sm text-[#17468c]">
            <span>
              <CalendarDays size={16} className="mr-1 inline" />
              {shortDate(post.eventDate)} · {post.eventTime}
            </span>
            <span>
              <MapPin size={16} className="mr-1 inline" />
              {post.eventLocation}
            </span>
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((x) => (
            <Tag key={x}>{x}</Tag>
          ))}
        </div>
        <div className="mt-6 flex gap-2 border-t border-[#e8eef4] pt-5">
          <Button
            variant={liked ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleLike(id)}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {post.likes + (liked ? 1 : 0)} likes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBookmark("posts", id)}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(location.href);
              toast.success("Link copied");
            }}
          >
            <Share2 size={16} /> Share
          </Button>
        </div>
      </article>
      <div className="card mt-5 p-6">
        <h2 className="section-title">
          Conversation{" "}
          <span className="text-sm text-[#9ca9b7]">({comments.length})</span>
        </h2>
        <form onSubmit={submit} className="mt-5 flex gap-2">
          <input
            className={inputClass}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a thoughtful comment..."
            aria-label="Comment"
          />
          <Button type="submit" disabled={!content.trim()}>
            <Send size={16} />
          </Button>
        </form>
        {commentError ? (
          <div className="mt-6">
            <ErrorState
              title="Could not load comments"
              description="Please try again to see the conversation."
              onRetry={() => setRetryCount((count) => count + 1)}
            />
          </div>
        ) : comments.length ? (
          <div className="mt-6 space-y-4">
            {comments.map((c) => {
              const person = users.find((x) => x.id === c.userId) ?? user;
              return (
                <div
                  key={c.id}
                  className="flex gap-3 border-t border-[#edf1f5] pt-4"
                >
                  <Avatar user={person} size="sm" />
                  <div>
                    <strong className="text-xs">{person.name}</strong>
                    <p className="mt-1 text-sm text-[#66778b]">{c.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 text-center text-xs text-[#9aa8b8]">
            Be the first to comment in this demo conversation.
          </p>
        )}
      </div>
    </div>
  );
}
