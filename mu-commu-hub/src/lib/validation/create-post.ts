import { z } from "zod";
import type { PostCategory } from "@/types";

export const postCategories: PostCategory[] = [
  "General",
  "Friends",
  "Team",
  "Competition",
  "Project",
  "Question",
  "Study",
  "Research",
  "Startup",
  "Technology",
  "Design",
  "Gaming",
  "Sports",
  "Activity",
  "Event",
];

export function isRecruitmentCategory(category: PostCategory): boolean {
  return ["Team", "Competition", "Project"].includes(category);
}

export function parseTeamSize(
  value: string,
): { members: number; capacity: number } | null {
  const match = value.trim().match(/^(\d+)\s*(?:of|\/)\s*(\d+)$/i);
  if (!match) return null;
  const members = Number(match[1]);
  const capacity = Number(match[2]);
  if (members < 1 || capacity < 2 || members >= capacity || capacity > 30) {
    return null;
  }
  return { members, capacity };
}

export const createPostSchema = z
  .object({
    category: z.enum(postCategories),
    title: z.string().trim().min(8, "Use at least 8 characters").max(120),
    content: z
      .string()
      .trim()
      .min(20, "Tell the community a little more")
      .max(2000),
    tags: z.string().max(120),
    competitionId: z.string().optional(),
    roles: z.string().optional(),
    teamSize: z.string().optional(),
    deadline: z.string().optional(),
    mode: z.enum(["Online", "On-site", "Hybrid"]).optional(),
    location: z.string().optional(),
    faculty: z.string().optional(),
    contactMethod: z.string().optional(),
    eventDate: z.string().optional(),
    eventTime: z.string().optional(),
    eventLocation: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.category === "Event") {
      if (
        !data.eventDate ||
        new Date(`${data.eventDate}T23:59:59`).getTime() < Date.now()
      ) {
        context.addIssue({
          code: "custom",
          path: ["eventDate"],
          message: "Choose a future event date",
        });
      }
      if (!data.eventTime) {
        context.addIssue({
          code: "custom",
          path: ["eventTime"],
          message: "Add an event time",
        });
      }
      if (!data.eventLocation?.trim()) {
        context.addIssue({
          code: "custom",
          path: ["eventLocation"],
          message: "Add an event location",
        });
      }
    }
    if (!isRecruitmentCategory(data.category)) return;
    if (!data.roles?.split(",").some((role) => role.trim())) {
      context.addIssue({
        code: "custom",
        path: ["roles"],
        message: "Add at least one open role",
      });
    }
    if (!parseTeamSize(data.teamSize ?? "")) {
      context.addIssue({
        code: "custom",
        path: ["teamSize"],
        message: "Use a valid size such as 1 of 5",
      });
    }
    if (
      !data.deadline ||
      new Date(`${data.deadline}T23:59:59`).getTime() < Date.now()
    ) {
      context.addIssue({
        code: "custom",
        path: ["deadline"],
        message: "Choose a future deadline",
      });
    }
    if (!data.contactMethod?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["contactMethod"],
        message: "Tell students how to contact you",
      });
    }
    if (data.category === "Competition" && !data.competitionId) {
      context.addIssue({
        code: "custom",
        path: ["competitionId"],
        message: "Choose the competition for this recruitment",
      });
    }
  });

export type CreatePostForm = z.infer<typeof createPostSchema>;

export function parseTags(value: string): string[] {
  return [
    ...new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
}
