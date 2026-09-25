"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useCardMotion } from "@/lib/motion/use-card-motion";
import { Button, Tag } from "@/components/ui";
import { useApp } from "@/stores/app";
import type { Club } from "@/types";

export function ClubCard({ club }: { club: Club }) {
  const cardMotion = useCardMotion();
  const { joinedClubs, toggleClub } = useApp();
  const joined = joinedClubs.includes(club.id);
  return (
    <motion.article {...cardMotion} className="card overflow-hidden">
      <div
        className="relative flex h-24 items-center px-5"
        style={{ background: club.color }}
      >
        <span className="text-5xl font-light text-[#17468c]">{club.icon}</span>
        <div className="absolute -right-4 -top-10 h-32 w-32 rounded-full border-[24px] border-white/20" />
      </div>
      <div className="p-5">
        <Link
          href={`/communities/${club.slug}`}
          className="text-lg font-bold hover:text-[#17468c]"
        >
          {club.name}
        </Link>
        <p className="mt-2 min-h-10 text-xs leading-5 text-[#708096]">
          {club.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {club.tags.map((x) => (
            <Tag key={x}>{x}</Tag>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-[#ecf1f5] pt-4">
          <span className="text-xs text-[#8c9bab]">
            {club.members.toLocaleString()} members
          </span>
          <Button
            size="sm"
            variant={joined ? "secondary" : "primary"}
            onClick={() => toggleClub(club.id)}
          >
            {joined ? "Joined ✓" : "Join community"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
