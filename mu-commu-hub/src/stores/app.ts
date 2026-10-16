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
  PostCategory,
  TeamRecruitment,
  User,
} from "@/types";
import type { Interaction } from "@/lib/db";
import type { CreatePostOptions } from "@/lib/db/post-repository";
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
import { eventFromPost } from "@/lib/events";
import { restoreDemoProfile } from "@/lib/demo-profile";
import { startMockApi } from "@/lib/demo-startup";
import { openDemoDatabase } from "@/lib/db";
interface AppState {
  sessionStatus: "initializing" | "ready" | "error";
  sessionError: string | null;
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
  composerCategory: PostCategory;
  searchOpen: boolean;
  initializeSession: () => void;
  load: () => Promise<void>;
  setUser: (user: User) => void;
  setCreateOpen: (v: boolean) => void;
  openComposer: (category?: PostCategory) => void;
  setSearchOpen: (v: boolean) => void;
  createPost: (post: Post, options?: CreatePostOptions) => Promise<void>;
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
let loadPromise: Promise<void> | null = null;
export const useApp = create<AppState>((set, get) => ({
  sessionStatus: "initializing",
  sessionError: null,
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
  composerCategory: "General",
  searchOpen: false,
  initializeSession: () => {
    if (get().sessionStatus === "ready") return;
    try {
      const { user, migrated } = restoreDemoProfile(
        localStorage.getItem("mu-connect-user"),
      );
      if (migrated)
        localStorage.setItem("mu-connect-user", JSON.stringify(user));
      set((state) => ({
        user,
        users: state.users.map((person) =>
          person.id === user.id ? user : person,
        ),
        sessionStatus: "ready",
        sessionError: null,
      }));
    } catch {
      set({
        sessionStatus: "error",
        sessionError:
          "Your saved demo profile could not be restored. Allow browser storage for this site, then try again. Your saved profile has not been replaced.",
      });
    }
  },
  load: () => {
    if (loadPromise) return loadPromise;
    set({ ready: false, error: null });
    const controller = new AbortController();
    loadPromise = (async () => {
      await startMockApi();
      // Open once before requests start so blocked upgrades have a recoverable
      // failure path instead of suspending every IndexedDB-backed handler.
      await openDemoDatabase();
      const signal = controller.signal;
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
        userService.getUsers(signal),
        postService.getPosts(signal),
        teamService.getTeams(signal),
        competitionService.getCompetitions(signal),
        eventService.getEvents(signal),
        communityService.getCommunities(signal),
        notificationService.getNotifications(signal),
        messageService.getConversations(signal),
        messageService.getMessages(signal),
        interactionService.getBookmarks(signal),
        interactionService.getInteractions(signal),
        interactionService.getFollows(signal),
      ]);
      // The user may have entered the demo or edited their profile while data
      // was loading. Never restore an older snapshot over those newer actions.
      const user = get().user;
      set({
        ready: true,
        error: null,
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
    })()
      .catch((error: unknown) => {
        controller.abort();
        set({
          error:
            error instanceof Error ? error.message : "Could not load the demo",
          ready: true,
        });
      })
      .finally(() => {
        loadPromise = null;
      });
    return loadPromise;
  },
  setUser: (user) => {
    localStorage.setItem("mu-connect-user", JSON.stringify(user));
    set((state) => ({
      user,
      users: state.users.map((person) =>
        person.id === user.id ? user : person,
      ),
    }));
  },
  updateProfile: (user) => {
    localStorage.setItem("mu-connect-user", JSON.stringify(user));
    set((s) => ({
      user,
      users: s.users.map((u) => (u.id === user.id ? user : u)),
    }));
  },
  setCreateOpen: (createOpen) =>
    set({ createOpen, composerCategory: "General" }),
  openComposer: (composerCategory = "General") =>
    set({ createOpen: true, composerCategory }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  createPost: async (post, options) => {
    const saved = await postService.createPost(post, options);
    const savedTeam =
      options?.team && saved.recruitmentId
        ? await teamService.getTeam(saved.recruitmentId)
        : null;
    const event = eventFromPost(saved);
    set((state) => ({
      posts: [saved, ...state.posts.filter((item) => item.id !== saved.id)],
      teams: savedTeam
        ? [savedTeam, ...state.teams.filter((item) => item.id !== savedTeam.id)]
        : state.teams,
      events: event
        ? [event, ...state.events.filter((item) => item.id !== event.id)]
        : state.events,
    }));
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
      await interactionService.removeBookmark(kind, itemId);
      set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) }));
    } else {
      const bookmark: Bookmark = { id, kind, itemId };
      await interactionService.saveBookmark(bookmark);
      set((s) => ({ bookmarks: [...s.bookmarks, bookmark] }));
    }
  },
  toggleLike: async (id) => {
    const key = `like:${id}`;
    const found = get().interactions.some((i) => i.id === key);
    if (found) {
      await interactionService.removeInteraction("like", id);
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
      await interactionService.unfollow(id);
      set((s) => ({ following: s.following.filter((x) => x !== id) }));
    } else {
      await interactionService.follow({
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
      await interactionService.removeInteraction("join", id);
      set((s) => ({ joinedClubs: s.joinedClubs.filter((x) => x !== id) }));
    } else {
      await interactionService.addInteraction({
        id: `join:${id}`,
        kind: "join",
        itemId: id,
      });
      set((s) => ({ joinedClubs: [...s.joinedClubs, id] }));
    }
  },
  requestTeam: async (id) => {
    if (get().teams.find((team) => team.id === id)?.leaderId === get().user.id)
      return;
    const key = `teamRequest:${id}`;
    if (get().interactions.some((item) => item.id === key)) {
      await interactionService.removeInteraction("teamRequest", id);
      set((state) => ({
        interactions: state.interactions.filter((item) => item.id !== key),
      }));
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
    const key = `eventRsvp:${id}`;
    if (get().interactions.some((item) => item.id === key)) {
      await interactionService.removeInteraction("eventRsvp", id);
      set((state) => ({
        interactions: state.interactions.filter((item) => item.id !== key),
      }));
      return;
    }
    const item = {
      id: `eventRsvp:${id}`,
      kind: "eventRsvp" as const,
      itemId: id,
    };
    await interactionService.addInteraction(item);
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
