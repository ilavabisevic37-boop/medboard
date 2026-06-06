import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

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

  async execute(input: MarkConversationReadInput): Promise<boolean> {
    const conversation = await this.conversations.findById(input.conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (!conversation.isParticipant(input.readerId)) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    await this.messages.markRead(conversation.id, input.readerId);
    return true;
  }
}
