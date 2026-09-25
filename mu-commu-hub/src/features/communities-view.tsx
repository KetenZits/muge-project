"use client";
import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/ui";
import { ClubCard } from "@/components/shared/cards";
import { useApp } from "@/stores/app";
import { SearchInput } from "./shared-controls";

export function CommunitiesView() {
  const { clubs } = useApp();
  const [query, setQuery] = useState("");
  const list = clubs.filter((x) =>
    `${x.name} ${x.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div>
      <PageHeader
        eyebrow="FIND YOUR CIRCLE"
        title="Communities on campus"
        subtitle="Explore interest spaces where conversations turn into friendships and projects."
      />
      <div className="mb-5">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Find a community or topic..."
        />
      </div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((x) => (
            <ClubCard key={x.id} club={x} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<LayoutGrid />}
          title="No communities found"
          description="Try another interest or topic."
        />
      )}
    </div>
  );
}
