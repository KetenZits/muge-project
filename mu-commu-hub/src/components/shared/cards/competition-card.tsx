"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useCardMotion } from "@/lib/motion/use-card-motion";
import { toast } from "sonner";
import { ArrowRight, Bookmark, CalendarDays, Share2 } from "lucide-react";
import { Tag } from "@/components/ui";
import { deadline, shortDate } from "@/lib/utils";
import { withReturnTo } from "@/lib/navigation";
import { useApp } from "@/stores/app";
import type { Competition } from "@/types";

export function CompetitionCard({ competition }: { competition: Competition }) {
  const cardMotion = useCardMotion();
  const toggleBookmark = useApp((state) => state.toggleBookmark);
  const saved = useApp((state) =>
    state.bookmarks.some(
      (item) => item.id === "competitions:" + competition.id,
    ),
  );
  const [saving, setSaving] = useState(false);
  const bookmark = async () => {
    setSaving(true);
    try {
      await toggleBookmark("competitions", competition.id);
    } catch {
      toast.error("Could not save this bookmark. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(
        location.origin + "/competitions/" + competition.id,
      );
      toast.success("Competition link copied");
    } catch {
      toast.error("Could not copy the link. Copy the page address instead.");
    }
  };
  return (
    <motion.article
      {...cardMotion}
      className="card flex min-w-0 flex-col p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Tag
            tone={
              competition.status === "Closing Soon"
                ? "rose"
                : competition.status === "Open"
                  ? "green"
                  : "neutral"
            }
          >
            {competition.status}
          </Tag>
          <span className="text-sm font-semibold text-[#8a6820]">
            {deadline(competition.deadline)}
          </span>
        </div>
        <button
          onClick={() => void bookmark()}
          disabled={saving}
          className="icon-button shrink-0"
          aria-label={
            (saved ? "Remove bookmark for " : "Save competition ") +
            competition.title
          }
          aria-pressed={saved}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug">
        <Link
          href={withReturnTo("/competitions/" + competition.id)}
          className="hover:text-[#17468c]"
        >
          {competition.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm font-medium text-[#53647c]">
        {competition.teamSize} · {competition.location}
      </p>
      <p className="mt-1 text-xs leading-5 text-muted">
        {competition.eligibility ?? "Current university students"}
      </p>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#53647c]">
        {competition.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {competition.categories.map((category) => (
          <Tag key={category} tone="gold">
            {category}
          </Tag>
        ))}
        {competition.skills.slice(0, 2).map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-[#e5ebf2] pt-3 text-xs leading-5 text-muted">
        <span>
          <CalendarDays size={14} className="mr-1 inline" />
          {shortDate(competition.date)}
        </span>
        <span className="font-semibold text-[#17468c]">
          {competition.prize}
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted">
        Sample opportunity · {competition.organizer}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <Link
          href={withReturnTo("/competitions/" + competition.id)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-xl border border-[#dce5ef] px-3 text-sm font-semibold text-[#17468c] hover:bg-[#f5f8fc]"
        >
          Explore competition <ArrowRight size={14} />
        </Link>
        <button
          className="icon-button shrink-0"
          onClick={() => void share()}
          aria-label={"Share " + competition.title}
        >
          <Share2 size={17} />
        </button>
      </div>
      <Link
        href={withReturnTo("/teams?competition=" + competition.id)}
        className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#17468c] px-3 text-sm font-semibold text-white hover:bg-[#0f3672]"
      >
        Find teammates <ArrowRight size={14} />
      </Link>
    </motion.article>
  );
}
