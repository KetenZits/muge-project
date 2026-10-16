export type Role = "student" | "organizer" | "admin";

export interface User {
  id: string;
  username: string;
  name: string;
  initials: string;
  faculty: string;
  major: string;
  year: number;
  bio: string;
  skills: string[];
  interests: string[];
  availability: string[];
  avatarColor: string;
  followersCount: number;
  followingCount: number;
  achievements?: string[];
  role?: Role;
  email?: string;
  displayRole?: string;
}

export interface Profile extends User {
  achievements: string[];
  projects: string[];
}

export interface Interest {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Follow {
  id: string;
  userId: string;
  targetId: string;
}
