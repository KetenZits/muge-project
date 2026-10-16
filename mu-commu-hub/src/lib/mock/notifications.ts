import type { Notification } from "@/types";

export const notifications: Notification[] = Array.from(
  { length: 30 },
  (_, i) => ({
    id: `n${i + 1}`,
    category: (
      ["Teams", "Follows", "Mentions", "Competitions", "System"] as const
    )[i % 5],
    title: [
      "Sample team invitation",
      "Sample follower notification",
      "Sample discussion mention",
      "Sample competition reminder",
      "Welcome to your local demo",
    ][i % 5],
    body: [
      "Explore AI Study Companion in this demo. No invitation was delivered.",
      "Explore a sample student profile. Follows are stored on this device.",
      "Open a sample discussion. This is an example notification.",
      "Review the Campus AI Challenge sample and its deadline.",
      "Your posts, requests, and messages stay in this browser.",
    ][i % 5],
    createdAt: new Date(Date.now() - i * 1900000).toISOString(),
    read: i > 4,
    userId: `u${(i % 39) + 1}`,
    href: ["/teams/t1", "/people", "/posts/p1", "/competitions/c1", "/me"][
      i % 5
    ],
  }),
);
