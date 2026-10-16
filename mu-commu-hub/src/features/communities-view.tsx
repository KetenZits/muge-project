"use client";
import { LayoutGrid } from "lucide-react";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { ClubCard } from "@/components/shared/cards";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { useUrlState } from "@/lib/navigation";
import { SearchInput } from "./shared-controls";

const defaults = { query: "" };

export function CommunitiesView() {
  const { clubs } = useApp(useShallow((state) => ({ clubs: state.clubs })));
  const [filters, setFilters] = useUrlState(defaults);
  const list = clubs.filter((club) =>
    [club.name, club.description, ...club.tags]
      .join(" ")
      .toLowerCase()
      .includes(filters.query.trim().toLowerCase()),
  );
  return (
    <div>
      <PageHeader
        title="Communities"
        subtitle="Find a subject you care about and explore related conversations. Joining is saved in this browser."
      />
      <div className="mb-5">
        <SearchInput
          value={filters.query}
          onChange={(query) => setFilters({ query }, { replace: true })}
          placeholder="Search a community or topic..."
          label="Search communities"
        />
      </div>
      <p className="mb-4 text-sm text-muted" role="status">
        {list.length} sample communities
      </p>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<LayoutGrid />}
          title="No communities match"
          description="Try a different interest or explore all sample communities."
          action={
            <Button variant="secondary" onClick={() => setFilters(defaults)}>
              Clear search
            </Button>
          }
        />
      )}
    </div>
  );
}
