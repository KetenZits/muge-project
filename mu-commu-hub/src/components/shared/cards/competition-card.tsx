"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowRight, Bookmark, CalendarDays, Share2 } from "lucide-react";
import { Button, Tag } from "@/components/ui";
import { deadline, shortDate } from "@/lib/utils";
import { useApp } from "@/stores/app";
import type { Competition } from "@/types";

export function CompetitionCard({ competition }: { competition: Competition }) {
  const { bookmarks, toggleBookmark } = useApp();
  const saved = bookmarks.some(
    (b) => b.id === `competitions:${competition.id}`,
  );
  return (
    <motion.article whileHover={{ y: -2 }} className="card overflow-hidden">
      <div
        className={`relative flex h-28 items-end p-4 ${competition.featured ? "bg-[#17468c]" : "bg-[#e7eef8]"}`}
      >
        <div className="absolute -right-6 -top-12 h-32 w-32 rounded-full border-[25px] border-white/10" />
        <div className="absolute right-14 top-3 h-20 w-20 rotate-12 rounded-2xl border-[14px] border-[#fac33433]" />
        <span
          className={`relative text-3xl font-black ${competition.featured ? "text-[#fac334]" : "text-[#17468c]"}`}
        >
          {competition.title
            .split(" ")
            .slice(0, 2)
            .map((x) => x[0])
            .join("")}
        </span>
        <button
          onClick={() => toggleBookmark("competitions", competition.id)}
          className={`absolute right-4 top-4 rounded-lg p-1.5 ${competition.featured ? "bg-white/15 text-white" : "bg-white/70 text-[#17468c]"}`}
          aria-label={
            saved ? "Remove competition bookmark" : "Save competition"
          }
          aria-pressed={saved}
        >
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
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
          <span className="text-xs font-semibold text-[#a5812d]">
            {deadline(competition.deadline)}
          </span>
        </div>
        <Link
          href={`/competitions/${competition.id}`}
          className="mt-3 block text-[17px] font-bold hover:text-[#17468c]"
        >
          {competition.title}
        </Link>
        <p className="mt-1 text-xs text-[#8b9aab]">{competition.organizer}</p>
        <p className="line-clamp-2 mt-3 min-h-10 text-xs leading-5 text-[#68788c]">
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
        <p className="mt-3 text-xs text-[#78899c]">
          {competition.location} · {competition.teamSize}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-[#eaf0f5] pt-4 text-xs text-[#78899c]">
          <span>
            <CalendarDays size={14} className="mr-1 inline" />
            {shortDate(competition.date)}
          </span>
          <span className="font-semibold text-[#17468c]">
            {competition.prize}
          </span>
        </div>
        <Link href={`/competitions/${competition.id}`} className="mt-4 block">
          <Button variant="secondary" size="sm" className="w-full">
            Explore competition <ArrowRight size={14} />
          </Button>
        </Link>
        <div className="mt-2 flex gap-2">
          <Link
            href={`/teams?competition=${competition.id}`}
            className="flex-1"
          >
            <Button variant="ghost" size="sm" className="w-full">
              Find team
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Share ${competition.title}`}
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${location.origin}/competitions/${competition.id}`,
              );
              toast.success("Competition link copied");
            }}
          >
            <Share2 size={16} />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
