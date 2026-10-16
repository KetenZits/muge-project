"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { withReturnTo } from "@/lib/navigation";

export function RightRail() {
  const pathname = usePathname();
  const { users, events, following, toggleFollow } = useApp(
    useShallow((state) => ({
      users: state.users,
      events: state.events,
      following: state.following,
      toggleFollow: state.toggleFollow,
    })),
  );
  const [pending, setPending] = useState<string | null>(null);
  if (pathname !== "/home") return null;
  const follow = async (id: string) => {
    setPending(id);
    try {
      await toggleFollow(id);
    } catch {
      toast.error("Could not save this follow. Please try again.");
    } finally {
      setPending(null);
    }
  };
  return (
    <aside
      className="hidden w-[250px] shrink-0 space-y-6 border-l border-[#e5ebf2] pl-6 xl:block"
      aria-label="Explore campus"
    >
      <section>
        <h2 className="text-sm font-bold">Explore a topic</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Hackathon", "AI", "Startup", "WebDev", "Cybersecurity"].map(
            (topic) => (
              <Link
                key={topic}
                href={"/discover?q=" + encodeURIComponent(topic)}
                className="inline-flex min-h-11 items-center rounded-xl bg-[#eaf1fc] px-3 text-xs font-semibold text-[#17468c]"
              >
                #{topic}
              </Link>
            ),
          )}
        </div>
      </section>
      <section className="border-t border-[#e5ebf2] pt-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold">People to explore</h2>
          <Link
            href="/people"
            className="inline-flex min-h-11 items-center text-xs font-semibold text-[#17468c]"
          >
            See all
          </Link>
        </div>
        <div className="mt-2 space-y-3">
          {users.slice(1, 4).map((person) => (
            <div key={person.id} className="flex items-center gap-2">
              <Avatar user={person} size="sm" />
              <div className="min-w-0 flex-1">
                <Link
                  href={withReturnTo("/profile/" + person.username)}
                  className="block truncate text-sm font-semibold hover:text-[#17468c]"
                >
                  {person.name}
                </Link>
                <p className="truncate text-xs text-muted">{person.major}</p>
              </div>
              <button
                onClick={() => void follow(person.id)}
                disabled={pending !== null}
                className="icon-button shrink-0"
                aria-label={
                  (following.includes(person.id) ? "Unfollow " : "Follow ") +
                  person.name
                }
                aria-pressed={following.includes(person.id)}
              >
                {following.includes(person.id) ? (
                  <Check size={17} />
                ) : (
                  <Plus size={17} />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-[#e5ebf2] pt-5">
        <h2 className="text-sm font-bold">Sample events</h2>
        <div className="mt-2 divide-y divide-[#e5ebf2]">
          {events.slice(0, 2).map((event) => (
            <Link
              key={event.id}
              href={"/events?event=" + encodeURIComponent(event.id)}
              className="block py-3"
            >
              <span className="text-sm font-semibold">{event.title}</span>
              <span className="mt-1 block text-xs leading-5 text-muted">
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {event.location}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <p className="border-t border-[#e5ebf2] pt-4 text-xs leading-5 text-muted">
        Independent local demo. Sample people and opportunities; activity stays
        in this browser. Not an official university service.
      </p>
    </aside>
  );
}
