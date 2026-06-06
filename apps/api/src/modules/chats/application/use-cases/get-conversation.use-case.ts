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
import { ConversationDetailReadModel } from '../read-models/conversation.read-model';

export interface GetConversationInput {
  conversationId: string;
  userId: string;
  /** Cursor pagination for older messages. */
  before?: string;
  limit?: number;
}

@Injectable()
export class GetConversationUseCase
  implements UseCase<GetConversationInput, ConversationDetailReadModel>
{
  constructor(
    @Inject(CONVERSATION_REPOSITORY) private readonly conversations: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY) private readonly messages: MessageRepository,
  ) {}

  /**
   * TODO(chats):
   *  1. load conversation (404 if missing);
   *  2. conversation.assertParticipant(userId);
   *  3. messages.findByConversation(id, { before, limit });
   *  4. project to ConversationDetailReadModel (job title, counterpart).
   */
  async execute(input: GetConversationInput): Promise<ConversationDetailReadModel> {
    throw new Error(`TODO: implement GetConversationUseCase for ${input.conversationId}`);
  }
}
