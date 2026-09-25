"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  Pencil,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Avatar, Button, EmptyState, Tag } from "@/components/ui";
import { EditProfileDialog } from "@/components/people/edit-profile-dialog";
import { PostCard, TeamCard } from "@/components/shared/cards";
import { matchScore } from "@/lib/utils";
import { useApp } from "@/stores/app";

export function ProfileView({ username }: { username: string }) {
  const { users, user, following, toggleFollow, posts, teams } = useApp();
  const person =
    user.username === username
      ? user
      : users.find((x) => x.username === username || x.id === username);
  const [tab, setTab] = useState("About");
  const [editing, setEditing] = useState(false);
  const isMe = person?.id === user.id;
  if (!person)
    return (
      <EmptyState
        icon={<Users />}
        title="Student not found"
        description="This profile is not available in the demo."
      />
    );
  const mutual = person.interests.filter((x) => user.interests.includes(x));
  const userPosts = posts.filter((x) => x.authorId === person.id);
  const projectPosts = userPosts.filter((post) =>
    ["Project", "Startup"].includes(post.category),
  );
  const ledTeams = teams.filter((team) => team.leaderId === person.id);
  const achievements = person.achievements ?? [];
  return (
    <div>
      <Link
        href="/people"
        className="mb-5 inline-flex items-center gap-1 text-xs font-semibold text-[#71839a] hover:text-[#17468c]"
      >
        <ArrowLeft size={14} /> Back to people
      </Link>
      <div className="card overflow-hidden">
        <div className="relative h-35 bg-[#17468c] sm:h-42">
          <div className="absolute -right-10 -top-25 h-72 w-72 rounded-full border-[45px] border-white/7" />
          <div className="absolute right-25 top-5 h-26 w-26 rounded-3xl border-[20px] border-[#fac33429]" />
        </div>
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-3">
            <Avatar user={person} size="xl" />
            {isMe ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setEditing(true)}
              >
                <Pencil size={14} /> Edit profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={
                    following.includes(person.id) ? "secondary" : "primary"
                  }
                  onClick={() => toggleFollow(person.id)}
                >
                  {following.includes(person.id) ? "Following ✓" : "Follow"}
                </Button>
                <Link href={`/messages?user=${person.id}`}>
                  <Button size="sm" variant="secondary">
                    <MessageCircle size={14} /> Message
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold tracking-tight">{person.name}</h1>
            <p className="mt-1 text-sm text-[#17468c]">@{person.username}</p>
            <p className="mt-2 text-sm text-[#6d7e92]">
              {person.faculty} · {person.major} · Year {person.year}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#55667c]">
              {person.bio}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 border-t border-[#e9eef4] pt-4 text-xs text-[#7a8b9f]">
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
                {person.followersCount +
                  (!isMe && following.includes(person.id) ? 1 : 0)}
              </b>{" "}
              followers
            </span>
            <span>
              <b className="text-[#17263c]">{ledTeams.length}</b> teams
            </span>
          </div>
        </div>
      </div>
      {!isMe && (
        <div className="my-5 rounded-2xl border border-[#f2e7c9] bg-[#fffaf0] p-4">
          <p className="text-sm font-semibold text-[#80621e]">
            <Sparkles size={16} className="mr-1 inline" />{" "}
            {matchScore(user, person)}% match · {mutual.length} interests in
            common
          </p>
          <p className="mt-1 text-xs text-[#987e4b]">
            {mutual.slice(0, 4).join(" · ") ||
              "A fresh perspective for your network"}
          </p>
        </div>
      )}
      <div className="my-6 flex gap-1 overflow-x-auto rounded-xl border border-[#e5ecf3] bg-white p-1">
        {[
          "About",
          "Posts",
          "Projects",
          "Teams",
          "Skills",
          "Interests",
          "Achievements",
        ].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${tab === x ? "bg-[#17468c] text-white" : "text-[#7a8b9e] hover:bg-[#f3f7fb]"}`}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "About" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h2 className="section-title">About {person.name.split(" ")[0]}</h2>
            <p className="mt-3 text-sm leading-6 text-[#708096]">
              {person.bio}
            </p>
            <h3 className="mt-5 text-sm font-bold">Open to</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {person.availability.map((x) => (
                <Tag key={x} tone="green">
                  {x}
                </Tag>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="section-title">Skills & interests</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {person.skills.map((x) => (
                <Tag key={x} tone="blue">
                  {x}
                </Tag>
              ))}
            </div>
            <div className="my-4 border-t border-[#e8eef4]" />
            <div className="flex flex-wrap gap-2">
              {person.interests.map((x) => (
                <Tag key={x} tone="gold">
                  {x}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      ) : tab === "Posts" ? (
        userPosts.length ? (
          <div className="space-y-4">
            {userPosts.map((x) => (
              <PostCard key={x.id} post={x} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MessageCircle />}
            title="No posts yet"
            description="Posts from this student will appear here."
          />
        )
      ) : tab === "Projects" ? (
        projectPosts.length ? (
          <div className="space-y-4">
            {projectPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Sparkles />}
            title="No projects shared yet"
            description="Project and startup posts from this student will appear here."
          />
        )
      ) : tab === "Teams" ? (
        ledTeams.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {ledTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users />}
            title="No teams listed yet"
            description="Teams led by this student will appear here."
          />
        )
      ) : tab === "Achievements" ? (
        achievements.length ? (
          <div className="card p-6">
            <h2 className="section-title mb-4">Achievements</h2>
            <ul className="space-y-3">
              {achievements.map((achievement) => (
                <li
                  key={achievement}
                  className="flex items-center gap-3 text-sm"
                >
                  <Trophy size={18} className="text-[#a5812d]" />
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
        )
      ) : tab === "Skills" || tab === "Interests" ? (
        <div className="card p-6">
          <h2 className="section-title mb-4">{tab}</h2>
          <div className="flex flex-wrap gap-2">
            {(tab === "Skills" ? person.skills : person.interests).map((x) => (
              <Tag key={x} tone={tab === "Skills" ? "blue" : "gold"}>
                {x}
              </Tag>
            ))}
          </div>
        </div>
      ) : null}
      <EditProfileDialog user={user} open={editing} onOpenChange={setEditing} />
    </div>
  );
}
