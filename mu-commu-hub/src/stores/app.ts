import { create } from "zustand";
import type {
  Bookmark,
  Club,
  Comment,
  Competition,
  Conversation,
  Event,
  Message,
  Notification,
  Post,
  TeamRecruitment,
  User,
} from "@/types";
import type { Interaction } from "@/lib/db";
import { db } from "@/lib/db";
import {
  communityService,
  competitionService,
  eventService,
  interactionService,
  messageService,
  notificationService,
  postService,
  teamService,
  userService,
} from "@/lib/api/client";
import { demoUser } from "@/lib/mock/data";
interface AppState {
  ready: boolean;
  error: string | null;
  user: User;
  users: User[];
  posts: Post[];
  teams: TeamRecruitment[];
  competitions: Competition[];
  events: Event[];
  clubs: Club[];
  notifications: Notification[];
  conversations: Conversation[];
  messages: Message[];
  bookmarks: Bookmark[];
  interactions: Interaction[];
  following: string[];
  joinedClubs: string[];
  createOpen: boolean;
  searchOpen: boolean;
  load: () => Promise<void>;
  setUser: (user: User) => void;
  setCreateOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  createPost: (post: Post) => Promise<void>;
  createTeam: (team: TeamRecruitment) => Promise<void>;
  addComment: (comment: Comment) => Promise<void>;
  toggleBookmark: (kind: Bookmark["kind"], itemId: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  toggleFollow: (id: string) => Promise<void>;
  toggleClub: (id: string) => Promise<void>;
  requestTeam: (id: string) => Promise<void>;
  rsvp: (id: string) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  sendMessage: (message: Message) => Promise<void>;
  startConversation: (targetId: string) => Promise<string>;
  openConversation: (id: string) => Promise<void>;
  updateProfile: (user: User) => void;
}
export const useApp = create<AppState>((set, get) => ({
  ready: false,
  error: null,
  user: demoUser,
  users: [],
  posts: [],
  teams: [],
  competitions: [],
  events: [],
  clubs: [],
  notifications: [],
  conversations: [],
  messages: [],
  bookmarks: [],
  interactions: [],
  following: [],
  joinedClubs: [],
  createOpen: false,
  searchOpen: false,
  load: async () => {
    try {
      const [
        users,
        posts,
        teams,
        competitions,
        events,
        clubs,
        notifications,
        conversations,
        messages,
        bookmarks,
        interactions,
        follows,
      ] = await Promise.all([
        userService.getUsers(),
        postService.getPosts(),
        teamService.getTeams(),
        competitionService.getCompetitions(),
        eventService.getEvents(),
        communityService.getCommunities(),
        notificationService.getNotifications(),
        messageService.getConversations(),
        messageService.getMessages(),
        interactionService.getBookmarks(),
        interactionService.getInteractions(),
        db.follows.toArray(),
      ]);
      const stored = localStorage.getItem("mu-connect-user");
      const user = stored
        ? { ...demoUser, ...(JSON.parse(stored) as Partial<User>) }
        : demoUser;
      set({
        ready: true,
        error: null,
        user,
        users: users.map((u) => (u.id === user.id ? user : u)),
        posts,
        teams,
        competitions,
        events,
        clubs,
        notifications,
        conversations,
        messages,
        bookmarks,
        interactions,
        following: follows.map((f) => f.targetId),
        joinedClubs: interactions
          .filter((i) => i.kind === "join")
          .map((i) => i.itemId),
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Could not load the demo",
        ready: true,
      });
    }
  },
  setUser: (user) => {
    localStorage.setItem("mu-connect-user", JSON.stringify(user));
    set((state) => ({
      user,
      users: state.users.map((person) => (person.id === user.id ? user : person)),
    }));
  },
  updateProfile: (user) => {
    localStorage.setItem("mu-connect-user", JSON.stringify(user));
    set((s) => ({
      user,
      users: s.users.map((u) => (u.id === user.id ? user : u)),
    }));
  },
  setCreateOpen: (createOpen) => set({ createOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  createPost: async (post) => {
    await postService.createPost(post);
    set((s) => ({ posts: [post, ...s.posts] }));
  },
  createTeam: async (team) => {
    await teamService.createTeam(team);
    set((s) => ({ teams: [team, ...s.teams] }));
  },
  addComment: async (comment) => {
    await postService.comment(comment);
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === comment.postId
          ? { ...post, comments: post.comments + 1 }
          : post,
      ),
    }));
  },
  toggleBookmark: async (kind, itemId) => {
    const id = `${kind}:${itemId}`;
    const found = get().bookmarks.some((b) => b.id === id);
    if (found) {
      await db.bookmarks.delete(id);
      set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) }));
    } else {
      const bookmark: Bookmark = { id, kind, itemId };
      if (kind === "posts") await postService.bookmark(itemId);
      else await db.bookmarks.put(bookmark);
      set((s) => ({ bookmarks: [...s.bookmarks, bookmark] }));
    }
  },
  toggleLike: async (id) => {
    const key = `like:${id}`;
    const found = get().interactions.some((i) => i.id === key);
    if (found) {
      await db.interactions.delete(key);
      set((s) => ({
        interactions: s.interactions.filter((i) => i.id !== key),
      }));
    } else {
      await postService.like(id);
      set((s) => ({
        interactions: [
          ...s.interactions,
          { id: key, kind: "like", itemId: id },
        ],
      }));
    }
  },
  toggleFollow: async (id) => {
    const found = get().following.includes(id);
    if (found) {
      await db.follows.delete(`follow:${id}`);
      set((s) => ({ following: s.following.filter((x) => x !== id) }));
    } else {
      await db.follows.put({
        id: `follow:${id}`,
        userId: get().user.id,
        targetId: id,
      });
      set((s) => ({ following: [...s.following, id] }));
    }
  },
  toggleClub: async (id) => {
    const found = get().joinedClubs.includes(id);
    if (found) {
      await db.interactions.delete(`join:${id}`);
      set((s) => ({ joinedClubs: s.joinedClubs.filter((x) => x !== id) }));
    } else {
      await db.interactions.put({ id: `join:${id}`, kind: "join", itemId: id });
      set((s) => ({ joinedClubs: [...s.joinedClubs, id] }));
    }
  },
  requestTeam: async (id) => {
    if (
      get().interactions.some((item) => item.id === `teamRequest:${id}`) ||
      get().teams.find((team) => team.id === id)?.leaderId === get().user.id
    ) {
      return;
    }
    await teamService.requestToJoin(id);
    set((s) => ({
      interactions: [
        ...s.interactions,
        { id: `teamRequest:${id}`, kind: "teamRequest", itemId: id },
      ],
    }));
  },
  rsvp: async (id) => {
    if (get().interactions.some((item) => item.id === `eventRsvp:${id}`)) {
      return;
    }
    const item = {
      id: `eventRsvp:${id}`,
      kind: "eventRsvp" as const,
      itemId: id,
    };
    await db.interactions.put(item);
    set((s) => ({ interactions: [...s.interactions, item] }));
  },
  markRead: async (id) => {
    await notificationService.read(id);
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  },
  markAllRead: async () => {
    await Promise.all(
      get()
        .notifications.filter((n) => !n.read)
        .map((n) => notificationService.read(n.id)),
    );
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
  sendMessage: async (message) => {
    await messageService.send(message);
    set((state) => ({
      messages: [...state.messages, message],
      conversations: state.conversations.map((conversation) =>
        conversation.id === message.conversationId
          ? { ...conversation, updatedAt: message.createdAt, unread: 0 }
          : conversation,
      ),
    }));
  },
  startConversation: async (targetId) => {
    const current = get();
    const existing = current.conversations.find(
      (conversation) =>
        conversation.participantIds.includes(current.user.id) &&
        conversation.participantIds.includes(targetId),
    );
    if (existing) return existing.id;
    if (!current.users.some((person) => person.id === targetId)) {
      throw new Error("Student not found");
    }
    const conversation: Conversation = {
      id: `cv-local-${crypto.randomUUID()}`,
      participantIds: [current.user.id, targetId],
      updatedAt: new Date().toISOString(),
      unread: 0,
    };
    await messageService.createConversation(conversation);
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    }));
    return conversation.id;
  },
  openConversation: async (id) => {
    const conversation = get().conversations.find((item) => item.id === id);
    if (!conversation?.unread) return;
    await messageService.readConversation(id);
    set((state) => ({
      conversations: state.conversations.map((item) =>
        item.id === id ? { ...item, unread: 0 } : item,
      ),
    }));
  },
}));
