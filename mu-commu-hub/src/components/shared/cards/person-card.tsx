"use client";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, MessageCircle, UserPlus } from "lucide-react";
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
      <p className="mt-4 text-sm font-semibold text-[#17468c]">
        {person.skills[0] ?? person.major}
      </p>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
        {person.bio}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {person.skills.slice(0, 3).map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
        {person.skills.length > 3 && <Tag>+{person.skills.length - 3}</Tag>}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted">
        <span className="font-semibold text-[#266047]">Open to </span>
        {person.availability.slice(0, 2).join(" · ") || "New conversations"}
      </p>
      {mutual.length > 0 && (
        <p className="mt-2 text-xs text-[#63458b]">
          {mutual.length} shared interests · {mutual.slice(0, 2).join(" · ")}
        </p>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Button asChild className="flex-1">
          <Link href={withReturnTo("/profile/" + person.username)}>
            View profile <ArrowRight size={15} />
          </Link>
        </Button>
        <Button
          variant="secondary"
          disabled={pending}
          aria-pressed={followed}
          onClick={() => void follow()}
        >
          {followed ? <Check size={15} /> : <UserPlus size={15} />}
          {pending ? "Saving..." : followed ? "Following" : "Follow"}
        </Button>
      </div>
      <details className="mt-3 border-t border-[var(--line)] pt-1 text-xs text-muted">
        <summary className="flex min-h-11 cursor-pointer items-center font-medium">
          Connect & match details
        </summary>
        <div className="flex flex-wrap gap-2 pb-3">
          <Button asChild variant="secondary">
            <Link href={withReturnTo("/messages?user=" + person.id)}>
              <MessageCircle size={15} />
              Message
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => setInviteOpen(true)}>
            Invite to team
          </Button>
        </div>
        <p className="leading-5">
          Local relevance: {matchScore(user, person)}/100, based on shared
          interests, skills, faculty, and availability
          {sharedSkills.length
            ? `, including ${sharedSkills.slice(0, 2).join(" and ")}`
            : ""}
          . A browsing aid, not a validated prediction.
        </p>
      </details>
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
