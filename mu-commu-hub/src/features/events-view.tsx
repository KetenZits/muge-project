"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { EventCard } from "@/components/shared/cards";
import { EventCalendar } from "@/components/events/event-calendar";
import { useApp } from "@/stores/app";
import { Segmented } from "./shared-controls";

export function EventsView() {
  const { events } = useApp();
  const [view, setView] = useState("Cards");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(events.map((x) => x.category))];
  const list = events.filter(
    (x) => category === "All" || x.category === category,
  );
  return (
    <div>
      <PageHeader
        eyebrow="CAMPUS LIFE"
        title="Events & gatherings"
        subtitle="Learn something, meet someone, and make campus feel smaller."
        action={
          <Segmented
            options={["Cards", "Calendar"]}
            value={view}
            setValue={setView}
          />
        }
      />
      <div className="mb-5 flex max-w-full gap-2 overflow-x-auto">
        {categories.map((x) => (
          <button
            key={x}
            onClick={() => setCategory(x)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${category === x ? "bg-[#17468c] text-white" : "border border-[#e2eaf2] bg-white text-[#7d8da0]"}`}
          >
            {x}
          </button>
        ))}
      </div>
      {view === "Cards" ? (
        <div className="grid gap-4">
          {list.map((x) => (
            <EventCard key={x.id} event={x} />
          ))}
        </div>
      ) : (
        <EventCalendar events={list} />
      )}
    </div>
  );
}
