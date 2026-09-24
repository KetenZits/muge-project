export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  updatedAt: string;
  unread: number;
}
