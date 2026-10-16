"use client";
import { CalendarDays } from "lucide-react";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { EventCard } from "@/components/shared/cards";
import { EventCalendar } from "@/components/events/event-calendar";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { useUrlState } from "@/lib/navigation";
import { Segmented, SearchInput } from "./shared-controls";

const defaults = { view: "Cards", category: "All", query: "", event: "" };
export function EventsView() {
  const { events } = useApp(useShallow((state) => ({ events: state.events })));
  const [state, setState] = useUrlState(defaults);
  const view = state.view === "Calendar" ? "Calendar" : "Cards";
  const categories = ["All", ...new Set(events.map((event) => event.category))];
  const query = state.query.trim().toLowerCase();
  const list = events.filter(
    (event) =>
      (state.category === "All" || event.category === state.category) &&
      (!state.event || event.id === state.event) &&
      (!query ||
        [
          event.title,
          event.description,
          event.host,
          event.category,
          event.location,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)),
  );
  const applied = state.category !== "All" || Boolean(query || state.event);
  return (
    <div>
      <PageHeader
        title="Events & gatherings"
        subtitle="Find a campus activity and keep your plans in this local demo."
        action={
          <Segmented
            options={["Cards", "Calendar"]}
            value={view}
            setValue={(value) => setState({ view: value })}
          />
        }
      />
      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold">Search events</p>
        <SearchInput
          value={state.query}
          onChange={(value) => setState({ query: value }, { replace: true })}
          placeholder="Title, host, or location"
        />
      </div>
      <div
        className="mb-5 flex max-w-full gap-2 overflow-x-auto"
        aria-label="Event categories"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setState({ category })}
            aria-pressed={state.category === category}
            className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${state.category === category ? "bg-[#17468c] text-white" : "border border-[#dae3ed] bg-white text-[#53647c]"}`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#53647c]" role="status">
          {list.length} {list.length === 1 ? "event" : "events"}
          {state.event
            ? " selected"
            : applied
              ? " match your filters"
              : " to explore"}
        </p>
        {applied && (
          <Button variant="ghost" size="sm" onClick={() => setState(defaults)}>
            Show all events
          </Button>
        )}
      </div>
      {!list.length ? (
        <EmptyState
          icon={<CalendarDays />}
          title="No matching events"
          description="Try another search or show all events to find a campus activity."
          action={
            <Button variant="secondary" onClick={() => setState(defaults)}>
              Show all events
            </Button>
          }
        />
      ) : view === "Cards" ? (
        <div className="grid gap-4">
          {list.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EventCalendar events={list} />
      )}
    </div>
  );
}
