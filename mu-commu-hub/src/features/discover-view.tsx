"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Trophy, Users } from "lucide-react";
import { EmptyState, PageHeader, inputClass } from "@/components/ui";
import {
  ClubCard,
  CompetitionCard,
  EventCard,
  PersonCard,
  PostCard,
  TeamCard,
} from "@/components/shared/cards";
import { useApp } from "@/stores/app";
import { discoverResults, trendingSkills } from "@/lib/discovery";
import type { DiscoverFilters } from "@/lib/discovery";
import { SearchInput, SectionHead } from "./shared-controls";

export function DiscoverView() {
  const { user, users, posts, teams, competitions, events, clubs } = useApp();
  const [filters, setFilters] = useState<DiscoverFilters>({
    query: "",
    faculty: "",
    major: "",
    year: "",
    skill: "",
    interest: "",
    category: "",
    availability: "",
    mode: "",
  });
  const [filter, setFilter] = useState("All");
  const update = <K extends keyof DiscoverFilters>(
    key: K,
    value: DiscoverFilters[K],
  ) => setFilters((current) => ({ ...current, [key]: value }));
  const options = (values: string[]) => [...new Set(values)].sort();
  const {
    people,
    posts: foundPosts,
    teams: foundTeams,
    competitions: foundCompetitions,
    events: foundEvents,
    clubs: foundClubs,
  } = discoverResults(
    { users, posts, teams, competitions, events, clubs },
    user,
    filters,
  );
  const filtered = Object.values(filters).some(Boolean);
  const show = (name: string) => filter === "All" || filter === name;
  return (
    <div>
      <PageHeader
        eyebrow="EXPLORE CAMPUS"
        title="Discover your community"
        subtitle="People, ideas, and opportunities worth finding."
      />
      <div className="card mb-5 p-4 sm:p-5">
        <SearchInput
          value={filters.query}
          onChange={(value) => update("query", value)}
          placeholder="Search people, skills, teams, competitions..."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "All",
            "People",
            "Posts",
            "Teams",
            "Competitions",
            "Events",
            "Communities",
          ].map((x) => (
            <button
              key={x}
              onClick={() => setFilter(x)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === x ? "bg-[#17468c] text-white" : "bg-[#f0f4f9] text-[#718399] hover:bg-[#e7eef7]"}`}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={filters.faculty}
            onChange={(event) => update("faculty", event.target.value)}
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
            onChange={(event) => update("major", event.target.value)}
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
            onChange={(event) => update("year", event.target.value)}
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
            onChange={(event) => update("skill", event.target.value)}
            className={inputClass}
            aria-label="Filter by skill"
          >
            <option value="">All skills</option>
            {options(users.flatMap((person) => person.skills)).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            value={filters.interest}
            onChange={(event) => update("interest", event.target.value)}
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
            value={filters.category}
            onChange={(event) => update("category", event.target.value)}
            className={inputClass}
            aria-label="Filter by post category"
          >
            <option value="">All post categories</option>
            {options(posts.map((post) => post.category)).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            value={filters.availability}
            onChange={(event) => update("availability", event.target.value)}
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
            value={filters.mode}
            onChange={(event) =>
              update("mode", event.target.value as DiscoverFilters["mode"])
            }
            className={inputClass}
            aria-label="Filter by work mode"
          >
            <option value="">All work modes</option>
            <option>Online</option>
            <option>On-site</option>
            <option>Hybrid</option>
          </select>
        </div>
      </div>
      {!filtered && (
        <div className="mb-7 grid gap-4 sm:grid-cols-3">
          <Link
            href="/people"
            className="soft-card p-5 transition hover:border-[#b9cce3]"
          >
            <Users className="mb-3 text-[#17468c]" size={23} />
            <strong className="block text-sm">Find your people</strong>
            <p className="mt-1 text-xs text-[#8494a7]">
              Connect through shared interests
            </p>
          </Link>
          <Link
            href="/teams"
            className="soft-card p-5 transition hover:border-[#b9cce3]"
          >
            <Sparkles className="mb-3 text-[#a5812d]" size={23} />
            <strong className="block text-sm">Join a team</strong>
            <p className="mt-1 text-xs text-[#8494a7]">
              Build something together
            </p>
          </Link>
          <Link
            href="/competitions"
            className="soft-card p-5 transition hover:border-[#b9cce3]"
          >
            <Trophy className="mb-3 text-[#17468c]" size={23} />
            <strong className="block text-sm">Take on a challenge</strong>
            <p className="mt-1 text-xs text-[#8494a7]">
              Explore open competitions
            </p>
          </Link>
        </div>
      )}
      {!filtered && (
        <section className="mb-7">
          <h2 className="section-title mb-3">Trending skills</h2>
          <div className="flex flex-wrap gap-2">
            {trendingSkills(users).map((skill) => (
              <button
                key={skill}
                onClick={() => update("skill", skill)}
                className="rounded-full border border-[#dbe5f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#17468c] hover:bg-[#eef4fc]"
              >
                #{skill}
              </button>
            ))}
          </div>
        </section>
      )}
      <div className="space-y-8">
        {show("People") && people.length > 0 && (
          <section>
            <SectionHead
              title={filtered ? "People" : "Students with similar interests"}
              href="/people"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {people.slice(0, 4).map((x) => (
                <PersonCard key={x.id} person={x} />
              ))}
            </div>
          </section>
        )}
        {show("Teams") && foundTeams.length > 0 && (
          <section>
            <SectionHead title="Recommended teams" href="/teams" />
            <div className="grid gap-4 md:grid-cols-2">
              {foundTeams.slice(0, 4).map((x) => (
                <TeamCard key={x.id} team={x} />
              ))}
            </div>
          </section>
        )}
        {show("Posts") && foundPosts.length > 0 && (
          <section>
            <SectionHead title="Conversations" href="/home" />
            <div className="space-y-4">
              {foundPosts.slice(0, 4).map((x) => (
                <PostCard key={x.id} post={x} />
              ))}
            </div>
          </section>
        )}
        {show("Competitions") && foundCompetitions.length > 0 && (
          <section>
            <SectionHead title="Competitions" href="/competitions" />
            <div className="grid gap-4 md:grid-cols-2">
              {foundCompetitions.slice(0, 4).map((x) => (
                <CompetitionCard key={x.id} competition={x} />
              ))}
            </div>
          </section>
        )}
        {show("Events") && foundEvents.length > 0 && (
          <section>
            <SectionHead title="Upcoming events" href="/events" />
            <div className="grid gap-4">
              {foundEvents.slice(0, 3).map((x) => (
                <EventCard key={x.id} event={x} />
              ))}
            </div>
          </section>
        )}
        {show("Communities") && foundClubs.length > 0 && (
          <section>
            <SectionHead
              title={filtered ? "Communities" : "Popular communities"}
              href="/communities"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {foundClubs.slice(0, 4).map((x) => (
                <ClubCard key={x.id} club={x} />
              ))}
            </div>
          </section>
        )}
        {filtered &&
          ![
            people,
            foundPosts,
            foundTeams,
            foundCompetitions,
            foundEvents,
            foundClubs,
          ].some((x) => x.length > 0) && (
            <EmptyState
              icon={<Search />}
              title="No results found"
              description="Try a broader topic or a different skill."
            />
          )}
      </div>
    </div>
  );
}
