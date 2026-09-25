"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Users } from "lucide-react";
import { Button, EmptyState, PageHeader, inputClass } from "@/components/ui";
import { TeamCard } from "@/components/shared/cards";
import { useApp } from "@/stores/app";
import { filterTeams } from "@/lib/discovery";
import type { TeamFilters } from "@/lib/discovery";
import { SearchInput } from "./shared-controls";

export function TeamsView() {
  const { teams, users, competitions, user } = useApp();
  const [filters, setFilters] = useState<TeamFilters>({
    query: "",
    competitionId: "",
    role: "",
    skill: "",
    faculty: "",
    deadline: "Any deadline",
    mode: "",
    sort: "Recommended",
  });
  useEffect(() => {
    const competitionId = new URLSearchParams(location.search).get(
      "competition",
    );
    if (
      competitionId &&
      competitions.some((item) => item.id === competitionId)
    ) {
      queueMicrotask(() =>
        setFilters((current) => ({ ...current, competitionId })),
      );
    }
  }, [competitions]);
  const update = <K extends keyof TeamFilters>(key: K, value: TeamFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const options = (values: string[]) => [...new Set(values)].sort();
  const list = filterTeams(teams, users, competitions, user, filters);
  return (
    <div>
      <PageHeader
        eyebrow="TEAM FINDER"
        title="Build better, together."
        subtitle="Find the right team or the missing person for your next big idea."
        action={
          <Link href="/competitions">
            <Button variant="secondary" size="sm">
              <Trophy size={15} /> Browse competitions
            </Button>
          </Link>
        }
      />
      <div className="mb-5 rounded-[20px] bg-[#f9f2df] p-5 sm:flex sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#96752c]">
            Ready to collaborate?
          </span>
          <p className="mt-1 text-lg font-bold">
            Your next team is one conversation away.
          </p>
        </div>
        <span className="mt-3 inline-flex text-3xl sm:mt-0">✦</span>
      </div>
      <div className="card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-4">
          <SearchInput
            value={filters.query}
            onChange={(value) => update("query", value)}
            placeholder="Search project, role, or skill"
          />
        </div>
        <select
          value={filters.competitionId}
          onChange={(e) => update("competitionId", e.target.value)}
          className={inputClass}
          aria-label="Filter by competition"
        >
          <option value="">All competitions</option>
          {competitions.map((competition) => (
            <option key={competition.id} value={competition.id}>
              {competition.title}
            </option>
          ))}
        </select>
        <select
          value={filters.role}
          onChange={(e) => update("role", e.target.value)}
          className={inputClass}
          aria-label="Filter by open role"
        >
          <option value="">All open roles</option>
          {options(
            teams.flatMap((team) =>
              team.roles
                .filter((role) => !role.filled)
                .map((role) => role.name),
            ),
          ).map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={filters.skill}
          onChange={(e) => update("skill", e.target.value)}
          className={inputClass}
          aria-label="Filter by skill"
        >
          <option value="">All skills</option>
          {options(teams.flatMap((team) => team.skills)).map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={filters.faculty}
          onChange={(e) => update("faculty", e.target.value)}
          className={inputClass}
          aria-label="Filter by faculty"
        >
          <option value="">All faculties</option>
          {options(users.map((person) => person.faculty)).map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          value={filters.mode}
          onChange={(e) =>
            update("mode", e.target.value as TeamFilters["mode"])
          }
          className={inputClass}
          aria-label="Filter by work mode"
        >
          <option value="">All work modes</option>
          <option>Online</option>
          <option>On-site</option>
          <option>Hybrid</option>
        </select>
        <select
          value={filters.deadline}
          onChange={(e) =>
            update("deadline", e.target.value as TeamFilters["deadline"])
          }
          className={inputClass}
          aria-label="Filter by deadline"
        >
          <option>Any deadline</option>
          <option>7 days</option>
          <option>30 days</option>
        </select>
        <select
          value={filters.sort}
          onChange={(e) =>
            update("sort", e.target.value as TeamFilters["sort"])
          }
          className={inputClass}
          aria-label="Sort teams"
        >
          <option>Recommended</option>
          <option>Newest</option>
          <option>Deadline soon</option>
          <option>Most active</option>
        </select>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title">Open opportunities</h2>
        <span className="text-xs text-[#8c9bab]">
          {list.length} teams recruiting
        </span>
      </div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((x) => (
            <TeamCard key={x.id} team={x} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Users />}
          title="No teams found"
          description="Try a different role, skill, or work mode."
        />
      )}
    </div>
  );
}
