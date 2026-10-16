import { demoUser } from "@/lib/mock/users";
import type { User } from "@/types";

// Only the untouched former seed is migrated. A customized profile wins in full.
const legacySeed = {
  id: "u0",
  username: "thanapon.dev",
  name: "Thanapon Chaiyasit",
  initials: "TC",
  faculty: "Information Technology",
  major: "Software Engineering",
  year: 1,
  bio: "Building useful things with code. Always up for a hackathon, a new idea, or a good cup of coffee.",
  skills: ["Next.js", "TypeScript", "React", "Python", "UI Design"],
  interests: [
    "Artificial Intelligence",
    "Web Development",
    "Startup",
    "Hackathons",
    "Design",
  ],
  availability: ["Hackathons", "Projects", "Startups"],
  avatarColor: "#DDE9FA",
  followersCount: 12,
  followingCount: 0,
  achievements: ["MU Innovation Hackathon 2025 finalist"],
  role: "student",
};

export function restoreDemoProfile(serialized: string | null): {
  user: User;
  migrated: boolean;
} {
  if (!serialized) return { user: demoUser, migrated: false };
  let stored: unknown;
  try {
    stored = JSON.parse(serialized);
  } catch {
    return { user: demoUser, migrated: false };
  }
  if (!stored || typeof stored !== "object" || Array.isArray(stored))
    return { user: demoUser, migrated: false };
  const profile = stored as Partial<User>;
  const untouched =
    Object.keys(profile).every((key) => Object.hasOwn(legacySeed, key)) &&
    Object.entries(legacySeed).every(
      ([key, value]) =>
        JSON.stringify(
          profile[key as keyof User] ??
            (key === "role" ? "student" : undefined),
        ) === JSON.stringify(value),
    );
  if (untouched) return { user: { ...demoUser }, migrated: true };
  return { user: { ...demoUser, ...profile }, migrated: false };
}
