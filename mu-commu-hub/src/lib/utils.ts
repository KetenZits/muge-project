export { cn } from "cn";
import {
  formatDistanceToNow,
  format,
  differenceInCalendarDays,
} from "date-fns";
export { peopleMatchScore as matchScore } from "./discovery";
export const relative = (date: string) =>
  formatDistanceToNow(new Date(date), { addSuffix: true });
export const shortDate = (date: string) =>
  format(new Date(date), "MMM d, yyyy");
export const deadline = (date: string) => {
  const days = differenceInCalendarDays(new Date(date), new Date());
  return days < 0
    ? "Closed"
    : days === 0
      ? "Today"
      : days === 1
        ? "Tomorrow"
        : `${days} days left`;
};
