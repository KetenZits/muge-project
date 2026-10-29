"use client";
import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Pencil, Sparkles, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Button, EmptyState, Tag } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackLink } from "@/components/shared/back-link";
import { EditProfileDialog } from "@/components/people/edit-profile-dialog";
import { PostCard, TeamCard } from "@/components/shared/cards";
import { sharedItems } from "@/lib/discovery";
import { useUrlState, withReturnTo } from "@/lib/navigation";
import { useShallow } from "zustand/react/shallow";
import { useApp } from "@/stores/app";

const sections = [
  ["about", "About"],
  ["posts", "Posts"],
  ["projects", "Projects"],
  ["teams", "Led teams"],
  ["achievements", "Achievements"],
] as const;

export function ProfileView({ username }: { username: string }) {
  const { users, user, following, toggleFollow, posts, teams } = useApp(
    useShallow((state) => ({
      users: state.users,
      user: state.user,
      following: state.following,
      toggleFollow: state.toggleFollow,
      posts: state.posts,
      teams: state.teams,
    })),
  );
  const person =
    user.username === username
      ? user
      : users.find(
          (item) => item.username === username || item.id === username,
        );
  const [state, setState] = useUrlState({ tab: "about" });
  const tab = sections.some(([value]) => value === state.tab.toLowerCase())
    ? state.tab.toLowerCase()
    : "about";
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  if (!person)
    return (
      <div>
        <BackLink fallback="/people" />
        <EmptyState
          icon={<Users />}
          title="Student not found"
          description="Return to people to find another local demo profile."
        />
      </div>
    );
  const isMe = person.id === user.id;
  const isFollowing = following.includes(person.id);
  const mutual = sharedItems(user.interests, person.interests);
  const sharedSkills = sharedItems(user.skills, person.skills);
  const sharedAvailability = sharedItems(
    user.availability,
    person.availability,
  );
  const userPosts = posts.filter((post) => post.authorId === person.id);
  const projectPosts = userPosts.filter((post) =>
    ["Project", "Startup"].includes(post.category),
  );
  const ledTeams = teams.filter((team) => team.leaderId === person.id);
  const achievements = person.achievements ?? [];
  const counts: Record<string, number> = {
    posts: userPosts.length,
    projects: projectPosts.length,
    teams: ledTeams.length,
    achievements: achievements.length,
  };
  const follow = async () => {
    if (pending) return;
    setPending(true);
    try {
      await toggleFollow(person.id);
    } catch {
      toast.error("Could not update following. Try again.");
    } finally {
      setPending(false);
    }
  };
  return (
    <div>
      <BackLink fallback="/people" />
      <header className="profile-summary card p-5 sm:p-7">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar user={person} size="xl" />
          <div className="min-w-0 flex-1 basis-48">
            <h1 className="break-words text-2xl font-bold tracking-tight">
              {person.name}
            </h1>
            <p className="mt-1 break-words text-sm text-[#17468c]">
              @{person.username}
            </p>
            {person.displayRole && (
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {person.displayRole}
                {isMe && person.email ? ` · ${person.email}` : ""}
              </p>
            )}
            <p className="mt-2 text-sm text-[#53647c]">
              {person.faculty} · {person.major} · Year {person.year}
            </p>
          </div>
          {isMe ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditing(true)}
            >
              <Pencil size={16} /> Edit profile
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={isFollowing ? "secondary" : "primary"}
                aria-pressed={isFollowing}
                disabled={pending}
                onClick={follow}
              >
                {pending ? "Saving…" : isFollowing ? "Unfollow" : "Follow"}
              </Button>
              <Link
                href={withReturnTo(`/messages?user=${person.id}`)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#dae3ed] px-4 text-sm font-semibold text-[#17468c]"
              >
                <MessageCircle size={16} /> Message
              </Link>
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-semibold">Open to</span>
          {person.availability.length ? (
            person.availability.map((item) => (
              <Tag key={item} tone="green">
                {item}
              </Tag>
            ))
          ) : (
            <span className="text-sm text-[#68778c]">
              No availability listed
            </span>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#e5ebf2] pt-4 text-sm text-[#53647c]">
          <span>
            <b className="text-[#17263c]">{userPosts.length}</b> posts
          </span>
          <span>
            <b className="text-[#17263c]">
              {isMe ? following.length : person.followingCount}
            </b>{" "}
            following
          </span>
          <span>
            <b className="text-[#17263c]">
              {person.followersCount + (!isMe && isFollowing ? 1 : 0)}
            </b>{" "}
            followers
          </span>
          <span>
            <b className="text-[#17263c]">{ledTeams.length}</b> teams led
          </span>
        </div>
      </header>
      {!isMe && (
        <section
          aria-label="Shared collaboration interests"
          className="my-5 border-y border-[#e5ebf2] py-4"
        >
          <h2 className="text-sm font-semibold text-[#17468c]">
            What you have in common
          </h2>
          {mutual.length || sharedSkills.length || sharedAvailability.length ? (
            <div className="mt-2 space-y-1 text-sm leading-6 text-[#53647c]">
              {mutual.length > 0 && (
                <p>
                  <b>Interests:</b> {mutual.join(" · ")}
                </p>
              )}
              {sharedSkills.length > 0 && (
                <p>
                  <b>Skills:</b> {sharedSkills.join(" · ")}
                </p>
              )}
              {sharedAvailability.length > 0 && (
                <p>
                  <b>Open to:</b> {sharedAvailability.join(" · ")}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#53647c]">
              No shared selections yet. Explore their skills and interests
              below.
            </p>
          )}
          <p className="mt-2 text-xs text-[#68778c]">
            Based on the selections in your local demo profiles.
          </p>
        </section>
      )}
      <Tabs
        value={tab}
        onValueChange={(value) => setState({ tab: value })}
        className="mt-6"
      >
        <TabsList className="section-tabs" aria-label="Profile sections">
          {sections.map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
              {counts[value] !== undefined && (
                <span className="ml-1 tabular-nums">{counts[value]}</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={tab} className="pt-4">
          <section
            id="profile-section"
            aria-label={sections.find(([value]) => value === tab)?.[1]}
          >
            {tab === "about" ? (
              <div className="space-y-7">
                <div>
                  <h2 className="section-title">
                    About {person.name.split(" ")[0]}
                  </h2>
                  <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-7 text-[#53647c]">
                    {person.bio || "No introduction shared yet."}
                  </p>
                </div>
                <div>
                  <h2 className="section-title">Skills</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {person.skills.length ? (
                      person.skills.map((item) => (
                        <Tag key={item} tone="blue">
                          {item}
                        </Tag>
                      ))
                    ) : (
                      <p className="text-sm text-[#68778c]">
                        No skills listed yet.
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="section-title">Interests</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {person.interests.length ? (
                      person.interests.map((item) => (
                        <Tag key={item} tone="gold">
                          {item}
                        </Tag>
                      ))
                    ) : (
                      <p className="text-sm text-[#68778c]">
                        No interests listed yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : tab === "posts" || tab === "projects" ? (
              (tab === "posts" ? userPosts : projectPosts).length ? (
                <div className="space-y-4">
                  {(tab === "posts" ? userPosts : projectPosts).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={tab === "posts" ? <MessageCircle /> : <Sparkles />}
                  title={
                    tab === "posts" ? "No posts yet" : "No projects shared yet"
                  }
                  description={
                    tab === "posts"
                      ? "Posts from this student will appear here."
                      : "Project and startup posts from this student will appear here."
                  }
                />
              )
            ) : tab === "teams" ? (
              ledTeams.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {ledTeams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Users />}
                  title="No led teams listed"
                  description="Teams led by this student will appear here."
                  action={
                    isMe ? (
                      <Button asChild variant="secondary">
                        <Link href="/teams?view=mine">Go to my teams</Link>
                      </Button>
                    ) : undefined
                  }
                />
              )
            ) : achievements.length ? (
              <div>
                <h2 className="section-title mb-4">Achievements</h2>
                <ul className="space-y-4">
                  {achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-start gap-3 text-sm leading-6"
                    >
                      <Trophy
                        size={18}
                        className="mt-1 shrink-0 text-[#8a6820]"
                      />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyState
                icon={<Trophy />}
                title="No achievements listed"
                description="Achievements shared by this student will appear here."
              />
            )}
          </section>
        </TabsContent>
      </Tabs>
      <EditProfileDialog user={user} open={editing} onOpenChange={setEditing} />
    </div>
  );
}
