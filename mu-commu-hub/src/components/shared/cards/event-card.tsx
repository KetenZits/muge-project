"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Bookmark, Clock3, MapPin } from "lucide-react";
import { Button, Tag } from "@/components/ui";
import { useApp } from "@/stores/app";
import type { Event } from "@/types";

export function EventCard({ event }: { event: Event }) {
  const { interactions, rsvp, bookmarks, toggleBookmark } = useApp();
  const going = interactions.some((i) => i.id === `eventRsvp:${event.id}`);
  const saved = bookmarks.some((b) => b.id === `events:${event.id}`);
  return (
    <motion.article whileHover={{ y: -2 }} className="card flex gap-4 p-5">
      <div className="flex h-17 w-17 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#eaf1fc] text-[#17468c]">
        <strong className="text-xl leading-none">
          {new Date(event.date).getDate()}
        </strong>
        <span className="mt-1 text-[10px] font-bold uppercase">
          {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <Tag tone="gold">{event.category}</Tag>
          <button
            onClick={() => toggleBookmark("events", event.id)}
            className={saved ? "text-[#17468c]" : "text-[#9aa8b8]"}
            aria-label="Save event"
          >
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <h3 className="mt-2 font-bold">
          {event.postId ? (
            <Link
              href={`/posts/${event.postId}`}
              className="hover:text-[#17468c]"
            >
              {event.title}
            </Link>
          ) : (
            event.title
          )}
        </h3>
        <p className="mt-1 text-xs text-[#8a99a9]">{event.host}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#687a90]">
          <span>
            <Clock3 size={13} className="mr-1 inline" />
            {event.time}
          </span>
          <span>
            <MapPin size={13} className="mr-1 inline" />
            {event.location}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-[#9aa8b8]">
            {event.attendees + (going ? 1 : 0)} attending
          </span>
          <Button
            size="sm"
            variant={going ? "secondary" : "primary"}
            disabled={going}
            onClick={() => rsvp(event.id)}
          >
            {going ? "Going ✓" : "I'm interested"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
