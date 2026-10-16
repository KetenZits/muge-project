import type {
  Bookmark,
  Club,
  Comment,
  Competition,
  Conversation,
  Event,
  Follow,
  Message,
  Notification,
  Post,
  TeamRecruitment,
  User,
} from "@/types";
import type { Interaction } from "@/lib/db";
import type { CreatePostOptions } from "@/lib/db/post-repository";
import { imageMetadataSchema } from "@/lib/validation/post-images";
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const detail: unknown = await response.json().catch(() => null);
    throw new Error(
      detail &&
        typeof detail === "object" &&
        "error" in detail &&
        typeof detail.error === "string"
        ? detail.error
        : `Request failed (${response.status})`,
    );
  }
  return response.json() as Promise<T>;
}
const post = <T>(path: string, data?: unknown) =>
  request<T>(path, {
    method: "POST",
    body: data === undefined ? undefined : JSON.stringify(data),
  });
export const postService = {
  getPosts: (signal?: AbortSignal) => request<Post[]>("/posts", { signal }),
  getPost: (id: string) => request<Post | null>(`/posts/${id}`),
  createPost: (data: Post, options: CreatePostOptions = {}) => {
    const { images = [], team, draftId } = options;
    const payload = {
      ...data,
      imageIds: images.length ? images.map((image) => image.id) : data.imageIds,
    };
    if (!images.length && !team && !draftId)
      return post<Post>("/posts", payload);
    // MSW intercepts this locally. Binary data never goes through JSON or an upload server.
    const body = new FormData();
    body.set("post", JSON.stringify(payload));
    body.set(
      "imageMetadata",
      JSON.stringify(images.map((image) => imageMetadataSchema.parse(image))),
    );
    for (const image of images)
      body.append("images", image.blob, image.fileName);
    if (team) body.set("team", JSON.stringify(team));
    if (draftId) body.set("draftId", draftId);
    return request<Post>("/posts", { method: "POST", body });
  },
  like: (id: string) => post<{ ok: boolean }>(`/posts/${id}/like`),
  bookmark: (id: string) => post<{ ok: boolean }>(`/posts/${id}/bookmark`),
  getComments: (id: string) => request<Comment[]>(`/comments/${id}`),
  comment: (data: Comment) => post<Comment>("/comments", data),
};
export const userService = {
  getUsers: (signal?: AbortSignal) => request<User[]>("/users", { signal }),
  getUser: (id: string) => request<User | null>(`/users/${id}`),
};
export const teamService = {
  getTeams: (signal?: AbortSignal) =>
    request<TeamRecruitment[]>("/teams", { signal }),
  getTeam: (id: string) => request<TeamRecruitment | null>(`/teams/${id}`),
  createTeam: (team: TeamRecruitment) => post<TeamRecruitment>("/teams", team),
  requestToJoin: (id: string) => post<{ ok: boolean }>(`/teams/${id}/request`),
};
export const competitionService = {
  getCompetitions: (signal?: AbortSignal) =>
    request<Competition[]>("/competitions", { signal }),
  getCompetition: (id: string) =>
    request<Competition | null>(`/competitions/${id}`),
};
export const eventService = {
  getEvents: (signal?: AbortSignal) => request<Event[]>("/events", { signal }),
};
export const communityService = {
  getCommunities: (signal?: AbortSignal) =>
    request<Club[]>("/communities", { signal }),
};
export const notificationService = {
  getNotifications: (signal?: AbortSignal) =>
    request<Notification[]>("/notifications", { signal }),
  read: (id: string) =>
    request<Notification>(`/notifications/${id}/read`, { method: "PATCH" }),
};
export const messageService = {
  getMessages: (signal?: AbortSignal) =>
    request<Message[]>("/messages", { signal }),
  getConversations: (signal?: AbortSignal) =>
    request<Conversation[]>("/conversations", { signal }),
  createConversation: (conversation: Conversation) =>
    post<Conversation>("/conversations", conversation),
  readConversation: (id: string) =>
    request<Conversation>(`/conversations/${id}/read`, { method: "PATCH" }),
  send: (message: Message) => post<Message>("/messages", message),
};
export const interactionService = {
  getBookmarks: (signal?: AbortSignal) =>
    request<Bookmark[]>("/bookmarks", { signal }),
  getInteractions: (signal?: AbortSignal) =>
    request<Interaction[]>("/interactions", { signal }),
  getFollows: (signal?: AbortSignal) =>
    request<Follow[]>("/follows", { signal }),
  saveBookmark: (bookmark: Bookmark) => post<Bookmark>("/bookmarks", bookmark),
  removeBookmark: (kind: Bookmark["kind"], itemId: string) =>
    request<{ ok: boolean }>(`/bookmarks/${kind}/${itemId}`, {
      method: "DELETE",
    }),
  follow: (follow: Follow) => post<Follow>("/follows", follow),
  unfollow: (targetId: string) =>
    request<{ ok: boolean }>(`/follows/${targetId}`, { method: "DELETE" }),
  addInteraction: (interaction: Interaction) =>
    post<Interaction>("/interactions", interaction),
  removeInteraction: (kind: Interaction["kind"], itemId: string) =>
    request<{ ok: boolean }>(`/interactions/${kind}/${itemId}`, {
      method: "DELETE",
    }),
};
