"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowRight, Bookmark, LoaderCircle } from "lucide-react";
import { Button, Tag } from "@/components/ui";
import { useCardMotion } from "@/lib/motion/use-card-motion";
import { deadline } from "@/lib/utils";
import { withReturnTo } from "@/lib/navigation";
import { useApp } from "@/stores/app";
import type { TeamRecruitment } from "@/types";

export function TeamCard({ team }: { team: TeamRecruitment }) {
  const cardMotion = useCardMotion();
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState(false);
  const leader = useApp((state) =>
    state.users.find((person) => person.id === team.leaderId),
  );
  const competition = useApp((state) =>
    state.competitions.find((item) => item.id === team.competitionId),
  );
  const requested = useApp((state) =>
    state.interactions.some((item) => item.id === "teamRequest:" + team.id),
  );
  const saved = useApp((state) =>
    state.bookmarks.some((item) => item.id === "teams:" + team.id),
  );
  const ownTeam = useApp((state) => team.leaderId === state.user.id);
  const requestTeam = useApp((state) => state.requestTeam);
  const toggleBookmark = useApp((state) => state.toggleBookmark);
  const closed = deadline(team.deadline) === "Closed";
  const full = team.members >= team.capacity;
  const roles = team.roles.filter((role) => !role.filled);
  const sendRequest = async () => {
    setPending(true);
    try {
      await requestTeam(team.id);
    } catch {
      toast.error("Could not save your request. Please try again.");
    } finally {
      setPending(false);
    }
  };
  const bookmark = async () => {
    setSaving(true);
    try {
      await toggleBookmark("teams", team.id);
    } catch {
      toast.error("Could not save this bookmark. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const requestLabel = pending
    ? "Saving..."
    : ownTeam
      ? "Your team"
      : requested
        ? "Withdraw request"
        : closed
          ? "Applications closed"
          : full
            ? "Team full"
            : "Request to join";
  return (
    <motion.article
      {...cardMotion}
      className="card flex min-w-0 flex-col p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold leading-5 text-[var(--section-accent)]">
            {competition?.title ?? "Independent project"}
          </p>
          <h3 className="mt-1 text-lg font-bold tracking-tight">
            <Link
              href={withReturnTo("/teams/" + team.id)}
              className="hover:text-[#17468c]"
            >
              {team.title}
            </Link>
          </h3>
        </div>
        <button
          onClick={() => void bookmark()}
          disabled={saving}
          className="icon-button shrink-0"
          aria-label={
            (saved ? "Remove bookmark for " : "Save team ") + team.title
          }
          aria-pressed={saved}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {roles.length ? (
          roles.slice(0, 3).map((role) => (
            <Tag key={role.name} tone="blue">
              {role.name}
            </Tag>
          ))
        ) : (
          <Tag>No open roles</Tag>
        )}
        {roles.length > 3 && (
          <span className="text-xs text-muted">
            +{roles.length - 3} more roles
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span className="font-semibold text-[#8a6820]">
          {deadline(team.deadline)}
        </span>
        <span className="text-muted">
          {team.members}/{team.capacity} places filled
        </span>
        <span className="text-muted">
          {team.mode} · {team.location}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#53647c]">
        {team.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {team.skills.slice(0, 3).map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">
        Led by {leader?.name ?? "a sample student"}
        {team.faculty
          ? " · " + team.faculty + " only"
          : " · All faculties welcome"}
      </p>
      <div className="mt-auto flex flex-wrap justify-between gap-2 pt-5">
        <Link
          href={withReturnTo("/teams/" + team.id)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dce5ef] bg-white px-4 text-sm font-semibold text-[#17468c] hover:bg-[#f5f8fc]"
        >
          View team <ArrowRight size={14} />
        </Link>
        <Button
          className="min-h-11"
          variant={requested ? "secondary" : "primary"}
          disabled={pending || ownTeam || (!requested && (closed || full))}
          onClick={() => void sendRequest()}
        >
          {pending && <LoaderCircle size={14} className="animate-spin" />}
          {requestLabel}
        </Button>
      </div>
      {requested && (
        <p role="status" className="mt-3 text-xs leading-5 text-muted">
          Join request saved on this device. No one has been contacted.
        </p>
      )}
    </motion.article>
  );
}
