"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Modal } from "@/components/ui";
import { useApp } from "@/stores/app";

export function SearchPalette() {
  const open = useApp((s) => s.searchOpen);
  const setOpen = useApp((s) => s.setSearchOpen);
  const { users, posts, teams, competitions, events, clubs } = useApp();
  const router = useRouter();
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);
  const groups = useMemo(
    () => [
      {
        name: "People",
        items: users.slice(0, 15).map((x) => ({
          id: x.id,
          label: x.name,
          href: `/profile/${x.username}`,
        })),
      },
      {
        name: "Posts",
        items: posts
          .slice(0, 20)
          .map((x) => ({ id: x.id, label: x.title, href: `/posts/${x.id}` })),
      },
      {
        name: "Teams",
        items: teams.map((x) => ({
          id: x.id,
          label: x.title,
          href: `/teams/${x.id}`,
        })),
      },
      {
        name: "Competitions",
        items: competitions.map((x) => ({
          id: x.id,
          label: x.title,
          href: `/competitions/${x.id}`,
        })),
      },
      {
        name: "Events",
        items: events.map((x) => ({
          id: x.id,
          label: x.title,
          href: "/events",
        })),
      },
      {
        name: "Communities",
        items: clubs.map((x) => ({
          id: x.id,
          label: x.name,
          href: `/communities/${x.slug}`,
        })),
      },
    ],
    [users, posts, teams, competitions, events, clubs],
  );
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Search campus"
      description="Find students, posts, teams, events and communities."
      className="max-w-2xl"
    >
      <Command className="overflow-hidden">
        <Command.Input
          autoFocus
          placeholder="Try “AI hackathon” or “Figma”..."
          className="mb-3 h-12 w-full rounded-xl border border-[#dfe8f1] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[#17468c]"
        />
        <Command.List className="max-h-[50vh] overflow-y-auto">
          <Command.Empty className="px-4 py-10 text-center text-sm text-[#8190a2]">
            No results. Try another search.
          </Command.Empty>
          {groups.map((group) => (
            <Command.Group
              key={group.name}
              heading={group.name}
              className="mb-3 text-xs font-bold text-[#a5812d] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
            >
              {group.items.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${group.name} ${item.label}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                  className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-[#33445a] data-[selected=true]:bg-[#eef4fc] data-[selected=true]:text-[#17468c]"
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </Modal>
  );
}
