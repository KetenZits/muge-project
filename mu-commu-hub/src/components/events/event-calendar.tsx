import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { EventCard } from "@/components/shared/cards";
import type { Event } from "@/types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function EventCalendar({ events }: { events: Event[] }) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);
  const firstWeekday = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const cells = Array.from(
    { length: firstWeekday + daysInMonth },
    (_, index) => (index < firstWeekday ? null : index - firstWeekday + 1),
  );
  const eventsByDay = new Map<string, Event[]>();
  for (const event of events) {
    const key = dayKey(new Date(event.date));
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), event]);
  }
  const selectedEvents = selected ? (eventsByDay.get(selected) ?? []) : [];

  function changeMonth(offset: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));
    setSelected(null);
  }

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden p-3 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-[#243a57]">
            {month.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft size={17} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight size={17} />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-[#8a9aac] sm:text-xs">
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (!day) return <span key={`blank-${index}`} aria-hidden="true" />;
            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const key = dayKey(date);
            const count = eventsByDay.get(key)?.length ?? 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                aria-label={`${date.toDateString()}, ${count} events`}
                aria-pressed={selected === key}
                className={`flex min-h-12 flex-col items-center justify-center rounded-lg border text-xs transition sm:min-h-18 sm:text-sm ${selected === key ? "border-[#17468c] bg-[#eaf1fc] text-[#17468c]" : "border-[#edf1f5] hover:border-[#b8cbe2]"}`}
              >
                <span className="font-semibold">{day}</span>
                {count > 0 && (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#a5812d]" />
                )}
                {count > 0 && <span className="sr-only">{count} events</span>}
              </button>
            );
          })}
        </div>
      </div>
      {selected && (
        <section>
          <h3 className="section-title mb-3">
            {new Date(
              Number(selected.split("-")[0]),
              Number(selected.split("-")[1]),
              Number(selected.split("-")[2]),
            ).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
          </h3>
          {selectedEvents.length ? (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<ChevronRight />}
              title="No events this day"
              description="Choose another date to explore campus events."
            />
          )}
        </section>
      )}
    </div>
  );
}
