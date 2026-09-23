import Dexie, { type EntityTable } from "dexie";
import type { Bookmark, Comment, Conversation, Draft, Follow, Message, Notification, Post, TeamRecruitment } from "@/types";
export interface Interaction { id: string; kind: "like" | "teamRequest" | "join" | "eventRsvp"; itemId: string; }
export const db = new Dexie("mu-connect-prototype") as Dexie & {
  posts: EntityTable<Post, "id">;
  teams: EntityTable<TeamRecruitment, "id">;
  bookmarks: EntityTable<Bookmark, "id">;
  follows: EntityTable<Follow, "id">;
  notifications: EntityTable<Notification, "id">;
  drafts: EntityTable<Draft, "id">;
  conversations: EntityTable<Conversation, "id">;
  messages: EntityTable<Message, "id">;
  interactions: EntityTable<Interaction, "id">;
  comments: EntityTable<Comment, "id">;
};
db.version(1).stores({ posts: "id,createdAt", bookmarks: "id,kind,itemId", follows: "id,targetId", notifications: "id,createdAt,read", drafts: "id,updatedAt", conversations: "id,updatedAt", messages: "id,conversationId,createdAt", interactions: "id,kind,itemId", comments: "id,postId,createdAt" });
db.version(2).stores({ posts: "id,createdAt", teams: "id,createdAt", bookmarks: "id,kind,itemId", follows: "id,targetId", notifications: "id,createdAt,read", drafts: "id,updatedAt", conversations: "id,updatedAt", messages: "id,conversationId,createdAt", interactions: "id,kind,itemId", comments: "id,postId,createdAt" });
