"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useCardMotion } from "@/lib/motion/use-card-motion";
import { Bookmark, Clock3, MapPin } from "lucide-react";
import { Button, Tag } from "@/components/ui";
import { useApp } from "@/stores/app";
import type { Event } from "@/types";
import { withReturnTo } from "@/lib/navigation";

export function EventCard({ event }: { event: Event }) {
  const cardMotion = useCardMotion();
  const rsvp = useApp((state) => state.rsvp);
  const toggleBookmark = useApp((state) => state.toggleBookmark);
  const going = useApp((state) =>
    state.interactions.some((item) => item.id === `eventRsvp:${event.id}`),
  );
  const saved = useApp((state) =>
    state.bookmarks.some((item) => item.id === `events:${event.id}`),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const toggleRsvp = async () => {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await rsvp(event.id);
      toast.success(
        going ? "RSVP canceled on this device" : "Going saved on this device",
      );
    } catch {
      setError("Could not update your RSVP. Try again.");
    } finally {
      setPending(false);
    }
  };
  return (
    <motion.article
      {...cardMotion}
      id={`event-${event.id}`}
      className="card flex scroll-mt-24 gap-3 p-4 sm:gap-4 sm:p-5"
    >
      <div className="flex h-17 w-17 shrink-0 flex-col items-center justify-center rounded-2xl bg-[var(--tint-events)] text-[var(--accent-events)]">
        <strong className="text-xl leading-none">
          {new Date(event.date).getDate()}
        </strong>
        <span className="mt-1 text-xs font-bold uppercase">
          {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <Tag tone="gold">{event.category}</Tag>
          <button
            onClick={async () => {
              try {
                await toggleBookmark("events", event.id);
              } catch {
                toast.error("Could not update saved event. Try again.");
              }
            }}
            className={`-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${saved ? "text-[#17468c]" : "text-[#68778c]"}`}
            aria-label={saved ? "Unsave event" : "Save event"}
            aria-pressed={saved}
          >
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <h3 className="mt-2 font-bold">
          {event.postId ? (
            <Link
              href={withReturnTo(`/posts/${event.postId}`)}
              className="hover:text-[#17468c]"
            >
              {event.title}
            </Link>
          ) : (
            event.title
          )}
        </h3>
        <p className="mt-1 text-sm text-[#53647c]">{event.host}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#68778c]">
          <span>
            <Clock3 size={13} className="mr-1 inline" />
            {event.time}
          </span>
          <span>
            <MapPin size={13} className="mr-1 inline" />
            {event.location}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-[#53647c]">
            {event.attendees + (going ? 1 : 0)} demo attendees
          </span>
          <Button
            size="sm"
            variant={going ? "secondary" : "primary"}
            disabled={pending}
            onClick={toggleRsvp}
            aria-pressed={going}
          >
            {pending ? "Saving…" : going ? "Cancel RSVP" : "I'm going"}
          </Button>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#68778c]" role="status">
          {going
            ? "Going in your local demo. Cancel anytime."
            : "RSVPs are saved on this device; no organizer is contacted."}
        </p>
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </motion.article>
  );
}
