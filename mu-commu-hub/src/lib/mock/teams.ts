import { faker } from "@faker-js/faker";
import type { TeamRecruitment } from "@/types";
import { skills } from "./users";

faker.seed(231106);

const teamNames = [
  "AI Study Companion",
  "Campus Food Rescue",
  "Robotics Lab Crew",
  "Digital Health Builders",
  "Cyber CTF Squad",
  "Green Mobility Team",
  "Student Marketplace",
  "Open Data Collective",
  "Design for Good",
  "Smart Farming Lab",
  "Game Jam Guild",
  "Future Founders",
  "Climate Tech Team",
  "AR Campus Guide",
  "Wellness App Crew",
];

export const teams: TeamRecruitment[] = teamNames.map((title, i) => ({
  id: `t${i + 1}`,
  title,
  leaderId: `u${i + 1}`,
  competitionId: `c${(i % 12) + 1}`,
  description: [
    "We have a clear direction and are looking for teammates who want to build, learn, and present something meaningful.",
    "A friendly cross-faculty team turning an idea into a real prototype. Come bring your perspective.",
  ][i % 2],
  roles: [
    { name: "Frontend Developer", filled: i % 2 === 0 },
    { name: "Backend Developer", filled: i % 3 === 0 },
    { name: "UI/UX Designer", filled: false },
    { name: "Pitch Lead", filled: i % 4 === 0 },
  ],
  skills: faker.helpers.arrayElements(skills, { min: 2, max: 4 }),
  members: 2 + (i % 3),
  memberIds: Array.from(
    { length: 2 + (i % 3) },
    (_, memberIndex) => `u${((i + memberIndex) % 39) + 1}`,
  ),
  capacity: 5,
  deadline: new Date(Date.now() + (i + 3) * 86400000).toISOString(),
  mode: (["Hybrid", "Online", "On-site"] as const)[i % 3],
  location: i % 3 === 1 ? "Online" : "Main Campus",
  contactMethod: "MU Connect messages",
  objectives: [
    `Build and test an initial ${title.toLowerCase()} prototype.`,
    "Present the team's work at the linked competition.",
  ],
  createdAt: new Date(Date.now() - i * 7200000).toISOString(),
}));
