"use client";
import Link from "next/link";
import { Check, Search } from "lucide-react";
import { Button, EmptyState, PageHeader, inputClass } from "@/components/ui";
import {
  ClubCard,
  CompetitionCard,
  EventCard,
  PersonCard,
  PostCard,
  TeamCard,
} from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { discoverResults, trendingSkills } from "@/lib/discovery";
import type { DiscoverFilters } from "@/lib/discovery";
import { useUrlState } from "@/lib/navigation";
import {
  AppliedFilters,
  FilterDisclosure,
  SearchInput,
  ResultGrid,
  SectionHead,
} from "./shared-controls";

const defaults = {
  query: "",
  scope: "People",
  faculty: "",
  major: "",
  year: "",
  skill: "",
  interest: "",
  category: "",
  availability: "",
  mode: "",
  limit: "12",
};
const scopes = [
  "All",
  "People",
  "Teams",
  "Posts",
  "Competitions",
  "Events",
  "Communities",
] as const;
type Scope = (typeof scopes)[number];
type Refinement = Exclude<keyof DiscoverFilters, "query">;
const allowed: Record<Scope, Refinement[]> = {
  All: [
    "faculty",
    "major",
    "year",
    "skill",
    "interest",
    "category",
    "availability",
    "mode",
  ],
  People: ["faculty", "major", "year", "skill", "interest", "availability"],
  Teams: ["faculty", "skill", "interest", "mode"],
  Posts: [
    "faculty",
    "major",
    "year",
    "skill",
    "interest",
    "category",
    "availability",
  ],
  Competitions: ["skill", "interest"],
  Events: [],
  Communities: ["interest"],
};
const primary: Record<Scope, Refinement[]> = {
  All: ["skill", "interest"],
  People: ["skill", "interest"],
  Teams: ["skill", "mode"],
  Posts: ["skill", "category"],
  Competitions: ["skill", "interest"],
  Events: [],
  Communities: ["interest"],
};

