"use client";

import { useId } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { inputClass } from "@/components/ui";
import { motionTiming } from "@/lib/motion/config";

export function Segmented({
  options,
  value,
  setValue,
}: {
  options: string[];
  value: string;
  setValue: (value: string) => void;
}) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  return (
    <LayoutGroup id={id}>
      <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-[#e5ecf3] bg-white p-1">
        {options.map((option) => {
          const active = option === value;
          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => setValue(option)}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              aria-pressed={active}
              className={`relative isolate shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${active ? "text-white" : "text-[#7b8ba0] hover:bg-[#f4f7fb]"}`}
            >
              {active && (
                <motion.span
                  layoutId="segmented-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-[#17468c]"
                  transition={
                    reducedMotion ? { duration: 0 } : motionTiming.softSpring
                  }
                />
              )}
              {option}
            </motion.button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aabba]"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass + " pl-11"}
        placeholder={placeholder}
      />
    </div>
  );
}

export function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="section-title">{title}</h2>
      <Link href={href} className="text-xs font-bold text-[#17468c]">
        View all <ArrowRight size={12} className="inline" />
      </Link>
    </div>
  );
}
