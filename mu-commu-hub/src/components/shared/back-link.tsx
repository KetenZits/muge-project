"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { safeReturnTo } from "@/lib/navigation";

export function BackLink({
  fallback,
  label = "Back",
}: {
  fallback: string;
  label?: string;
}) {
  const params = useSearchParams();
  const returnTo = safeReturnTo(params.get("returnTo"), fallback);
  return (
    <Link
      href={returnTo}
      scroll={false}
      className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--blue)]"
    >
      <ArrowLeft size={16} />
      {params.has("returnTo") ? "Back to results" : label}
    </Link>
  );
}
