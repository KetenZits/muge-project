import type { Notification } from "@/types";

export const notifications: Notification[] = Array.from(
  { length: 30 },
  (_, i) => ({
    id: `n${i + 1}`,
    category: (
      ["Teams", "Follows", "Mentions", "Competitions", "System"] as const
    )[i % 5],
    title: [
      "New team invitation",
      "You have a new follower",
      "You were mentioned",
      "Deadline coming up",
      "Welcome to MU Connect",
    ][i % 5],
    body: [
      "Pimchanok invited you to join AI Study Companion.",
      "Nicha started following your projects.",
      "Someone mentioned you in a discussion.",
      "Campus AI Challenge closes soon.",
      "Make your profile shine and find your people.",
    ][i % 5],
    createdAt: new Date(Date.now() - i * 1900000).toISOString(),
    read: i > 4,
    userId: `u${(i % 39) + 1}`,
  }),
);
