import { Button as ShadcnButton } from "./button";
import { Avatar as ShadcnAvatar, AvatarFallback } from "./avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Badge } from "./badge";
import { Card } from "./card";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <ShadcnButton
      {...props}
      variant={
        variant === "secondary"
          ? "outline"
          : variant === "ghost"
            ? "ghost"
            : "default"
      }
      size={size === "md" ? "default" : size}
      className={cn(
        "rounded-xl font-semibold transition-all duration-200 active:scale-[.98]",
        size === "sm"
          ? "min-h-9 px-3 text-xs"
          : size === "lg"
            ? "min-h-12 px-6 text-sm"
            : "min-h-10 px-4 text-sm",
        variant === "primary"
          ? "bg-[#17468c] text-white hover:bg-[#0f3672] shadow-[0_4px_12px_#17468c20]"
          : variant === "secondary"
            ? "border border-[#dce5ef] bg-white text-[#17468c] hover:bg-[#f5f8fc]"
            : variant === "gold"
              ? "bg-[#fac334] text-[#4c390c] hover:bg-[#eeb622]"
              : "text-[#60728a] hover:bg-[#eef3f9] hover:text-[#17468c]",
        className,
      )}
    >
      {children}
    </ShadcnButton>
  );
}
export function Avatar({
  user,
  size = "md",
}: {
  user?: User;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const pixels =
    size === "sm" ? 36 : size === "lg" ? 52 : size === "xl" ? 96 : 44;
  return (
    <ShadcnAvatar
      className="border-2 border-white font-bold text-[#17468c]"
      style={{ width: pixels, height: pixels }}
    >
      <AvatarFallback
        className={cn(
          "font-bold text-[#17468c]",
          size === "xl" ? "text-2xl" : "text-xs",
        )}
        style={{ background: user?.avatarColor ?? "#dce8f8" }}
      >
        {user?.initials ?? "MU"}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#33445c]">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}
export const inputClass =
  "w-full min-h-11 rounded-xl border border-[#dae3ed] bg-white px-4 text-sm text-[#17263c] outline-none transition focus:border-[#17468c] focus:ring-3 focus:ring-[#17468c20] placeholder:text-[#9aa8ba]";
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[92vh] w-[calc(100%-24px)] max-w-xl overflow-y-auto rounded-[22px] border border-[#dce5ef] bg-white p-6 shadow-2xl sm:p-8",
          className,
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#718096]">
            {description ?? title}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef4fb] text-[#17468c]">
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#718096]">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#a5812d]">
            {eyebrow}
          </p>
        )}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
export function Tag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "gold" | "green" | "rose";
}) {
  return (
    <Badge
      variant="secondary"
      className={cn("chip", tone !== "neutral" && tone)}
    >
      {children}
    </Badge>
  );
}
export function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} className="card p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/5" />
            </div>
          </div>
          <Skeleton className="mt-6 h-5 w-3/4" />
          <Skeleton className="mt-3 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
        </Card>
      ))}
    </div>
  );
}
