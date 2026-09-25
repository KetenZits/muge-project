"use client";
import { useState } from "react";
import { Bell, Heart, Trophy, Users } from "lucide-react";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { useApp } from "@/stores/app";
import { Segmented } from "./shared-controls";

export function NotificationsView() {
  const { notifications, markRead, markAllRead } = useApp();
  const [tab, setTab] = useState("All");
  const list = notifications.filter((n) => tab === "All" || n.category === tab);
  return (
    <div>
      <PageHeader
        eyebrow="STAY IN THE LOOP"
        title="Notifications"
        subtitle="The latest activity around your community."
        action={
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        }
      />
      <div className="mb-5">
        <Segmented
          options={[
            "All",
            "Mentions",
            "Teams",
            "Follows",
            "Competitions",
            "System",
          ]}
          value={tab}
          setValue={setTab}
        />
      </div>
      {list.length ? (
        <div className="card overflow-hidden">
          {list.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex w-full items-start gap-4 border-b border-[#edf1f5] p-4 text-left last:border-0 hover:bg-[#f8fafc] sm:p-5 ${!n.read ? "bg-[#f6f9fd]" : ""}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf1fc] text-[#17468c]">
                {n.category === "Teams" ? (
                  <Users size={18} />
                ) : n.category === "Follows" ? (
                  <Heart size={18} />
                ) : n.category === "Competitions" ? (
                  <Trophy size={18} />
                ) : (
                  <Bell size={18} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-bold">
                  {n.title}
                  {!n.read && (
                    <i className="h-2 w-2 rounded-full bg-[#17468c]" />
                  )}
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#76879b]">
                  {n.body}
                </span>
                <span className="mt-2 block text-[11px] text-[#a1afbd]">
                  {new Date(n.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell />}
          title="You're all caught up"
          description="Updates about your teams, friends, and competitions will show here."
        />
      )}
    </div>
  );
}
