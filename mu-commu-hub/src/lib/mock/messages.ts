import type { Conversation, Message } from "@/types";

export const conversations: Conversation[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `cv${i + 1}`,
    participantIds: ["u0", `u${i + 1}`],
    updatedAt: new Date(Date.now() - i * 1800000).toISOString(),
    unread: i < 3 ? 1 : 0,
  }),
);

export const messages: Message[] = conversations.flatMap((c, i) => [
  {
    id: `m${i * 2 + 1}`,
    conversationId: c.id,
    senderId: `u${i + 1}`,
    content: [
      "Hey! I saw your profile and thought you might be interested in our project.",
      "Are you still looking for a teammate for the hackathon?",
      "Loved your post. Would you be up for a quick chat this week?",
    ][i % 3],
    createdAt: new Date(Date.now() - i * 1800000 - 600000).toISOString(),
  },
  {
    id: `m${i * 2 + 2}`,
    conversationId: c.id,
    senderId: "u0",
    content: "That sounds great! Tell me a little more about the idea.",
    createdAt: c.updatedAt,
  },
]);
