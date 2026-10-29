"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bookmark, Clock3, MapPin, Users } from "lucide-react";
import { Avatar, Button, EmptyState, Tag } from "@/components/ui";
import { deadline, shortDate } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { BackLink } from "@/components/shared/back-link";
import { withReturnTo } from "@/lib/navigation";

export function TeamDetailView({ id }: { id: string }) {
  const {
    user,
    teams,
    users,
    competitions,
    interactions,
    requestTeam,
    bookmarks,
    toggleBookmark,
  } = useApp(
    useShallow((state) => ({
      user: state.user,
      teams: state.teams,
      users: state.users,
      competitions: state.competitions,
      interactions: state.interactions,
      requestTeam: state.requestTeam,
      bookmarks: state.bookmarks,
      toggleBookmark: state.toggleBookmark,
    })),
  );
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const team = teams.find((x) => x.id === id);
  if (!team)
    return (
      <EmptyState
        icon={<Users />}
        title="Team not found"
        description="This team is not available in the demo."
      />
    );
  const leader = users.find((x) => x.id === team.leaderId);
  const competition = competitions.find((x) => x.id === team.competitionId);
  const requested = interactions.some((x) => x.id === `teamRequest:${id}`);
  const saved = bookmarks.some((x) => x.id === `teams:${id}`);
  const ownTeam = team.leaderId === user.id;
  const closed = deadline(team.deadline) === "Closed";
  const full = team.members >= team.capacity;
  const listedMembers = (team.memberIds ?? [team.leaderId])
    .map((memberId) => users.find((person) => person.id === memberId))
    .filter((person) => person !== undefined);
  const handleRequest = async () => {
    if (pending || ownTeam || (!requested && (closed || full))) return;
    setPending(true);
    setActionError("");
    try {
      await requestTeam(id);
      toast.success(
        requested
          ? "Request withdrawn on this device"
          : "Join request saved on this device",
      );
    } catch {
      setActionError(
        requested
          ? "Could not withdraw your request. Try again."
          : "Could not save your request. Try again.",
      );
    } finally {
      setPending(false);
    }
  };
  return (
    <div>
      <BackLink fallback="/teams" />
      <div className="card overflow-hidden">
        <div className="relative bg-[#17468c] p-6 text-white sm:p-8">
          <div className="relative">
            <Tag tone="gold">{competition?.title ?? "Independent project"}</Tag>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              {team.title}
            </h1>
            <p className="mt-2 text-sm text-[#d9e6f7]">
              {ownTeam
                ? "Your team recruitment"
                : closed
                  ? "Applications closed"
                  : full
                    ? "Team full"
                    : "Looking for collaborators"}
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#d6e4f6]">
              <span>
                <Users size={14} className="mr-1 inline" />
                {team.members}/{team.capacity} members
              </span>
              <span>
                <MapPin size={14} className="mr-1 inline" />
                {team.mode} · {team.location}
              </span>
              <span>
                <Clock3 size={14} className="mr-1 inline" />
                {deadline(team.deadline)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <nav
            aria-label="Team sections"
            className="mb-6 flex flex-wrap gap-5 border-b border-[var(--line)] text-sm font-semibold text-[#17468c]"
          >
            <a
              href="#team-overview"
              className="inline-flex min-h-11 items-center"
            >
              Overview
            </a>
            <a
              href="#team-skills"
              className="inline-flex min-h-11 items-center"
            >
              Skills needed
            </a>
            <a
              href="#team-members"
              className="inline-flex min-h-11 items-center"
            >
              Members
            </a>
          </nav>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleRequest}
              disabled={pending || ownTeam || (!requested && (closed || full))}
              aria-pressed={requested}
            >
              {pending ? (
                requested ? (
                  "Withdrawing…"
                ) : (
                  "Saving request…"
                )
              ) : ownTeam ? (
                "Your team"
              ) : requested ? (
                "Withdraw request"
              ) : closed ? (
                "Applications closed"
              ) : full ? (
                "Team full"
              ) : (
                <>
                  <Users size={16} /> Request to join
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              aria-pressed={saved}
              onClick={async () => {
                try {
                  await toggleBookmark("teams", id);
                } catch {
                  toast.error("Could not update saved team. Try again.");
                }
              }}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save team"}
            </Button>
          </div>
          {!ownTeam && (
            <p className="mt-3 text-sm leading-6 text-[#53647c]" role="status">
              {requested
                ? "Your join request is saved on this device. You can withdraw it at any time. The team leader has not been contacted."
                : "Join requests are saved in this local demo. They do not contact the team leader."}
            </p>
          )}
          {actionError && (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {actionError}
            </p>
          )}
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_230px]">
            <div>
              <h2 id="team-overview" className="section-title scroll-mt-24">
                About the project
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#68778c]">
                {team.description}
              </p>
              {team.objectives && team.objectives.length > 0 && (
                <>
                  <h2 className="section-title mt-8">Objectives</h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#68778c]">
                    {team.objectives.map((objective) => (
                      <li key={objective}>{objective}</li>
                    ))}
                  </ul>
                </>
              )}
              <h2 className="section-title mt-8">Open positions</h2>
              <div className="mt-4 space-y-2">
                {team.roles.map((role) => (
                  <div
                    key={role.name}
                    className="flex items-center justify-between rounded-xl border border-[#e5ecf3] px-4 py-3 text-sm"
                  >
                    <span>{role.name}</span>
                    <Tag tone={role.filled ? "green" : "gold"}>
                      {role.filled ? "Filled" : "Open"}
                    </Tag>
                  </div>
                ))}
              </div>
              <h2 id="team-skills" className="section-title mt-8 scroll-mt-24">
                Skills needed
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {team.skills.map((x) => (
                  <Tag key={x} tone="blue">
                    {x}
                  </Tag>
                ))}
              </div>
              <h2 className="section-title mt-8">Timeline</h2>
              <div className="mt-4 space-y-3 border-l-2 border-[#dbe8f8] pl-5 text-sm">
                <p>
                  <b>{shortDate(team.deadline)}:</b> Team applications close
                </p>
                {competition && (
                  <p>
                    <b>{shortDate(competition.date)}:</b> {competition.title}
                  </p>
                )}
              </div>
            </div>
            <aside
              id="team-members"
              className="soft-card h-fit scroll-mt-24 p-5"
            >
              <h3 className="text-sm font-bold">Team at a glance</h3>
              <div
                className="mt-4 h-2 overflow-hidden rounded-full bg-[#dfe9f5]"
                role="progressbar"
                aria-label="Team members"
                aria-valuenow={team.members}
                aria-valuemin={0}
                aria-valuemax={team.capacity}
              >
                <div
                  className="h-full rounded-full bg-[#17468c]"
                  style={{ width: `${(team.members / team.capacity) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#68778c]">
                {team.members} of {team.capacity} places filled
              </p>
              <div className="my-4 border-t border-[#e3eaf2]" />
              <p className="text-xs font-semibold">Team leader</p>
              {leader && (
                <Link
                  href={withReturnTo(`/profile/${leader.username}`)}
                  className="mt-3 flex items-center gap-2 text-xs text-[#17468c]"
                >
                  <Avatar user={leader} size="sm" />
                  {leader.name}
                </Link>
              )}
              <p className="mt-5 text-xs font-semibold">Members</p>
              <div className="mt-3 space-y-2">
                {listedMembers.map((member) => (
                  <Link
                    key={member.id}
                    href={withReturnTo(`/profile/${member.username}`)}
                    className="flex items-center gap-2 text-xs text-[#17468c]"
                  >
                    <Avatar user={member} size="sm" /> {member.name}
                  </Link>
                ))}
                {team.members > listedMembers.length && (
                  <p className="text-xs text-[#68778c]">
                    {team.members - listedMembers.length} other members not
                    listed
                  </p>
                )}
              </div>
              {team.faculty && (
                <p className="mt-5 text-xs text-[#68778c]">
                  <b>Faculty requirement:</b> {team.faculty}
                </p>
              )}
              <p className="mt-5 text-xs font-semibold">Contact</p>
              <p className="mt-2 text-xs text-[#68778c]">
                {team.contactMethod ?? "Message the team leader"}
              </p>
              {leader && !ownTeam && (
                <Link
                  href={withReturnTo(`/messages?user=${leader.id}`)}
                  className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[#17468c]"
                >
                  Message leader
                </Link>
              )}
              <p className="mt-5 text-xs font-semibold">Application deadline</p>
              <p className="mt-2 text-xs text-[#68778c]">
                {shortDate(team.deadline)}
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
