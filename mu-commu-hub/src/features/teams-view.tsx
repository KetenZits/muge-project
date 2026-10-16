"use client";
import Link from "next/link";
import { Plus, Trophy, Users } from "lucide-react";
import { Button, EmptyState, PageHeader, inputClass } from "@/components/ui";
import { TeamCard } from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { filterTeams } from "@/lib/discovery";
import type { TeamFilters } from "@/lib/discovery";
import { useUrlState } from "@/lib/navigation";
import {
  AppliedFilters,
  FilterDisclosure,
  SearchInput,
} from "./shared-controls";

const defaults = {
  query: "",
  competition: "",
  role: "",
  skill: "",
  faculty: "",
  deadline: "Any deadline",
  mode: "",
  sort: "Recommended",
};
const workModes = ["Online", "On-site", "Hybrid"];
const deadlines = ["Any deadline", "7 days", "30 days"];
const sortOrders = ["Recommended", "Newest", "Deadline soon", "Most active"];

export function TeamsView() {
  const { teams, users, competitions, user, openComposer } = useApp(
    useShallow((state) => ({
      teams: state.teams,
      users: state.users,
      competitions: state.competitions,
      user: state.user,
      openComposer: state.openComposer,
    })),
  );
  const [state, setState] = useUrlState(defaults);
  const filters: TeamFilters = {
    ...state,
    competitionId: state.competition,
    mode: workModes.includes(state.mode)
      ? (state.mode as TeamFilters["mode"])
      : "",
    deadline: deadlines.includes(state.deadline)
      ? (state.deadline as TeamFilters["deadline"])
      : "Any deadline",
    sort: sortOrders.includes(state.sort)
      ? (state.sort as TeamFilters["sort"])
      : "Recommended",
  };
  const options = (values: string[]) => [...new Set(values)].sort();
  const list = filterTeams(teams, users, competitions, user, filters);
  const filterKeys = [
    "query",
    "competition",
    "role",
    "skill",
    "faculty",
    "deadline",
    "mode",
  ] as const;
  const labels = {
    query: "Search",
    competition: "Competition",
    role: "Role",
    skill: "Skill",
    faculty: "Faculty",
    deadline: "Deadline",
    mode: "Work mode",
  };
  const applied = filterKeys
    .filter((key) => state[key] !== defaults[key])
    .map((key) => ({
      label:
        labels[key] +
        ": " +
        (key === "competition"
          ? (competitions.find((competition) => competition.id === state[key])
              ?.title ?? state[key])
          : state[key]),
      onRemove: () => setState({ [key]: defaults[key] }),
    }));
  const advancedCount = [
    "skill",
    "mode",
    "competition",
    "faculty",
    "deadline",
  ].filter(
    (key) =>
      state[key as keyof typeof state] !==
      defaults[key as keyof typeof defaults],
  ).length;
  return (
    <div>
      <PageHeader
        title="Team Finder"
        subtitle="Find an open role that fits your skills, or bring the missing person into your project."
        action={
          <Button onClick={() => openComposer("Team")}>
            <Plus size={16} /> Recruit teammates
          </Button>
        }
      />
      <div className="mb-6">
        <SearchInput
          value={state.query}
          onChange={(query) => setState({ query }, { replace: true })}
          placeholder="Search projects, roles, or skills..."
          label="Search teams"
        />
        <div className="mt-4 max-w-sm">
          <label className="block text-sm font-medium">
            Open role
            <select
              value={state.role}
              onChange={(event) => setState({ role: event.target.value })}
              className={inputClass + " mt-2"}
            >
              <option value="">All roles</option>
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
          </label>
        </div>
        <FilterDisclosure count={advancedCount}>
          <label className="block text-sm font-medium">
            Skill
            <select
              value={state.skill}
              onChange={(event) => setState({ skill: event.target.value })}
              className={inputClass + " mt-2"}
            >
              <option value="">All skills</option>
              {options(teams.flatMap((team) => team.skills)).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Work mode
            <select
              value={filters.mode}
              onChange={(event) => setState({ mode: event.target.value })}
              className={inputClass + " mt-2"}
            >
              <option value="">Any work mode</option>
              {workModes.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Competition
            <select
              value={state.competition}
              onChange={(event) =>
                setState({ competition: event.target.value })
              }
              className={inputClass + " mt-2"}
            >
              <option value="">All competitions</option>
              {competitions.map((competition) => (
                <option key={competition.id} value={competition.id}>
                  {competition.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Faculty
            <select
              value={state.faculty}
              onChange={(event) => setState({ faculty: event.target.value })}
              className={inputClass + " mt-2"}
            >
              <option value="">All faculties</option>
              {options(users.map((person) => person.faculty)).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Application deadline
            <select
              value={filters.deadline}
              onChange={(event) => setState({ deadline: event.target.value })}
              className={inputClass + " mt-2"}
            >
              {deadlines.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </FilterDisclosure>
        <AppliedFilters items={applied} onReset={() => setState(defaults)} />
      </div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="section-heading">Open roles</h2>
          <p className="mt-1 text-sm text-muted" role="status">
            {list.length} teams found
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          Sort
          <select
            value={filters.sort}
            onChange={(event) => setState({ sort: event.target.value })}
            className={inputClass + " w-auto"}
          >
            {sortOrders.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-5 text-xs leading-5 text-muted">
        Demo requests are saved in this browser. No team or student is
        contacted.
      </p>
      {list.length ? (
        <div className="space-y-4">
          {list.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Users />}
          title="No teams match these filters"
          description="Try another role or clear refinements to see more projects."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={() => setState(defaults)}>
                Reset filters
              </Button>
              <Button onClick={() => openComposer("Team")}>
                Recruit teammates
              </Button>
            </div>
          }
        />
      )}
      <Link
        href="/competitions"
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#17468c]"
      >
        <Trophy size={16} /> Explore competitions to build a team around
      </Link>
    </div>
  );
}
