"use client";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";
import { Avatar, Button, EmptyState, Tag } from "@/components/ui";
import { deadline, shortDate } from "@/lib/utils";
import { useApp } from "@/stores/app";

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
  } = useApp();
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
  return (
    <div>
      <Link
        href="/teams"
        className="mb-5 inline-flex items-center gap-1 text-xs font-semibold text-[#71839a] hover:text-[#17468c]"
      >
        <ArrowLeft size={14} /> Back to teams
      </Link>
      <div className="card overflow-hidden">
        <div className="relative bg-[#17468c] p-6 text-white sm:p-8">
          <div className="absolute -right-8 -top-15 h-46 w-46 rounded-full border-[36px] border-white/8" />
          <div className="relative">
            <Tag tone="gold">{competition?.title ?? "Independent project"}</Tag>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              {team.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#d9e6f7]">
              {team.description}
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
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => requestTeam(id)}
              disabled={requested || ownTeam || closed || full}
            >
              {ownTeam ? (
                "Your team"
              ) : closed ? (
                "Applications closed"
              ) : full ? (
                "Team full"
              ) : requested ? (
                <>
                  <Check size={16} /> Request sent
                </>
              ) : (
                <>
                  <Users size={16} /> Request to join
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => toggleBookmark("teams", id)}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save team"}
            </Button>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_230px]">
            <div>
              <h2 className="section-title">About the project</h2>
              <p className="mt-3 text-sm leading-7 text-[#67798e]">
                {team.description}
              </p>
              {team.objectives && team.objectives.length > 0 && (
                <>
                  <h2 className="section-title mt-8">Objectives</h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#67798e]">
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
              <h2 className="section-title mt-8">Skills we value</h2>
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
            <aside className="soft-card h-fit p-5">
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
              <p className="mt-2 text-xs text-[#8797a9]">
                {team.members} of {team.capacity} places filled
              </p>
              <div className="my-4 border-t border-[#e3eaf2]" />
              <p className="text-xs font-semibold">Team leader</p>
              {leader && (
                <Link
                  href={`/profile/${leader.username}`}
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
                    href={`/profile/${member.username}`}
                    className="flex items-center gap-2 text-xs text-[#17468c]"
                  >
                    <Avatar user={member} size="sm" /> {member.name}
                  </Link>
                ))}
                {team.members > listedMembers.length && (
                  <p className="text-xs text-[#8797a9]">
                    {team.members - listedMembers.length} other members not
                    listed
                  </p>
                )}
              </div>
              {team.faculty && (
                <p className="mt-5 text-xs text-[#74859a]">
                  <b>Faculty requirement:</b> {team.faculty}
                </p>
              )}
              <p className="mt-5 text-xs font-semibold">Contact</p>
              <p className="mt-2 text-xs text-[#74859a]">
                {team.contactMethod ?? "Message the team leader"}
              </p>
              <p className="mt-5 text-xs font-semibold">Application deadline</p>
              <p className="mt-2 text-xs text-[#74859a]">
                {shortDate(team.deadline)}
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
