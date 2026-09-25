import type { Club } from "@/types";
import { colors, interests } from "./users";

export const clubs: Club[] = [
  "AI Collective",
  "Web Builders",
  "Game Dev Society",
  "Startup Circle",
  "Design Studio",
  "Photography Walks",
  "Robotics Lab",
  "Cyber Crew",
  "Data Lab",
].map((name, i) => ({
  id: `club${i + 1}`,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  name,
  description: [
    "A place to learn, share projects, and meet your next collaborator.",
    "Meet curious students, exchange ideas, and build something together.",
  ][i % 2],
  members: 120 + i * 67,
  activePosts: 12 + i * 5,
  tags: [
    interests[i % interests.length],
    interests[(i + 2) % interests.length],
  ],
  icon: ["✦", "⌘", "◈", "✳", "◐", "◉", "⬡", "◇", "▦"][i],
  color: colors[i % colors.length],
}));
