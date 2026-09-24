export type PostCategory =
  | "General"
  | "Friends"
  | "Team"
  | "Competition"
  | "Project"
  | "Study"
  | "Research"
  | "Startup"
  | "Technology"
  | "Design"
  | "Gaming"
  | "Sports"
  | "Activity"
  | "Question";

export interface Post {
  id: string;
  authorId: string;
  category: PostCategory;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  image?: string;
  recruitmentId?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Draft {
  id: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  competitionId?: string;
  roles?: string;
  teamSize?: string;
  deadline?: string;
  mode?: "Online" | "On-site" | "Hybrid";
  location?: string;
  faculty?: string;
  contactMethod?: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  kind: "posts" | "teams" | "competitions" | "events";
  itemId: string;
}
