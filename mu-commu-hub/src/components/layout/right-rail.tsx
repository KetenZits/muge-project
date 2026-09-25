"use client";
import Link from "next/link";
import { CalendarDays, Plus, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useApp } from "@/stores/app";

export function RightRail() {
  const users = useApp((s) => s.users);
  const events = useApp((s) => s.events);
  const following = useApp((s) => s.following);
  const toggleFollow = useApp((s) => s.toggleFollow);
  return (
    <aside className="hidden w-[270px] shrink-0 space-y-5 xl:block">
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <strong className="text-sm">Trending topics</strong>
          <Sparkles size={16} className="text-[#a5812d]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["#Hackathon", "#AI", "#Startup", "#WebDev", "#Cybersecurity"].map(
            (x) => (
              <Link
                key={x}
                href={`/discover?q=${encodeURIComponent(x.slice(1))}`}
                className="chip blue hover:bg-[#dceafb]"
              >
                {x}
              </Link>
            ),
          )}
        </div>
      </div>
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <strong className="text-sm">People to meet</strong>
          <Link href="/people" className="text-xs font-bold text-[#17468c]">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          {users.slice(1, 4).map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <Avatar user={user} size="sm" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/profile/${user.username}`}
                  className="block truncate text-xs font-semibold hover:text-[#17468c]"
                >
                  {user.name}
                </Link>
                <span className="text-[11px] text-[#8b9aab]">{user.major}</span>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className="text-[#17468c]"
                aria-label={following.includes(user.id) ? "Unfollow" : "Follow"}
              >
                {following.includes(user.id) ? "✓" : <Plus size={17} />}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <strong className="text-sm">Coming up</strong>
          <CalendarDays size={16} className="text-[#a5812d]" />
        </div>
        {events.slice(0, 2).map((e) => (
          <Link
            href="/events"
            key={e.id}
            className="block border-t border-[#edf1f5] py-3 first:border-0"
          >
            <span className="text-xs font-semibold">{e.title}</span>
            <span className="mt-1 block text-[11px] text-[#8b9aab]">
              {new Date(e.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              · {e.location}
            </span>
          </Link>
        ))}
      </div>
      <p className="px-2 text-[11px] leading-5 text-[#a0acb9]">
        MU Connect is an independent frontend prototype. Not an official
        university service.
      </p>
    </aside>
  );
}
