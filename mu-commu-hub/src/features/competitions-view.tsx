"use client";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { CompetitionCard } from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { useUrlState, withReturnTo } from "@/lib/navigation";
import { deadline } from "@/lib/utils";
import { Segmented, SearchInput } from "./shared-controls";

const defaults = { query: "", status: "All" };
const statuses = ["All", "Open", "Closing Soon", "Upcoming"];

export function CompetitionsView() {
  const { competitions } = useApp(
    useShallow((state) => ({ competitions: state.competitions })),
  );
  const [filters, setFilters] = useUrlState(defaults);
  const status = statuses.includes(filters.status) ? filters.status : "All";
  const list = competitions.filter(
    (competition) =>
      [
        competition.title,
        competition.description,
        ...competition.categories,
        ...competition.skills,
      ]
        .join(" ")
        .toLowerCase()
        .includes(filters.query.trim().toLowerCase()) &&
      (status === "All" || competition.status === status),
  );
  const featured =
    !filters.query && status === "All"
      ? list.find(
          (competition) =>
            competition.featured && deadline(competition.deadline) !== "Closed",
        )
      : undefined;
  return (
    <div>
      <PageHeader
        title="Competitions"
        subtitle="Compare challenges, check deadlines, and find teammates. Sample opportunities in your local demo."
      />
      <div className="mb-6 space-y-3">
        <SearchInput
          value={filters.query}
          onChange={(query) => setFilters({ query }, { replace: true })}
          placeholder="Search challenges, skills, or topics..."
          label="Search competitions"
        />
        <Segmented
          options={statuses}
          value={status}
          setValue={(value) => setFilters({ status: value })}
          label="Competition status"
        />
      </div>
      {featured && (
        <Link
          href={withReturnTo("/competitions/" + featured.id)}
          className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[var(--section-tint)] p-5"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--section-accent)]">
              Featured · {deadline(featured.deadline)}
            </p>
            <h2 className="mt-1 text-lg font-bold">{featured.title}</h2>
            <p className="mt-1 text-sm text-muted">
              {featured.teamSize} · {featured.location}
            </p>
          </div>
          <span className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#17468c]">
            Explore challenge <ArrowRight size={16} />
          </span>
        </Link>
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="section-heading">
          {filters.query || status !== "All"
            ? "Matching challenges"
            : "All challenges"}
        </h2>
        <p className="text-sm text-muted" role="status">
          {list.length} opportunities
        </p>
      </div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Trophy />}
          title="No competitions match"
          description="Try a broader topic or another status."
          action={
            <Button variant="secondary" onClick={() => setFilters(defaults)}>
              Reset filters
            </Button>
          }
        />
      )}
    </div>
  );
}
