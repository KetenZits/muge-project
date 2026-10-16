import Dexie, { type EntityTable } from "dexie";
import type {
  Bookmark,
  Comment,
  Conversation,
  Draft,
  Follow,
  Message,
  Notification,
  Post,
  StoredPostImage,
  TeamRecruitment,
} from "@/types";
export interface Interaction {
  id: string;
  kind: "like" | "teamRequest" | "join" | "eventRsvp";
  itemId: string;
}
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
  postImages: EntityTable<StoredPostImage, "id">;
};
db.version(1).stores({
  posts: "id,createdAt",
  bookmarks: "id,kind,itemId",
  follows: "id,targetId",
  notifications: "id,createdAt,read",
  drafts: "id,updatedAt",
  conversations: "id,updatedAt",
  messages: "id,conversationId,createdAt",
  interactions: "id,kind,itemId",
  comments: "id,postId,createdAt",
});
db.version(2).stores({
  posts: "id,createdAt",
  teams: "id,createdAt",
  bookmarks: "id,kind,itemId",
  follows: "id,targetId",
  notifications: "id,createdAt,read",
  drafts: "id,updatedAt",
  conversations: "id,updatedAt",
  messages: "id,conversationId,createdAt",
  interactions: "id,kind,itemId",
  comments: "id,postId,createdAt",
});
// Additive migration: all v1/v2 tables and records remain untouched.
db.version(3).stores({
  postImages: "id,ownerId,[ownerId+position]",
});

let opening: Promise<void> | null = null;

export function openDemoDatabase(): Promise<void> {
  if (opening) return opening;
  let onBlocked!: () => void;
  const blocked = new Promise<never>((_, reject) => {
    onBlocked = () =>
      reject(
        new Error(
          "Another MU Connect tab is preventing your local database from updating. Close other MU Connect tabs, then try again. Your saved data has not been changed.",
        ),
      );
  });
  db.on("blocked", onBlocked);
  const physicalOpen = Promise.resolve()
    .then(() => db.open())
    .then(() => undefined)
    .catch((error: unknown) => {
      throw new Error(
        "Your local database could not be opened. Check that browser storage is allowed, then try again. Your saved data has not been reset.",
        { cause: error },
      );
    })
    .finally(() => {
      db.on("blocked").unsubscribe(onBlocked);
      opening = null;
    });
  // IndexedDB cannot cancel its native open request. Keep one physical attempt
  // alive, but report its blocked event immediately. Retrying while blocked
  // returns the same error; after the other tab closes, the additive upgrade
  // finishes and a retry can use that connection without racing a second open.
  opening = Promise.race([physicalOpen, blocked]);
  return opening;
}
