import { randomUUID } from 'crypto';

import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { Message } from '../../domain/entities/message.entity';
import {
  CONVERSATION_REPOSITORY,
  ConversationRepository,
} from '../../domain/repositories/conversation.repository';
import {
  MESSAGE_REPOSITORY,
  MessageRepository,
} from '../../domain/repositories/message.repository';
import {
  CHAT_EVENTS_PUBLISHER,
  ChatEventsPublisher,
} from '../ports/chat-events.publisher';
import { MessageReadModel } from '../read-models/conversation.read-model';
import { toMessageReadModel } from '../read-models/message.read-model.mapper';

export interface SendMessageInput {
  conversationId: string;
  senderId: string;
  body: string;
}

@Injectable()
export class SendMessageUseCase implements UseCase<SendMessageInput, MessageReadModel> {
  constructor(
    @Inject(CONVERSATION_REPOSITORY) private readonly conversations: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY) private readonly messages: MessageRepository,
    @Inject(CHAT_EVENTS_PUBLISHER) private readonly events: ChatEventsPublisher,
  ) {}

  async execute(input: SendMessageInput): Promise<MessageReadModel> {
    const conversation = await this.conversations.findById(input.conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (!conversation.isParticipant(input.senderId)) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    // Body validation (trim, non-empty, length cap) lives in the entity.
    const message = Message.create({
      id: randomUUID(),
      conversationId: conversation.id,
      senderId: input.senderId,
      body: input.body,
    });

    await this.messages.save(message);
    // Drives the `messageAdded` subscription; after save so subscribers never
    // see a message that wasn't persisted.
    await this.events.publishMessageAdded(message);

    return toMessageReadModel(message);
  }
}
