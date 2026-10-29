"use client";
import { Users } from "lucide-react";
import { Button, EmptyState, PageHeader, inputClass } from "@/components/ui";
import { PersonCard } from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { filterPeople } from "@/lib/discovery";
import type { PeopleFilters } from "@/lib/discovery";
import { useUrlState } from "@/lib/navigation";
import {
  AppliedFilters,
  FilterDisclosure,
  ResultGrid,
  SearchInput,
} from "./shared-controls";

const defaultFilters = {
  limit: "12",
  query: "",
  faculty: "",
  major: "",
  year: "",
  skill: "",
  interest: "",
  availability: "",
  sort: "Best match",
};
export function PeopleView() {
  const { users, user } = useApp(
    useShallow((state) => ({ users: state.users, user: state.user })),
  );
  const [urlFilters, setFilters] = useUrlState(defaultFilters);
  const filters: PeopleFilters = {
    ...urlFilters,
    sort: urlFilters.sort === "Name" ? "Name" : "Best match",
  };
  const applied = Object.entries(filters).filter(
    ([key, value]) => key !== "sort" && key !== "limit" && value,
  ).length;
  const update = <K extends keyof PeopleFilters>(
    key: K,
    value: PeopleFilters[K],
  ) =>
    setFilters((current) => ({ ...current, [key]: value }), {
      replace: key === "query",
    });
  const options = (values: string[]) => [...new Set(values)].sort();
  const list = filterPeople(users, user, filters);
  const limit = Math.max(12, Math.min(1000, Number(urlFilters.limit) || 12));
  return (
    <div>
      <PageHeader
        title="Find your people"
        subtitle="Meet students who share your interests and complement your skills."
      />
      <div className="directory-toolbar">
        <div className="sm:col-span-2 lg:col-span-4">
          <p className="mb-2 text-sm font-semibold">Search students</p>
          <SearchInput
            value={filters.query}
            onChange={(value) => update("query", value)}
            placeholder="Name, skill, or interest"
          />
        </div>
        <FilterDisclosure count={applied}>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              value={filters.major}
              onChange={(e) => update("major", e.target.value)}
              className={inputClass}
              aria-label="Filter by major"
            >
              <option value="">All majors</option>
              {options(users.map((person) => person.major)).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <select
              value={filters.year}
              onChange={(e) => update("year", e.target.value)}
              className={inputClass}
              aria-label="Filter by year"
            >
              <option value="">All years</option>
              {options(users.map((person) => String(person.year))).map(
                (value) => (
                  <option key={value} value={value}>
                    Year {value}
                  </option>
                ),
              )}
            </select>
            <select
              value={filters.skill}
              onChange={(e) => update("skill", e.target.value)}
              className={inputClass}
              aria-label="Filter by skill"
            >
              <option value="">All skills</option>
              {options(users.flatMap((person) => person.skills)).map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
            <select
              value={filters.interest}
              onChange={(e) => update("interest", e.target.value)}
              className={inputClass}
              aria-label="Filter by interest"
            >
              <option value="">All interests</option>
              {options(users.flatMap((person) => person.interests)).map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
            <select
              value={filters.availability}
              onChange={(e) => update("availability", e.target.value)}
              className={inputClass}
              aria-label="Filter by availability"
            >
              <option value="">Any availability</option>
              {options(users.flatMap((person) => person.availability)).map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
            <select
              value={filters.sort}
              onChange={(e) =>
                update("sort", e.target.value as PeopleFilters["sort"])
              }
              className={inputClass}
              aria-label="Sort students"
            >
              <option>Best match</option>
              <option>Name</option>
            </select>
          </div>
        </FilterDisclosure>
      </div>
      <AppliedFilters
        items={Object.entries(filters)
          .filter(([key, value]) => key !== "sort" && key !== "limit" && value)
          .map(([key, value]) => ({
            label: `${key}: ${value}`,
            onRemove: () => setFilters({ [key]: "" }),
          }))}
        onReset={() => setFilters(defaultFilters)}
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#53647c]" role="status">
          {list.length} students
          {applied ? " match your filters" : " to discover"}
        </p>
        {applied > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters(defaultFilters)}
          >
            Clear filters
          </Button>
        )}
      </div>
      {filters.sort === "Best match" && (
        <p className="mb-5 text-sm text-[#68778c]">
          Sorted by shared interests, skills, faculty, and availability in your
          local demo profile.
        </p>
      )}
      {list.length ? (
        <ResultGrid>
          {list.slice(0, limit).map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </ResultGrid>
      ) : (
        <EmptyState
          icon={<Users />}
          title="No students found"
          description="Try a different faculty, skill, or interest."
          action={
            <Button
              variant="secondary"
              onClick={() => setFilters(defaultFilters)}
            >
              Clear filters
            </Button>
          }
        />
      )}
      {list.length > limit && (
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() =>
            setFilters({ limit: String(limit + 12) }, { replace: true })
          }
        >
          Show more people
        </Button>
      )}
    </div>
  );
}
