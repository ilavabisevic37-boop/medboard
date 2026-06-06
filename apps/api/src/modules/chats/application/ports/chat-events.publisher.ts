import { Message } from '../../domain/entities/message.entity';

/** Redis channel a conversation's live events are published to. */
export const chatMessageChannel = (conversationId: string): string =>
  `chat.message.${conversationId}`;

/**
 * Outbound port: publish chat events for GraphQL subscriptions.
 * Implemented in infrastructure via Redis pub/sub.
 */
export interface ChatEventsPublisher {
  publishMessageAdded(message: Message): Promise<void>;
}

export const CHAT_EVENTS_PUBLISHER = Symbol('ChatEventsPublisher');
