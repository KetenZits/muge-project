"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Modal } from "@/components/ui";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";
import { withReturnTo } from "@/lib/navigation";

export function SearchPalette() {
  const open = useApp((state) => state.searchOpen);
  const setOpen = useApp((state) => state.setSearchOpen);
  const { users, posts, teams, competitions, events, clubs } = useApp(
    useShallow((state) => ({
      users: state.users,
      posts: state.posts,
      teams: state.teams,
      competitions: state.competitions,
      events: state.events,
      clubs: state.clubs,
    })),
  );
  const [query, setQuery] = useState("");
  const router = useRouter();
  const groups = useMemo(
    () => [
      {
        name: "People",
        items: users.map((person) => ({
          id: person.id,
          label: person.name,
          context: person.major,
          search: [
            person.faculty,
            person.major,
            ...person.skills,
            ...person.interests,
          ].join(" "),
          href: "/profile/" + person.username,
        })),
      },
      {
        name: "Teams",
        items: teams.map((team) => ({
          id: team.id,
          label: team.title,
          context: team.roles
            .filter((role) => !role.filled)
            .map((role) => role.name)
            .join(", "),
          search: [
            team.description,
            ...team.skills,
            ...team.roles.map((role) => role.name),
          ].join(" "),
          href: "/teams/" + team.id,
        })),
      },
      {
        name: "Posts",
        items: posts.map((post) => ({
          id: post.id,
          label: post.title || "Photo post",
          context: post.category,
          search: [post.content, ...post.tags].join(" "),
          href: "/posts/" + post.id,
        })),
      },
      {
        name: "Competitions",
        items: competitions.map((competition) => ({
          id: competition.id,
          label: competition.title,
          context: competition.status,
          search: [
            competition.description,
            ...competition.categories,
            ...competition.skills,
          ].join(" "),
          href: "/competitions/" + competition.id,
        })),
      },
      {
        name: "Events",
        items: events.map((event) => ({
          id: event.id,
          label: event.title,
          context: event.location,
          search: event.description + " " + event.category,
          href: "/events?event=" + encodeURIComponent(event.id),
        })),
      },
      {
        name: "Communities",
        items: clubs.map((club) => ({
          id: club.id,
          label: club.name,
          context: club.tags.join(" · "),
          search: club.description + " " + club.tags.join(" "),
          href: "/communities/" + club.slug,
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
      description="Search all local demo people, skills, posts, teams, competitions, events, and communities."
      className="max-w-2xl"
    >
      <Command className="min-w-0 overflow-hidden">
        <Command.Input
          autoFocus
          value={query}
          onValueChange={setQuery}
          aria-label="Search all campus content"
          placeholder="Search a name, skill, team, or topic..."
          className="mb-3 min-h-12 w-full rounded-xl border border-[#dfe8f1] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[#17468c]"
        />
        <Command.List
          aria-label="Campus search results"
          className="max-h-[55vh] overflow-y-auto"
        >
          <Command.Empty className="px-4 py-8 text-center">
            <p className="text-sm text-muted">
              No local demo results match this search.
            </p>
            <Link
              href={"/discover?q=" + encodeURIComponent(query)}
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#17468c]"
            >
              Open Discover to refine your search →
            </Link>
          </Command.Empty>
          {groups.map((group) => (
            <Command.Group
              key={group.name}
              heading={group.name}
              className="mb-3 text-sm font-semibold text-[var(--section-accent)] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
            >
              {group.items.map((item) => (
                <Command.Item
                  key={item.id}
                  value={
                    group.name +
                    " " +
                    item.id +
                    " " +
                    item.label +
                    " " +
                    item.search
                  }
                  onSelect={() => {
                    setOpen(false);
                    router.push(withReturnTo(item.href));
                  }}
                  className="cursor-pointer rounded-xl px-3 py-3 text-sm font-medium text-[#33445c] data-[selected=true]:bg-[#eaf1fc] data-[selected=true]:text-[#17468c]"
                >
                  <span className="block [overflow-wrap:anywhere]">
                    {item.label}
                  </span>
                  <span className="mt-1 block truncate text-xs font-normal text-muted">
                    {item.context}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </Modal>
  );
}
