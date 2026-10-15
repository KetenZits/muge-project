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
  | "Event"
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
  imageIds?: string[];
  recruitmentId?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventHost?: string;
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
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  updatedAt: string;
  imageIds?: string[];
}

export interface PostImageMetadata {
  id: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  createdAt: string;
}

/** Composer data only. Never JSON-serialize the binary field. */
export interface PreparedPostImage extends PostImageMetadata {
  blob: Blob;
}

export interface StoredPostImage extends PreparedPostImage {
  ownerId: string;
  position: number;
}

export interface Bookmark {
  id: string;
  kind: "posts" | "teams" | "competitions" | "events";
  itemId: string;
}
