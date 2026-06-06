import { Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import {
  ChatEventsPublisher,
  chatMessageChannel,
} from '../../application/ports/chat-events.publisher';
import { Message } from '../../domain/entities/message.entity';
import { CHAT_PUB_SUB } from './redis-pubsub.provider';

@Injectable()
export class RedisChatEventsPublisher implements ChatEventsPublisher {
  constructor(@Inject(CHAT_PUB_SUB) private readonly pubSub: RedisPubSub) {}

  async publishMessageAdded(message: Message): Promise<void> {
    // Payload key must match the Subscription field name (`messageAdded`).
    await this.pubSub.publish(chatMessageChannel(message.conversationId), {
      messageAdded: {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        body: message.body,
        readAt: message.readAt ?? null,
        createdAt: message.createdAt,
      },
    });
  }
}
