import { http, HttpResponse } from "msw";
import { db } from "@/lib/db";
import { clubs, comments, competitions, conversations, events, messages, notifications, posts, teams, users } from "@/lib/mock/data";
import type { Comment, Message, Notification, Post, TeamRecruitment } from "@/types";
const json = (data: unknown) => HttpResponse.json(data as never);
const id = (v: string | readonly string[] | undefined) => String(v ?? "");
export const handlers = [
  http.get("/api/posts", async () => json([...(await db.posts.toArray()), ...posts])),
  http.get("/api/posts/:id", async ({ params }) => json((await db.posts.get(id(params.id))) ?? posts.find(p => p.id === params.id) ?? null)),
  http.post("/api/posts", async ({ request }) => { const post = await request.json() as Post; await db.posts.put(post); return json(post); }),
  http.get("/api/users", () => json(users)),
  http.get("/api/users/:id", ({ params }) => json(users.find(u => u.id === params.id || u.username === params.id) ?? null)),
  http.get("/api/teams", async () => json([...(await db.teams.toArray()), ...teams])),
  http.get("/api/teams/:id", async ({ params }) => json((await db.teams.get(id(params.id))) ?? teams.find(t => t.id === params.id) ?? null)),
  http.post("/api/teams", async ({ request }) => { const team = await request.json() as TeamRecruitment; await db.teams.put(team); return json(team); }),
  http.post("/api/teams/:id/request", async ({ params }) => { const itemId = id(params.id); await db.interactions.put({ id: `teamRequest:${itemId}`, kind: "teamRequest", itemId }); return json({ ok: true }); }),
  http.get("/api/competitions", () => json(competitions)),
  http.get("/api/competitions/:id", ({ params }) => json(competitions.find(c => c.id === params.id) ?? null)),
  http.get("/api/events", () => json(events)),
  http.get("/api/communities", () => json(clubs)),
  http.get("/api/notifications", async () => { const updates = await db.notifications.toArray(); return json(notifications.map(n => updates.find(x => x.id === n.id) ?? n)); }),
  http.patch("/api/notifications/:id/read", async ({ params }) => { const seed = notifications.find(n => n.id === params.id); if (!seed) return HttpResponse.json({ error: "Not found" }, { status: 404 }); const changed: Notification = { ...seed, read: true }; await db.notifications.put(changed); return json(changed); }),
  http.get("/api/messages", async () => json([...(await db.messages.toArray()), ...messages])),
  http.post("/api/messages", async ({ request }) => { const message = await request.json() as Message; await db.messages.put(message); return json(message); }),
  http.get("/api/conversations", async () => json([...(await db.conversations.toArray()), ...conversations])),
  http.get("/api/bookmarks", async () => json(await db.bookmarks.toArray())),
  http.post("/api/posts/:id/bookmark", async ({ params }) => { const itemId = id(params.id); await db.bookmarks.put({ id: `posts:${itemId}`, kind: "posts", itemId }); return json({ ok: true }); }),
  http.post("/api/posts/:id/like", async ({ params }) => { const itemId = id(params.id); await db.interactions.put({ id: `like:${itemId}`, kind: "like", itemId }); return json({ ok: true }); }),
  http.get("/api/interactions", async () => json(await db.interactions.toArray())),
  http.get("/api/comments/:postId", async ({ params }) => json([...(await db.comments.where("postId").equals(id(params.postId)).toArray()), ...comments.filter(c => c.postId === params.postId)])),
  http.post("/api/comments", async ({ request }) => { const comment = await request.json() as Comment; await db.comments.put(comment); return json(comment); }),
];
