"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell, Heart, Trophy, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button, EmptyState, PageHeader } from "@/components/ui";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { safeReturnTo, useUrlState, withReturnTo } from "@/lib/navigation";
import { Segmented } from "./shared-controls";

const categories = [
  "All",
  "Mentions",
  "Teams",
  "Follows",
  "Competitions",
  "System",
];
export function NotificationsView() {
  const { notifications, markRead, markAllRead } = useApp(
    useShallow((state) => ({
      notifications: state.notifications,
      markRead: state.markRead,
      markAllRead: state.markAllRead,
    })),
  );
  const [state, setState] = useUrlState({ tab: "All" });
  const tab = categories.includes(state.tab) ? state.tab : "All";
  const [pending, setPending] = useState<string[]>([]);
  const [allPending, setAllPending] = useState(false);
  const list = notifications.filter(
    (notification) => tab === "All" || notification.category === tab,
  );
  const unread = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const read = async (id: string) => {
    if (pending.includes(id)) return;
    setPending((items) => [...items, id]);
    try {
      await markRead(id);
    } catch {
      toast.error("Could not mark this update as read. Try again.");
    } finally {
      setPending((items) => items.filter((item) => item !== id));
    }
  };
  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread local demo updates. Open an update or mark it as read.`}
        action={
          <Button
            variant="secondary"
            size="sm"
            disabled={!unread || allPending}
            onClick={async () => {
              setAllPending(true);
              try {
                await markAllRead();
              } catch {
                toast.error("Could not mark all updates as read. Try again.");
              } finally {
                setAllPending(false);
              }
            }}
          >
            {allPending ? "Saving…" : "Mark all as read"}
          </Button>
        }
      />
      <div className="mb-5">
        <Segmented
          options={categories}
          value={tab}
          setValue={(value) => setState({ tab: value })}
        />
      </div>
      {list.length ? (
        <div className="divide-y divide-[#e5ebf2] border-y border-[#e5ebf2]">
          {list.map((notification) => {
            const href = safeReturnTo(notification.href, "");
            return (
              <article
                key={notification.id}
                className={`flex items-start gap-3 p-4 sm:gap-4 sm:p-5 ${notification.read ? "" : "bg-[#eaf1fc]/50"}`}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf1fc] text-[#17468c]"
                  aria-hidden
                >
                  {notification.category === "Teams" ? (
                    <Users size={20} />
                  ) : notification.category === "Follows" ? (
                    <Heart size={20} />
                  ) : notification.category === "Competitions" ? (
                    <Trophy size={20} />
                  ) : (
                    <Bell size={20} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold">{notification.title}</h2>
                    {!notification.read && (
                      <span className="text-xs font-semibold text-[#17468c]">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[#53647c]">
                    {notification.body}
                  </p>
                  <p className="mt-2 text-xs text-[#68778c]">
                    {new Date(notification.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {href && (
                      <Link
                        href={withReturnTo(href)}
                        onClick={() => {
                          if (!notification.read) void read(notification.id);
                        }}
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#17468c]"
                      >
                        Open update <ArrowRight size={16} />
                      </Link>
                    )}
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={
                          allPending || pending.includes(notification.id)
                        }
                        onClick={() => read(notification.id)}
                      >
                        {pending.includes(notification.id)
                          ? "Saving…"
                          : "Mark as read"}
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Bell />}
          title={
            tab === "All" ? "No updates yet" : `No ${tab.toLowerCase()} updates`
          }
          description={
            tab === "All"
              ? "Local demo activity will appear here when available."
              : "Choose All to see updates in the other categories."
          }
          action={
            tab !== "All" ? (
              <Button
                variant="secondary"
                onClick={() => setState({ tab: "All" })}
              >
                View all updates
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
