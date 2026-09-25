"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Bookmark, Users } from "lucide-react";
import { Button, Tag } from "@/components/ui";
import { deadline } from "@/lib/utils";
import { useApp } from "@/stores/app";
import type { TeamRecruitment } from "@/types";

export function TeamCard({ team }: { team: TeamRecruitment }) {
  const {
    user,
    users,
    competitions,
    interactions,
    requestTeam,
    bookmarks,
    toggleBookmark,
  } = useApp();
  const leader = users.find((x) => x.id === team.leaderId);
  const competition = competitions.find((c) => c.id === team.competitionId);
  const requested = interactions.some((i) => i.id === `teamRequest:${team.id}`);
  const saved = bookmarks.some((b) => b.id === `teams:${team.id}`);
  const ownTeam = team.leaderId === user.id;
  const closed = deadline(team.deadline) === "Closed";
  const full = team.members >= team.capacity;
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="card flex flex-col p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf1fc] text-[#17468c]">
          <Users size={22} />
        </div>
        <button
          onClick={() => toggleBookmark("teams", team.id)}
          className={
            saved ? "text-[#17468c]" : "text-[#98a7b7] hover:text-[#17468c]"
          }
          aria-label={saved ? "Remove team bookmark" : "Save team"}
          aria-pressed={saved}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mt-4">
        <Tag tone="gold">{competition?.title ?? "Independent project"}</Tag>
        <Link
          href={`/teams/${team.id}`}
          className="mt-3 block text-lg font-bold tracking-tight hover:text-[#17468c]"
        >
          {team.title}
        </Link>
        <p className="mt-1 text-xs text-[#8a9aab]">
          Led by {leader?.name} · {team.mode}
        </p>
        <p className="mt-1 text-xs text-[#8a9aab]">
          {team.location}
          {team.faculty ? ` · ${team.faculty} only` : ""}
        </p>
        <p className="line-clamp-2 mt-3 min-h-10 text-[13px] leading-5 text-[#66778c]">
          {team.description}
        </p>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-semibold">
          <span>
            {team.members}/{team.capacity} members
          </span>
          <span className="text-[#a5812d]">{deadline(team.deadline)}</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-[#eaf0f7]"
          role="progressbar"
          aria-label={`${team.title} members`}
          aria-valuenow={team.members}
          aria-valuemin={0}
          aria-valuemax={team.capacity}
        >
          <div
            className="h-full rounded-full bg-[#17468c]"
            style={{ width: `${(team.members / team.capacity) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {team.roles
            .filter((r) => !r.filled)
            .slice(0, 3)
            .map((r) => (
              <Tag key={r.name} tone="blue">
                {r.name}
              </Tag>
            ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {team.skills.slice(0, 3).map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </div>
      </div>
      <div className="mt-auto flex gap-2 pt-5">
        <Link href={`/teams/${team.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            View team <ArrowRight size={14} />
          </Button>
        </Link>
        <Button
          size="sm"
          disabled={requested || ownTeam || closed || full}
          onClick={() => requestTeam(team.id)}
        >
          {ownTeam
            ? "Your team"
            : requested
              ? "Request sent"
              : closed
                ? "Closed"
                : full
                  ? "Team full"
                  : "Request to join"}
        </Button>
      </div>
    </motion.article>
  );
}
