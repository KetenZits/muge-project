export type WorkMode = "Online" | "On-site" | "Hybrid";

export interface TeamRole {
  name: string;
  filled: boolean;
}

export interface TeamRecruitment {
  id: string;
  title: string;
  leaderId: string;
  competitionId?: string;
  description: string;
  roles: TeamRole[];
  skills: string[];
  members: number;
  memberIds?: string[];
  capacity: number;
  deadline: string;
  mode: WorkMode;
  location: string;
  faculty?: string;
  contactMethod?: string;
  objectives?: string[];
  createdAt: string;
}
