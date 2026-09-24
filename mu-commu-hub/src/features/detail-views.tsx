"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Pencil,
  Send,
  Share2,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import {
  Avatar,
  Button,
  EmptyState,
  Field,
  Modal,
  Tag,
  inputClass,
} from "@/components/ui";
import { PersonCard, PostCard, TeamCard } from "@/components/shared/cards";
import { postService } from "@/lib/api/client";
import { deadline, matchScore, relative, shortDate } from "@/lib/utils";
import { useApp } from "@/stores/app";
import type { Comment } from "@/types";
const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().min(10).max(300),
  faculty: z.string().min(2),
  major: z.string().min(2),
  year: z.number().min(1).max(8),
  skills: z.string(),
  interests: z.string(),
  availability: z.string(),
});
type ProfileForm = z.infer<typeof profileSchema>;
export function ProfileView({ username }: { username: string }) {
  const { users, user, following, toggleFollow, updateProfile, posts, teams } =
    useApp();
  const person =
    user.username === username
      ? user
      : users.find((x) => x.username === username || x.id === username);
  const [tab, setTab] = useState("About");
  const [editing, setEditing] = useState(false);
  const isMe = person?.id === user.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      name: person?.name ?? "",
      bio: person?.bio ?? "",
      faculty: person?.faculty ?? "",
      major: person?.major ?? "",
      year: person?.year ?? 1,
      skills: person?.skills.join(", ") ?? "",
      interests: person?.interests.join(", ") ?? "",
      availability: person?.availability.join(", ") ?? "",
    },
  });
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
  const submit = (data: ProfileForm) => {
    updateProfile({
      ...user,
      name: data.name,
      initials: data.name
        .split(" ")
        .map((x) => x[0])
        .slice(0, 2)
        .join(""),
      bio: data.bio,
      faculty: data.faculty,
      major: data.major,
      year: data.year,
      skills: data.skills
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      interests: data.interests
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      availability: data.availability
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
    setEditing(false);
    toast.success("Profile updated on this device");
  };
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
                <li key={achievement} className="flex items-center gap-3 text-sm">
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
      <Modal
        open={editing}
        onOpenChange={setEditing}
        title="Edit your profile"
        description="Make it easier for the right people to find you."
      >
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <Field label="Name" error={errors.name?.message}>
            <input {...register("name")} className={inputClass} />
          </Field>
          <Field label="Bio" error={errors.bio?.message}>
            <textarea
              {...register("bio")}
              rows={3}
              className={inputClass + " py-3"}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Faculty" error={errors.faculty?.message}>
              <input {...register("faculty")} className={inputClass} />
            </Field>
            <Field label="Major" error={errors.major?.message}>
              <input {...register("major")} className={inputClass} />
            </Field>
          </div>
          <Field label="Year" error={errors.year?.message}>
            <input
              {...register("year", { valueAsNumber: true })}
              type="number"
              min="1"
              max="8"
              className={inputClass}
            />
          </Field>
          <Field label="Skills (comma separated)">
            <input {...register("skills")} className={inputClass} />
          </Field>
          <Field label="Interests (comma separated)">
            <input {...register("interests")} className={inputClass} />
          </Field>
          <Field label="Open to (comma separated)">
            <input {...register("availability")} className={inputClass} />
          </Field>
          <Button type="submit" className="w-full">
            Save changes
          </Button>
        </form>
      </Modal>
    </div>
  );
}
export function TeamDetailView({ id }: { id: string }) {
  const {
    user,
    teams,
    users,
    competitions,
    interactions,
    requestTeam,
    bookmarks,
    toggleBookmark,
  } = useApp();
  const team = teams.find((x) => x.id === id);
  if (!team)
    return (
      <EmptyState
        icon={<Users />}
        title="Team not found"
        description="This team is not available in the demo."
      />
    );
  const leader = users.find((x) => x.id === team.leaderId);
  const competition = competitions.find((x) => x.id === team.competitionId);
  const requested = interactions.some((x) => x.id === `teamRequest:${id}`);
  const saved = bookmarks.some((x) => x.id === `teams:${id}`);
  const ownTeam = team.leaderId === user.id;
  const closed = new Date(team.deadline).getTime() < Date.now();
  const full = team.members >= team.capacity;
  const listedMembers = (team.memberIds ?? [team.leaderId])
    .map((memberId) => users.find((person) => person.id === memberId))
    .filter((person) => person !== undefined);
  return (
    <div>
      <Link
        href="/teams"
        className="mb-5 inline-flex items-center gap-1 text-xs font-semibold text-[#71839a] hover:text-[#17468c]"
      >
        <ArrowLeft size={14} /> Back to teams
      </Link>
      <div className="card overflow-hidden">
        <div className="relative bg-[#17468c] p-6 text-white sm:p-8">
          <div className="absolute -right-8 -top-15 h-46 w-46 rounded-full border-[36px] border-white/8" />
          <div className="relative">
            <Tag tone="gold">{competition?.title ?? "Independent project"}</Tag>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              {team.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#d9e6f7]">
              {team.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#d6e4f6]">
              <span>
                <Users size={14} className="mr-1 inline" />
                {team.members}/{team.capacity} members
              </span>
              <span>
                <MapPin size={14} className="mr-1 inline" />
                {team.mode} · {team.location}
              </span>
              <span>
                <Clock3 size={14} className="mr-1 inline" />
                {deadline(team.deadline)}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => requestTeam(id)} disabled={requested || ownTeam || closed || full}>
              {ownTeam ? "Your team" : closed ? "Applications closed" : full ? "Team full" : requested ? (
                <>
                  <Check size={16} /> Request sent
                </>
              ) : (
                <>
                  <Users size={16} /> Request to join
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => toggleBookmark("teams", id)}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save team"}
            </Button>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_230px]">
            <div>
              <h2 className="section-title">About the project</h2>
              <p className="mt-3 text-sm leading-7 text-[#67798e]">
                {team.description}
              </p>
              {team.objectives && team.objectives.length > 0 && (
                <>
                  <h2 className="section-title mt-8">Objectives</h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#67798e]">
                    {team.objectives.map((objective) => <li key={objective}>{objective}</li>)}
                  </ul>
                </>
              )}
              <h2 className="section-title mt-8">Open positions</h2>
              <div className="mt-4 space-y-2">
                {team.roles.map((role) => (
                  <div
                    key={role.name}
                    className="flex items-center justify-between rounded-xl border border-[#e5ecf3] px-4 py-3 text-sm"
                  >
                    <span>{role.name}</span>
                    <Tag tone={role.filled ? "green" : "gold"}>
                      {role.filled ? "Filled" : "Open"}
                    </Tag>
                  </div>
                ))}
              </div>
              <h2 className="section-title mt-8">Skills we value</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {team.skills.map((x) => (
                  <Tag key={x} tone="blue">
                    {x}
                  </Tag>
                ))}
              </div>
              <h2 className="section-title mt-8">Timeline</h2>
              <div className="mt-4 space-y-3 border-l-2 border-[#dbe8f8] pl-5 text-sm">
                <p>
                  <b>{shortDate(team.deadline)}:</b> Team applications close
                </p>
                {competition && (
                  <p><b>{shortDate(competition.date)}:</b> {competition.title}</p>
                )}
              </div>
            </div>
            <aside className="soft-card h-fit p-5">
              <h3 className="text-sm font-bold">Team at a glance</h3>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#dfe9f5]" role="progressbar" aria-label="Team members" aria-valuenow={team.members} aria-valuemin={0} aria-valuemax={team.capacity}>
                <div
                  className="h-full rounded-full bg-[#17468c]"
                  style={{ width: `${(team.members / team.capacity) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#8797a9]">
                {team.members} of {team.capacity} places filled
              </p>
              <div className="my-4 border-t border-[#e3eaf2]" />
              <p className="text-xs font-semibold">Team leader</p>
              {leader && (
                <Link
                  href={`/profile/${leader.username}`}
                  className="mt-3 flex items-center gap-2 text-xs text-[#17468c]"
                >
                  <Avatar user={leader} size="sm" />
                  {leader.name}
                </Link>
              )}
              <p className="mt-5 text-xs font-semibold">Members</p>
              <div className="mt-3 space-y-2">
                {listedMembers.map((member) => (
                  <Link key={member.id} href={`/profile/${member.username}`} className="flex items-center gap-2 text-xs text-[#17468c]">
                    <Avatar user={member} size="sm" /> {member.name}
                  </Link>
                ))}
                {team.members > listedMembers.length && (
                  <p className="text-xs text-[#8797a9]">
                    {team.members - listedMembers.length} other members not listed
                  </p>
                )}
              </div>
              {team.faculty && <p className="mt-5 text-xs text-[#74859a]"><b>Faculty requirement:</b> {team.faculty}</p>}
              <p className="mt-5 text-xs font-semibold">Contact</p>
              <p className="mt-2 text-xs text-[#74859a]">{team.contactMethod ?? "Message the team leader"}</p>
              <p className="mt-5 text-xs font-semibold">Application deadline</p>
              <p className="mt-2 text-xs text-[#74859a]">
                {shortDate(team.deadline)}
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
export function CompetitionDetailView({ id }: { id: string }) {
  const { competitions, teams, bookmarks, toggleBookmark } = useApp();
  const competition = competitions.find((x) => x.id === id);
  if (!competition)
    return (
      <EmptyState
        icon={<Trophy />}
        title="Competition not found"
        description="This competition is not available in the demo."
      />
    );
  const saved = bookmarks.some((x) => x.id === `competitions:${id}`);
  const recommended = teams.filter((x) => x.competitionId === id);
  return (
    <div>
      <Link
        href="/competitions"
        className="mb-5 inline-flex items-center gap-1 text-xs font-semibold text-[#71839a] hover:text-[#17468c]"
      >
        <ArrowLeft size={14} /> Back to competitions
      </Link>
      <div className="relative overflow-hidden rounded-[24px] bg-[#17468c] p-7 text-white sm:p-10">
        <div className="absolute -right-10 -top-22 h-72 w-72 rounded-full border-[50px] border-[#fac33420]" />
        <div className="relative max-w-xl">
          <Tag tone="gold">
            {competition.status} · {deadline(competition.deadline)}
          </Tag>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {competition.title}
          </h1>
          <p className="mt-2 text-sm text-[#d5e4f6]">
            Organized by {competition.organizer}
          </p>
          <p className="mt-4 text-sm leading-7 text-[#e2ebf8]">
            {competition.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/teams">
              <Button variant="gold">
                Find teammates <ArrowRight size={16} />
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => toggleBookmark("competitions", id)}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </div>
      <div className="my-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {[
          [CalendarDays, "Competition date", shortDate(competition.date)],
          [Clock3, "Register by", shortDate(competition.deadline)],
          [MapPin, "Location", competition.location],
          [Trophy, "Prize", competition.prize],
        ].map(([Icon, label, value]) => (
          <div key={String(label)} className="card p-4">
            <Icon size={18} className="text-[#17468c]" />
            <p className="mt-3 text-xs text-[#8e9dae]">{String(label)}</p>
            <p className="mt-1 text-sm font-bold">{String(value)}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_230px]">
        <div className="card p-6">
          <h2 className="section-title">About the challenge</h2>
          <p className="mt-3 text-sm leading-7 text-[#6a7a8e]">
            {competition.description} Students from all years and faculties are
            welcome to participate and bring different perspectives.
          </p>
          <h2 className="section-title mt-8">Important dates</h2>
          <div className="mt-4 space-y-4 border-l-2 border-[#dce7f6] pl-5 text-sm">
            <p>
              <b>Registration closes</b>
              <br />
              <span className="text-[#8595a7]">
                {shortDate(competition.deadline)}
              </span>
            </p>
            <p>
              <b>Competition day</b>
              <br />
              <span className="text-[#8595a7]">
                {shortDate(competition.date)}
              </span>
            </p>
          </div>
          <h2 className="section-title mt-8">Skills & categories</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...competition.categories, ...competition.skills].map((x) => (
              <Tag key={x} tone="blue">
                {x}
              </Tag>
            ))}
          </div>
        </div>
        <div className="soft-card h-fit p-5">
          <h3 className="text-sm font-bold">Who can join?</h3>
          <p className="mt-3 text-xs leading-5 text-[#718196]">
            Current university students. Bring a team of{" "}
            {competition.teamSize.toLowerCase()} and a willingness to build.
          </p>
          <div className="my-4 border-t border-[#e4ebf3]" />
          <h3 className="text-sm font-bold">Need a team?</h3>
          <p className="mt-2 text-xs leading-5 text-[#718196]">
            Meet students recruiting for this challenge.
          </p>
          <Link href="/teams" className="mt-4 block">
            <Button size="sm" className="w-full">
              Explore teams
            </Button>
          </Link>
        </div>
      </div>
      <section className="mt-8">
        <h2 className="section-title mb-4">
          Teams recruiting for this challenge
        </h2>
        {recommended.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {recommended.map((x) => (
              <TeamCard key={x.id} team={x} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users />}
            title="No teams yet"
            description="Be the first to start a team for this competition."
          />
        )}
      </section>
    </div>
  );
}
export function CommunityDetailView({ slug }: { slug: string }) {
  const { clubs, joinedClubs, toggleClub, posts, users } = useApp();
  const [tab, setTab] = useState("Posts");
  const club = clubs.find((x) => x.slug === slug);
  if (!club)
    return (
      <EmptyState
        icon={<Users />}
        title="Community not found"
        description="This community is not available in the demo."
      />
    );
  const joined = joinedClubs.includes(club.id);
  const related = posts
    .filter((x) => x.tags.some((tag) => club.tags.includes(tag)))
    .slice(0, 5);
  return (
    <div>
      <Link
        href="/communities"
        className="mb-5 inline-flex items-center gap-1 text-xs font-semibold text-[#71839a] hover:text-[#17468c]"
      >
        <ArrowLeft size={14} /> Back to communities
      </Link>
      <div className="card overflow-hidden">
        <div
          className="relative flex h-36 items-center px-8"
          style={{ background: club.color }}
        >
          <span className="text-7xl text-[#17468c]">{club.icon}</span>
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[45px] border-white/25" />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3 p-6">
          <div>
            <h1 className="text-2xl font-bold">{club.name}</h1>
            <p className="mt-2 max-w-lg text-sm text-[#718196]">
              {club.description}
            </p>
            <p className="mt-3 text-xs text-[#8d9bad]">
              {club.members.toLocaleString()} members · {club.activePosts}{" "}
              active posts
            </p>
          </div>
          <Button
            variant={joined ? "secondary" : "primary"}
            onClick={() => toggleClub(club.id)}
          >
            {joined ? "Joined ✓" : "Join community"}
          </Button>
        </div>
      </div>
      <div className="my-6 flex gap-1 rounded-xl border border-[#e5ecf3] bg-white p-1">
        {["Posts", "Members", "About"].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold ${tab === x ? "bg-[#17468c] text-white" : "text-[#7b8c9e]"}`}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "Posts" ? (
        related.length ? (
          <div className="space-y-4">
            {related.map((x) => (
              <PostCard key={x.id} post={x} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MessageCircle />}
            title="No conversations yet"
            description="Community discussions will appear here."
          />
        )
      ) : tab === "Members" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {users.slice(1, 7).map((x) => (
            <PersonCard key={x.id} person={x} />
          ))}
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="section-title">About {club.name}</h2>
          <p className="mt-3 text-sm leading-7 text-[#718196]">
            {club.description} Share what you are learning, ask questions, and
            find friendly collaborators from across campus.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {club.tags.map((x) => (
              <Tag key={x} tone="gold">
                {x}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export function PostDetailView({ id }: { id: string }) {
  const {
    posts,
    users,
    user,
    interactions,
    toggleLike,
    bookmarks,
    toggleBookmark,
    addComment,
  } = useApp();
  const post = posts.find((x) => x.id === id);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  useEffect(() => {
    postService.getComments(id).then(setComments);
  }, [id]);
  if (!post)
    return (
      <EmptyState
        icon={<MessageCircle />}
        title="Post not found"
        description="This post is not available in the demo."
      />
    );
  const author = users.find((x) => x.id === post.authorId) ?? user;
  const liked = interactions.some((x) => x.id === `like:${id}`);
  const saved = bookmarks.some((x) => x.id === `posts:${id}`);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 2) return;
    const comment: Comment = {
      id: `comment-${crypto.randomUUID()}`,
      postId: id,
      userId: user.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    await addComment(comment);
    setComments((x) => [...x, comment]);
    setContent("");
    toast.success("Comment added");
  };
  return (
    <div>
      <Link
        href="/home"
        className="mb-5 inline-flex items-center gap-1 text-xs font-semibold text-[#71839a] hover:text-[#17468c]"
      >
        <ArrowLeft size={14} /> Back to feed
      </Link>
      <article className="card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Avatar user={author} />
          <div>
            <Link
              href={`/profile/${author.username}`}
              className="text-sm font-bold hover:text-[#17468c]"
            >
              {author.name}
            </Link>
            <p className="mt-0.5 text-xs text-[#8d9bab]">
              {author.major} · {relative(post.createdAt)}
            </p>
          </div>
          <div className="ml-auto">
            <Tag tone="blue">{post.category}</Tag>
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#5f7186]">
          {post.content}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((x) => (
            <Tag key={x}>{x}</Tag>
          ))}
        </div>
        <div className="mt-6 flex gap-2 border-t border-[#e8eef4] pt-5">
          <Button
            variant={liked ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleLike(id)}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {post.likes + (liked ? 1 : 0)} likes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleBookmark("posts", id)}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(location.href);
              toast.success("Link copied");
            }}
          >
            <Share2 size={16} /> Share
          </Button>
        </div>
      </article>
      <div className="card mt-5 p-6">
        <h2 className="section-title">
          Conversation{" "}
          <span className="text-sm text-[#9ca9b7]">({comments.length})</span>
        </h2>
        <form onSubmit={submit} className="mt-5 flex gap-2">
          <input
            className={inputClass}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a thoughtful comment..."
            aria-label="Comment"
          />
          <Button type="submit" disabled={!content.trim()}>
            <Send size={16} />
          </Button>
        </form>
        {comments.length ? (
          <div className="mt-6 space-y-4">
            {comments.map((c) => {
              const person = users.find((x) => x.id === c.userId) ?? user;
              return (
                <div
                  key={c.id}
                  className="flex gap-3 border-t border-[#edf1f5] pt-4"
                >
                  <Avatar user={person} size="sm" />
                  <div>
                    <strong className="text-xs">{person.name}</strong>
                    <p className="mt-1 text-sm text-[#66778b]">{c.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 text-center text-xs text-[#9aa8b8]">
            Be the first to comment in this demo conversation.
          </p>
        )}
      </div>
    </div>
  );
}
