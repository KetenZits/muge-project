"use client";

import { useId, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Button, inputClass } from "@/components/ui";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AnimatedContent from "@/components/AnimatedContent";
import { motionTiming } from "@/lib/motion/config";

export function Segmented({
  options,
  value,
  setValue,
  label = "Choose a view",
}: {
  options: string[];
  value: string;
  setValue: (value: string) => void;
  label?: string;
}) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  return (
    <LayoutGroup id={id}>
      <div
        role="group"
        aria-label={label}
        className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-[#e5ecf3] bg-white p-1"
      >
        {options.map((option) => {
          const active = option === value;
          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => setValue(option)}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              aria-pressed={active}
              className={`relative isolate min-h-11 shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${active ? "text-white" : "text-[#68778c] hover:bg-[#f4f7fb]"}`}
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
              <span className="inline-flex items-center gap-2">
                {option}
                {active && <Check size={14} aria-hidden="true" />}
              </span>
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
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label?: string;
}) {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label ?? placeholder.replace(/\.\.\.$/, "")}
      </label>
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aabba]"
      />
      <input
        id={id}
        type="search"
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
      <h2 className="section-heading">{title}</h2>
      <Link
        href={href}
        className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#17468c]"
      >
        View all <ArrowRight size={12} className="inline" />
      </Link>
    </div>
  );
}

const subscribeMobile = (callback: () => void) => {
  const media = window.matchMedia("(max-width: 639px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
export function ResultGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatedContent
      trigger="mount"
      distance={6}
      duration={0.24}
      initialOpacity={0.85}
      className={"result-grid directory-results " + className}
    >
      {children}
    </AnimatedContent>
  );
}

export function FilterDisclosure({
  children,
  count = 0,
}: {
  children: React.ReactNode;
  count?: number;
}) {
  const mobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false,
  );
  const [open, setOpen] = useState(false);
  if (mobile)
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="secondary" className="mt-4">
            <SlidersHorizontal size={16} />
            More filters{count > 0 && ` (${count} applied)`}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[88svh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-[max(20px,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="p-0 pr-8">
            <SheetTitle>Refine your search</SheetTitle>
            <SheetDescription>
              Results update as you choose filters.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-3">{children}</div>
          <Button onClick={() => setOpen(false)}>Show results</Button>
        </SheetContent>
      </Sheet>
    );
  return (
    <details className="group mt-4 border-t border-[#e5ebf2] pt-2">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-[#17468c] [&::-webkit-details-marker]:hidden">
        <SlidersHorizontal size={16} /> More filters
        {count > 0 && ` (${count} applied)`}
        <ChevronDown
          size={16}
          className="ml-auto transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="grid gap-3 pt-3 sm:grid-cols-2">{children}</div>
    </details>
  );
}

export function AppliedFilters({
  items,
  onReset,
}: {
  items: { label: string; onRemove: () => void }[];
  onReset: () => void;
}) {
  if (!items.length) return null;
  return (
    <div
      className="mt-4 flex flex-wrap items-center gap-2"
      aria-label="Applied filters"
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.onRemove}
          className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl bg-[#eaf1fc] px-3 text-left text-xs font-semibold text-[#17468c]"
          aria-label={`Remove ${item.label} filter`}
        >
          <span className="[overflow-wrap:anywhere]">{item.label}</span>
          <X size={14} className="shrink-0" />
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="min-h-11 px-2 text-sm font-semibold text-[#17468c] underline underline-offset-4"
      >
        Reset filters
      </button>
    </div>
  );
}
