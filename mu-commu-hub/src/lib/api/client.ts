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
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json() as Promise<T>;
}
const post = <T>(path: string, data?: unknown) =>
  request<T>(path, {
    method: "POST",
    body: data === undefined ? undefined : JSON.stringify(data),
  });
export const postService = {
  getPosts: () => request<Post[]>("/posts"),
  getPost: (id: string) => request<Post | null>(`/posts/${id}`),
  createPost: (data: Post) => post<Post>("/posts", data),
  like: (id: string) => post<{ ok: boolean }>(`/posts/${id}/like`),
  bookmark: (id: string) => post<{ ok: boolean }>(`/posts/${id}/bookmark`),
  getComments: (id: string) => request<Comment[]>(`/comments/${id}`),
  comment: (data: Comment) => post<Comment>("/comments", data),
};
export const userService = {
  getUsers: () => request<User[]>("/users"),
  getUser: (id: string) => request<User | null>(`/users/${id}`),
};
export const teamService = {
  getTeams: () => request<TeamRecruitment[]>("/teams"),
  getTeam: (id: string) => request<TeamRecruitment | null>(`/teams/${id}`),
  createTeam: (team: TeamRecruitment) => post<TeamRecruitment>("/teams", team),
  requestToJoin: (id: string) => post<{ ok: boolean }>(`/teams/${id}/request`),
};
export const competitionService = {
  getCompetitions: () => request<Competition[]>("/competitions"),
  getCompetition: (id: string) =>
    request<Competition | null>(`/competitions/${id}`),
};
export const eventService = { getEvents: () => request<Event[]>("/events") };
export const communityService = {
  getCommunities: () => request<Club[]>("/communities"),
};
export const notificationService = {
  getNotifications: () => request<Notification[]>("/notifications"),
  read: (id: string) =>
    request<Notification>(`/notifications/${id}/read`, { method: "PATCH" }),
};
export const messageService = {
  getMessages: () => request<Message[]>("/messages"),
  getConversations: () => request<Conversation[]>("/conversations"),
  createConversation: (conversation: Conversation) =>
    post<Conversation>("/conversations", conversation),
  readConversation: (id: string) =>
    request<Conversation>(`/conversations/${id}/read`, { method: "PATCH" }),
  send: (message: Message) => post<Message>("/messages", message),
};
export const interactionService = {
  getBookmarks: () => request<Bookmark[]>("/bookmarks"),
  getInteractions: () => request<Interaction[]>("/interactions"),
  getFollows: () => request<Follow[]>("/follows"),
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
