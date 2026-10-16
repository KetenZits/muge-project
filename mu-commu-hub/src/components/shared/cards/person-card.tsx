"use client";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, MessageCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Button, Modal, Tag } from "@/components/ui";
import { matchScore } from "@/lib/utils";
import { withReturnTo } from "@/lib/navigation";
import { useCardMotion } from "@/lib/motion/use-card-motion";
import { useApp } from "@/stores/app";
import type { User } from "@/types";

export function PersonCard({ person }: { person: User }) {
  const cardMotion = useCardMotion();
  const user = useApp((state) => state.user);
  const toggleFollow = useApp((state) => state.toggleFollow);
  const openComposer = useApp((state) => state.openComposer);
  const followed = useApp((state) => state.following.includes(person.id));
  const myTeams = useApp(
    useShallow((state) =>
      state.teams.filter((team) => team.leaderId === state.user.id),
    ),
  );
  const mutual = person.interests.filter((interest) =>
    user.interests.includes(interest),
  );
  const sharedSkills = person.skills.filter((skill) =>
    user.skills.includes(skill),
  );
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const follow = async () => {
    setPending(true);
    try {
      await toggleFollow(person.id);
    } catch {
      toast.error("Could not save this follow. Please try again.");
    } finally {
      setPending(false);
    }
  };
  return (
    <motion.article {...cardMotion} className="card flex min-w-0 flex-col p-5">
      <div className="flex items-start gap-3">
        <Avatar user={person} size="lg" />
        <div className="min-w-0">
          <h3 className="text-base font-bold">
            <Link
              href={withReturnTo("/profile/" + person.username)}
              className="hover:text-[#17468c]"
            >
              {person.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            {person.major} · Year {person.year}
          </p>
          <p className="text-xs leading-5 text-muted">{person.faculty}</p>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-[var(--section-accent)]">
        {mutual.length
          ? mutual.length + " shared interests"
          : sharedSkills.length
            ? sharedSkills.length + " shared skills"
            : "Explore a different perspective"}
      </p>
      {(mutual.length > 0 || sharedSkills.length > 0) && (
        <p className="mt-1 text-sm leading-5 text-muted">
          {(mutual.length ? mutual : sharedSkills).slice(0, 3).join(" · ")}
          {mutual.length > 3 && " · +" + (mutual.length - 3) + " more"}
        </p>
      )}
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#53647c]">
        {person.bio}
      </p>
      <p className="mt-3 text-sm text-muted">
        <span className="font-semibold text-[#17263c]">Open to </span>
        {person.availability.join(" · ") || "New conversations"}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {person.skills.slice(0, 3).map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
      </div>
      <details className="mt-3 text-xs leading-5 text-muted">
        <summary className="flex min-h-11 cursor-pointer items-center text-[#17468c]">
          Why this suggestion?
        </summary>
        <p>
          Local demo relevance: {matchScore(user, person)}/100, based on shared
          interests, skills, faculty, and availability. This is a browsing aid,
          not a validated compatibility prediction.
        </p>
      </details>
      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <Link
          href={withReturnTo("/messages?user=" + person.id)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#17468c] px-3 text-sm font-semibold text-white hover:bg-[#0f3672]"
        >
          <MessageCircle size={15} /> Message
        </Link>
        <Button
          variant="secondary"
          disabled={pending}
          aria-pressed={followed}
          onClick={() => void follow()}
          className="min-h-11"
        >
          {followed ? <Check size={14} /> : <UserPlus size={14} />}
          {pending ? "Saving..." : followed ? "Following" : "Follow"}
        </Button>
      </div>
      <Button
        variant="ghost"
        className="mt-2 min-h-11 w-full"
        onClick={() => setInviteOpen(true)}
      >
        Invite to team
      </Button>
      <Modal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title={"Invite " + person.name.split(" ")[0] + " to a team"}
        description="Prepare a project invitation in your local demo conversation. No one is contacted."
      >
        {myTeams.length ? (
          <div className="space-y-2">
            {myTeams.map((team) => (
              <Link
                key={team.id}
                href={withReturnTo(
                  "/messages?user=" + person.id + "&invite=" + team.id,
                )}
                onClick={() => setInviteOpen(false)}
                className="block rounded-xl border border-[#e4ebf3] p-4 text-sm font-semibold hover:border-[#17468c] hover:text-[#17468c]"
              >
                {team.title}
              </Link>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm leading-6 text-muted">
              Start a recruitment post, then prepare an invitation for your
              team.
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                setInviteOpen(false);
                openComposer("Team");
              }}
            >
              Recruit teammates
            </Button>
          </div>
        )}
      </Modal>
    </motion.article>
  );
}