export function DiscoverView() {
  const { user, users, posts, teams, competitions, events, clubs } = useApp(
    useShallow((state) => ({
      user: state.user,
      users: state.users,
      posts: state.posts,
      teams: state.teams,
      competitions: state.competitions,
      events: state.events,
      clubs: state.clubs,
    })),
  );
  const [state, setState] = useUrlState(defaults);
  const scope: Scope = scopes.includes(state.scope as Scope)
    ? (state.scope as Scope)
    : "People";
  const filters: DiscoverFilters = {
    ...state,
    mode: ["Online", "On-site", "Hybrid"].includes(state.mode)
      ? (state.mode as DiscoverFilters["mode"])
      : "",
  };
  const results = discoverResults(
    { users, posts, teams, competitions, events, clubs },
    user,
    filters,
  );
  const counts: Record<Scope, number> = {
    All: 0,
    People: results.people.length,
    Teams: results.teams.length,
    Posts: results.posts.length,
    Competitions: results.competitions.length,
    Events: results.events.length,
    Communities: results.clubs.length,
  };
  counts.All = scopes.slice(1).reduce((sum, item) => sum + counts[item], 0);
  const options = (values: string[]) => [...new Set(values)].sort();
  const fields: {
    key: Refinement;
    label: string;
    empty: string;
    values: string[];
  }[] = [
    {
      key: "faculty",
      label: "Faculty",
      empty: "All faculties",
      values: options(users.map((person) => person.faculty)),
    },
    {
      key: "major",
      label: "Major",
      empty: "All majors",
      values: options(users.map((person) => person.major)),
    },
    {
      key: "year",
      label: "Year",
      empty: "All years",
      values: options(users.map((person) => String(person.year))),
    },
    {
      key: "skill",
      label: "Skill",
      empty: "All skills",
      values: options(users.flatMap((person) => person.skills)),
    },
    {
      key: "interest",
      label: "Interest",
      empty: "All interests",
      values: options(users.flatMap((person) => person.interests)),
    },
    {
      key: "category",
      label: "Post category",
      empty: "All post categories",
      values: options(posts.map((post) => post.category)),
    },
    {
      key: "availability",
      label: "Open to",
      empty: "Any availability",
      values: options(users.flatMap((person) => person.availability)),
    },
    {
      key: "mode",
      label: "Work mode",
      empty: "Any work mode",
      values: ["Online", "On-site", "Hybrid"],
    },
  ];
  const advancedFields = fields.filter(
    (field) =>
      allowed[scope].includes(field.key) && !primary[scope].includes(field.key),
  );
  const applied = fields
    .filter((field) => state[field.key])
    .map((field) => ({
      label: field.label + ": " + state[field.key],
      onRemove: () => setState({ [field.key]: "" }),
    }));
  const filtered = Object.entries(state).some(
    ([key, value]) => key !== "scope" && key !== "limit" && Boolean(value),
  );
  const reset = () => setState({ ...defaults, scope });
  const chooseScope = (next: Scope) =>
    setState((current) => {
      const update: Partial<typeof defaults> = { scope: next, limit: "12" };
      for (const field of fields)
        if (!allowed[next].includes(field.key)) update[field.key] = "";
      return { ...current, ...update };
    });
  const scopeHref = (next: Scope) => {
    const params = new URLSearchParams();
    Object.entries({ ...state, scope: next }).forEach(([key, value]) => {
      if (value && value !== defaults[key as keyof typeof defaults])
        params.set(key === "query" ? "q" : key, value);
    });
    return "/discover?" + params.toString();
  };
  const fieldControl = (field: (typeof fields)[number]) => (
    <label key={field.key} className="block text-sm font-medium">
      {field.label}
      <select
        value={state[field.key]}
        onChange={(event) => setState({ [field.key]: event.target.value })}
        className={inputClass + " mt-2"}
      >
        <option value="">{field.empty}</option>
        {field.values.map((value) => (
          <option key={value} value={value}>
            {field.key === "year" ? "Year " + value : value}
          </option>
        ))}
      </select>
    </label>
  );
  const head = (title: string, category: Scope) =>
    scope === "All" ? (
      <SectionHead title={title} href={scopeHref(category)} />
    ) : (
      <h2 className="section-heading mb-4">{title}</h2>
    );
  const show = (category: Scope) => scope === "All" || scope === category;
  const limit =
    scope === "All"
      ? 2
      : Math.max(12, Math.min(1000, Number(state.limit) || 12));
  const alternatives = scopes.filter(
    (item) => item !== "All" && item !== scope && counts[item] > 0,
  );
  return (
    <div>
      <PageHeader
        title="Discover"
        subtitle="A good collaboration starts with the right person. Find yours across campus."
      />
      <div className="directory-toolbar">
        <SearchInput
          value={state.query}
          onChange={(query) =>
            setState({ query, limit: "12" }, { replace: true })
          }
          placeholder="Search names, skills, teams, or topics..."
          label="Search campus"
        />
        <div
          className="discovery-scopes mt-4 flex max-w-full flex-wrap gap-2 pb-1"
          role="group"
          aria-label="Result type"
        >
          {(["People", "Teams", "All"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={scope === item}
              onClick={() => chooseScope(item)}
              className={
                "min-h-11 shrink-0 rounded-xl px-3 text-sm font-semibold " +
                (scope === item
                  ? "bg-[#17468c] text-white"
                  : "bg-white text-[#68778c] hover:bg-[#eaf1fc]")
              }
            >
              {item} <span className="ml-1 tabular-nums">{counts[item]}</span>
              {scope === item && (
                <Check size={14} className="ml-2 inline" aria-hidden="true" />
              )}
            </button>
          ))}
          <label className="ml-auto flex shrink-0 items-center">
            <span className="sr-only">More result types</span>
            <select
              value={["People", "Teams", "All"].includes(scope) ? "" : scope}
              onChange={(event) => {
                if (event.target.value)
                  chooseScope(event.target.value as Scope);
              }}
              className={inputClass + " w-auto border-0 bg-[#f5f7fb] px-3"}
            >
              <option value="">More…</option>
              {scopes
                .filter((item) => !["People", "Teams", "All"].includes(item))
                .map((item) => (
                  <option key={item} value={item}>
                    {item} ({counts[item]})
                  </option>
                ))}
            </select>
          </label>
        </div>
        {primary[scope].length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {primary[scope]
              .map((key) => fields.find((field) => field.key === key))
              .filter((field) => field !== undefined)
              .map(fieldControl)}
          </div>
        )}
        {advancedFields.length > 0 && (
          <FilterDisclosure
            count={
              advancedFields.filter((field) => Boolean(state[field.key])).length
            }
          >
            {advancedFields.map(fieldControl)}
          </FilterDisclosure>
        )}
        <AppliedFilters
          items={[
            ...(state.query
              ? [
                  {
                    label: "Search: " + state.query,
                    onRemove: () => setState({ query: "" }),
                  },
                ]
              : []),
            ...applied,
          ]}
          onReset={reset}
        />
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" role="status">
          {counts[scope]}{" "}
          {scope === "All"
            ? "results across campus"
            : scope.toLowerCase() + " found"}
          {scope === "All" && counts.All > 0 && " · previews below"}
        </p>
        <Link
          href="/teams"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-[#17468c]"
        >
          Open Team Finder →
        </Link>
      </div>
      {counts[scope] === 0 ? (
        <EmptyState
          icon={<Search />}
          title={
            "No " +
            (scope === "All" ? "results" : scope.toLowerCase()) +
            " match"
          }
          description={
            alternatives.length
              ? "Other result types have matches. Switch below, or clear your refinements."
              : "Try a broader topic or reset your search."
          }
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={reset}>
                Reset filters
              </Button>
              {alternatives.slice(0, 3).map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  onClick={() => chooseScope(item)}
                >
                  {item} ({counts[item]})
                </Button>
              ))}
            </div>
          }
        />
      ) : (
        <div className="space-y-8">
          {show("People") && counts.People > 0 && (
            <section>
              {head(filtered ? "People" : "People to connect with", "People")}
              <ResultGrid>
                {results.people.slice(0, limit).map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </ResultGrid>
            </section>
          )}
          {show("Teams") && counts.Teams > 0 && (
            <section>
              {head("Teams with open roles", "Teams")}
              <div className="space-y-4 directory-results">
                {results.teams.slice(0, limit).map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            </section>
          )}
          {show("Posts") && counts.Posts > 0 && (
            <section>
              {head("Conversations", "Posts")}
              <div className="space-y-4 directory-results">
                {results.posts.slice(0, limit).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}
          {show("Competitions") && counts.Competitions > 0 && (
            <section>
              {head("Competitions", "Competitions")}
              <ResultGrid>
                {results.competitions.slice(0, limit).map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                  />
                ))}
              </ResultGrid>
            </section>
          )}
          {show("Events") && counts.Events > 0 && (
            <section>
              {head("Sample events", "Events")}
              <div className="space-y-4 directory-results">
                {results.events.slice(0, limit).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
          {show("Communities") && counts.Communities > 0 && (
            <section>
              {head("Communities", "Communities")}
              <ResultGrid>
                {results.clubs.slice(0, limit).map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </ResultGrid>
            </section>
          )}
        </div>
      )}
      {scope !== "All" && counts[scope] > limit && (
        <div className="mt-6 text-center">
          <Button
            variant="secondary"
            onClick={() =>
              setState({ limit: String(limit + 12) }, { replace: true })
            }
          >
            Show more {scope.toLowerCase()}
          </Button>
        </div>
      )}
      {!filtered && scope === "All" && (
        <details className="mt-8 border-t border-[#e5ebf2] pt-4">
          <summary className="min-h-11 cursor-pointer text-sm font-semibold text-[#17468c]">
            Explore skills in the sample community
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {trendingSkills(users).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setState({ skill, scope: "People" })}
                className="min-h-11 rounded-xl bg-[#eaf1fc] px-3 text-sm font-semibold text-[#17468c]"
              >
                {skill}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
