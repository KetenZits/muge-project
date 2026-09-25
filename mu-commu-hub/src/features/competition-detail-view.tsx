"use client";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarDays,
  Clock3,
  MapPin,
  Share2,
  Trophy,
  Users,
} from "lucide-react";
import { Button, EmptyState, Tag } from "@/components/ui";
import { TeamCard } from "@/components/shared/cards";
import { deadline, shortDate } from "@/lib/utils";
import { useApp } from "@/stores/app";

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
            <Link href={`/teams?competition=${id}`}>
              <Button variant="gold">
                Find teammates <ArrowRight size={16} />
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => toggleBookmark("competitions", id)}
              aria-pressed={saved}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(location.href);
                toast.success("Competition link copied");
              }}
            >
              <Share2 size={16} /> Share
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
            {competition.description}
          </p>
          <h2 className="section-title mt-8">Requirements</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#6a7a8e]">
            {(competition.requirements ?? []).map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
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
            {competition.eligibility ?? "Current university students."}
          </p>
          <p className="mt-3 text-xs leading-5 text-[#718196]">
            Team size: {competition.teamSize}
          </p>
          <div className="my-4 border-t border-[#e4ebf3]" />
          <h3 className="text-sm font-bold">Need a team?</h3>
          <p className="mt-2 text-xs leading-5 text-[#718196]">
            Meet students recruiting for this challenge.
          </p>
          <Link href={`/teams?competition=${id}`} className="mt-4 block">
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
