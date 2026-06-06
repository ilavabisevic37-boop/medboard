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
  CHAT_CONTEXT_READER,
  ChatContextReader,
} from '../ports/chat-context.reader';
import { ConversationSummaryReadModel } from '../read-models/conversation.read-model';
import { toMessageReadModel } from '../read-models/message.read-model.mapper';

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
    @Inject(CHAT_CONTEXT_READER) private readonly contextReader: ChatContextReader,
  ) {}

  async execute({ userId }: GetMyConversationsInput): Promise<ConversationSummaryReadModel[]> {
    const conversations = await this.conversations.findByParticipant(userId);
    if (conversations.length === 0) return [];

    const contexts = await this.contextReader.getByConversationIds(conversations.map((c) => c.id));
    const contextById = new Map(contexts.map((c) => [c.conversationId, c]));

    // N+1 over the user's conversations — fine at prototype scale, the inbox
    // is bounded by how many jobs one person applies to / posts.
    return Promise.all(
      conversations.map(async (conversation) => {
        const ctx = contextById.get(conversation.id);
        if (!ctx) {
          throw new Error(`Conversation ${conversation.id} has no projection context`);
        }
        const [lastMessage] = await this.messages.findByConversation(conversation.id, { limit: 1 });
        const unreadCount = await this.messages.countUnread(conversation.id, userId);
        const doctorSide = userId === ctx.doctorId;

        return {
          id: conversation.id,
          applicationId: conversation.applicationId,
          jobId: ctx.jobId,
          jobTitle: ctx.jobTitle,
          counterpartId: doctorSide ? ctx.employerId : ctx.doctorId,
          counterpartName: doctorSide ? ctx.employerName : ctx.doctorName,
          lastMessage: lastMessage ? toMessageReadModel(lastMessage) : undefined,
          unreadCount,
          updatedAt: conversation.updatedAt,
        };
      }),
    );
  }
}
