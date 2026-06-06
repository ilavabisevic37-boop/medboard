/**
 * Read models for the chat inbox / conversation views. Projections are
 * assembled in the use-cases (or a dedicated query service) — they pull from
 * several contexts (job title, counterpart name), so they don't map 1:1 to
 * domain entities.
 */

export interface MessageReadModel {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  readAt?: Date;
  createdAt: Date;
}

/** One row of the `/messages` inbox. */
export interface ConversationSummaryReadModel {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  /** The other participant from the current user's point of view. */
  counterpartId: string;
  counterpartName: string;
  lastMessage?: MessageReadModel;
  unreadCount: number;
  updatedAt: Date;
}

export interface ConversationDetailReadModel {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  counterpartId: string;
  counterpartName: string;
  /** Newest-first page; client reverses for display. */
  messages: MessageReadModel[];
}
