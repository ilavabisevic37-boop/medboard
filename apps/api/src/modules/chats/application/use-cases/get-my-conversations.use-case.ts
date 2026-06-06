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
import { ConversationSummaryReadModel } from '../read-models/conversation.read-model';

export interface GetMyConversationsInput {
  userId: string;
}

@Injectable()
export class GetMyConversationsUseCase
  implements UseCase<GetMyConversationsInput, ConversationSummaryReadModel[]>
{
  constructor(
    @Inject(CONVERSATION_REPOSITORY) private readonly conversations: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY) private readonly messages: MessageRepository,
  ) {}

  /**
   * TODO(chats): inbox projection —
   *  1. conversations.findByParticipant(userId);
   *  2. for each: last message + messages.countUnread(id, userId);
   *  3. job title + counterpart name (needs a projection query — either a
   *     dedicated read-side query via PrismaService here, or extend the repo);
   *  4. sort by last activity desc.
   */
  async execute(input: GetMyConversationsInput): Promise<ConversationSummaryReadModel[]> {
    throw new Error(`TODO: implement GetMyConversationsUseCase for ${input.userId}`);
  }
}
