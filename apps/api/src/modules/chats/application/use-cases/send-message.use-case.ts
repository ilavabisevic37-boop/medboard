import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
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

  /**
   * TODO(chats):
   *  1. load conversation (404 if missing);
   *  2. conversation.assertParticipant(senderId);
   *  3. Message.create(...) (body validation lives in the entity);
   *  4. messages.save(message);
   *  5. events.publishMessageAdded(message) — drives the subscription;
   *  6. return the read model.
   */
  async execute(input: SendMessageInput): Promise<MessageReadModel> {
    throw new Error(`TODO: implement SendMessageUseCase for ${input.conversationId}`);
  }
}
