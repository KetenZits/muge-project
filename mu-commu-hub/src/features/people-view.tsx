"use client";
import { Users } from "lucide-react";
import { Button, EmptyState, PageHeader, inputClass } from "@/components/ui";
import { PersonCard } from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { filterPeople } from "@/lib/discovery";
import type { PeopleFilters } from "@/lib/discovery";
import { useUrlState } from "@/lib/navigation";
import { SearchInput } from "./shared-controls";

const defaultFilters = {
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
    ([key, value]) => key !== "sort" && value,
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
  return (
    <div>
      <PageHeader
        title="Find your people"
        subtitle="Meet students who share your interests and complement your skills."
      />
      <div className="card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-4">
          <p className="mb-2 text-sm font-semibold">Search students</p>
          <SearchInput
            value={filters.query}
            onChange={(value) => update("query", value)}
            placeholder="Name, skill, or interest"
          />
        </div>
        <details className="sm:col-span-2 lg:col-span-4">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-[#17468c]">
            Refine by skills, interests, or study details
            {applied > 0 ? ` (${applied} applied)` : ""}
          </summary>
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
        </details>
      </div>
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
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
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
    </div>
  );
}
