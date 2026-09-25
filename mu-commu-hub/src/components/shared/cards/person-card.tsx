"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Check, Sparkles, UserPlus } from "lucide-react";
import { Avatar, Button, Modal, Tag } from "@/components/ui";
import { matchScore } from "@/lib/utils";
import { motionTiming } from "@/lib/motion/config";
import { useCardMotion } from "@/lib/motion/use-card-motion";
import { useApp } from "@/stores/app";
import type { User } from "@/types";

export function PersonCard({ person }: { person: User }) {
  const cardMotion = useCardMotion({ reveal: true });
  const reducedMotion = useReducedMotion();
  const { user, following, toggleFollow, teams, setCreateOpen } = useApp();
  const mutual = person.interests.filter((x) => user.interests.includes(x));
  const score = matchScore(user, person);
  const followed = following.includes(person.id);
  const myTeams = teams.filter((team) => team.leaderId === user.id);
  const [inviteOpen, setInviteOpen] = useState(false);
  const router = useRouter();
  return (
    <motion.article {...cardMotion} className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <Avatar user={person} size="lg" />
        <motion.span
          className="chip gold"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : motionTiming.normal,
            delay: reducedMotion ? 0 : 0.1,
          }}
        >
          <Sparkles size={11} /> {score}% match
        </motion.span>
      </div>
      <Link
        href={`/profile/${person.username}`}
        className="mt-4 text-base font-bold hover:text-[#17468c]"
      >
        {person.name}
      </Link>
      <p className="mt-1 text-xs text-[#8a9aab]">
        {person.major} · Year {person.year}
      </p>
      <p className="line-clamp-2 mt-3 min-h-10 text-xs leading-5 text-[#68788c]">
        {person.bio}
      </p>
      <p className="mt-2 text-xs text-[#8190a3]">{person.faculty}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {person.skills.slice(0, 3).map((x) => (
          <Tag key={x}>{x}</Tag>
        ))}
      </div>
      <p className="mt-3 text-xs text-[#708197]">
        Open to {person.availability.slice(0, 2).join(" and ")}
      </p>
      <p className="mt-4 text-xs font-semibold text-[#17468c]">
        {mutual.length} interests in common
      </p>
      <p className="mt-1 line-clamp-2 min-h-7 text-[11px] text-[#8b9aac]">
        {mutual.slice(0, 3).join(" · ") ||
          "Meet someone with a fresh perspective"}
      </p>
      {mutual.length > 3 && (
        <span className="text-[11px] text-[#8b9aac]">
          +{mutual.length - 3} more shared interests
        </span>
      )}
      <div className="mt-auto flex gap-2 pt-4">
        <Button
          variant={followed ? "secondary" : "primary"}
          size="sm"
          onClick={() => toggleFollow(person.id)}
          className="flex-1"
        >
          <motion.span
            key={followed ? "following" : "follow"}
            className="inline-flex items-center gap-1"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={motionTiming.quickSpring}
          >
            {followed ? <Check size={14} /> : <UserPlus size={14} />}
            {followed ? "Following" : "Follow"}
          </motion.span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push(`/messages?user=${person.id}`)}
        >
          Message
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full"
        onClick={() => setInviteOpen(true)}
      >
        Invite to team
      </Button>
      <Modal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title={`Invite ${person.name.split(" ")[0]} to a team`}
        description="Start a conversation with a specific project invitation."
      >
        {myTeams.length ? (
          <div className="space-y-2">
            {myTeams.map((team) => (
              <Link
                key={team.id}
                href={`/messages?user=${person.id}&invite=${team.id}`}
                onClick={() => setInviteOpen(false)}
                className="block rounded-xl border border-[#e4ebf3] p-4 text-sm font-semibold hover:border-[#17468c] hover:text-[#17468c]"
              >
                {team.title}
              </Link>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-[#708197]">
              Create a recruitment post first, then invite students to your
              team.
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                setInviteOpen(false);
                setCreateOpen(true);
              }}
            >
              Create a team
            </Button>
          </div>
        )}
      </Modal>
    </motion.article>
  );
}
