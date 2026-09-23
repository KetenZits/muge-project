import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, differenceInCalendarDays } from "date-fns";
import type { User } from "@/types";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const relative = (date: string) => formatDistanceToNow(new Date(date), { addSuffix: true });
export const shortDate = (date: string) => format(new Date(date), "MMM d, yyyy");
export const deadline = (date: string) => { const days = differenceInCalendarDays(new Date(date), new Date()); return days < 0 ? "Closed" : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days left`; };
export const matchScore = (me: User, other: User) => { const commonInterests = other.interests.filter(x => me.interests.includes(x)).length; const commonSkills = other.skills.filter(x => me.skills.includes(x)).length; const score = commonInterests * 3 + commonSkills * 2 + (me.faculty === other.faculty ? 2 : 0) + (other.availability.length ? 2 : 0); return Math.min(98, Math.max(52, 52 + score * 3)); };
