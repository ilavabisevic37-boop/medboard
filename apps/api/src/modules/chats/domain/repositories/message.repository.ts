import { Message } from '../entities/message.entity';

export interface MessagePage {
  /** Cursor-based: messages created strictly before `before` (message id). */
  before?: string;
  limit?: number;
}

export interface MessageRepository {
  /** Newest-first page of messages for a conversation (cursor pagination). */
  findByConversation(conversationId: string, page?: MessagePage): Promise<Message[]>;
  save(message: Message): Promise<void>;
  /** Mark all messages NOT sent by `readerId` as read. */
  markRead(conversationId: string, readerId: string): Promise<void>;
  /** Unread count per conversation for the inbox view. */
  countUnread(conversationId: string, readerId: string): Promise<number>;
}

export const MESSAGE_REPOSITORY = Symbol('MessageRepository');
