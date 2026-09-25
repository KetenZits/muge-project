"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { EmptyState, PageHeader, Tag } from "@/components/ui";
import { CompetitionCard } from "@/components/shared/cards";
import { useApp } from "@/stores/app";
import { Segmented, SearchInput } from "./shared-controls";

export function CompetitionsView() {
  const { competitions } = useApp();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const list = competitions.filter(
    (x) =>
      x.title.toLowerCase().includes(query.toLowerCase()) &&
      (status === "All" || x.status === status),
  );
  return (
    <div>
      <PageHeader
        eyebrow="OPPORTUNITIES"
        title="Competitions worth joining"
        subtitle="Explore challenges, meet teammates, and make your mark."
      />
      <div className="card mb-5 p-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search competitions..."
        />
        <div className="mt-4">
          <Segmented
            options={["All", "Open", "Closing Soon", "Upcoming"]}
            value={status}
            setValue={setStatus}
          />
        </div>
      </div>
      {competitions[0] && (
        <Link
          href={`/competitions/${competitions[0].id}`}
          className="relative mb-6 block overflow-hidden rounded-[22px] bg-[#17468c] p-6 text-white sm:p-8"
        >
          <div className="absolute -right-10 -top-15 h-56 w-56 rounded-full border-[42px] border-[#fac33420]" />
          <div className="relative max-w-md">
            <Tag tone="gold">FEATURED CHALLENGE</Tag>
            <h2 className="mt-4 text-2xl font-bold">{competitions[0].title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#d6e4f7]">
              {competitions[0].description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#fac334]">
              Explore challenge <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      )}
      <div className="mb-4 flex justify-between">
        <h2 className="section-title">All competitions</h2>
        <span className="text-xs text-[#8c9bab]">
          {list.length} opportunities
        </span>
      </div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((x) => (
            <CompetitionCard key={x.id} competition={x} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Trophy />}
          title="No competitions found"
          description="Try another name or status."
        />
      )}
    </div>
  );
}
