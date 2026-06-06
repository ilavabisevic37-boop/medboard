/** Chat DTOs shared between web and api (mirror the chats GraphQL types). */

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  readAt?: string | null;
  createdAt: string;
}

/** One row of the /messages inbox. */
export interface ConversationSummary {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  counterpartId: string;
  counterpartName: string;
  lastMessage?: ChatMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface ConversationDetail {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  counterpartId: string;
  counterpartName: string;
  /** Newest-first page; client reverses for display. */
  messages: ChatMessage[];
}
