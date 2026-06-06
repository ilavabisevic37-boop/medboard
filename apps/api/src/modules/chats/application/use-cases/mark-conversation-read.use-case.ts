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

export interface MarkConversationReadInput {
  conversationId: string;
  readerId: string;
}

@Injectable()
export class MarkConversationReadUseCase
  implements UseCase<MarkConversationReadInput, boolean>
{
  constructor(
    @Inject(CONVERSATION_REPOSITORY) private readonly conversations: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY) private readonly messages: MessageRepository,
  ) {}

  /**
   * TODO(chats):
   *  1. load conversation (404 if missing);
   *  2. conversation.assertParticipant(readerId);
   *  3. messages.markRead(conversationId, readerId);
   *  4. return true.
   */
  async execute(input: MarkConversationReadInput): Promise<boolean> {
    throw new Error(`TODO: implement MarkConversationReadUseCase for ${input.conversationId}`);
  }
}
