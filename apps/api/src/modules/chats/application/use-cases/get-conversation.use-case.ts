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
import {
  CHAT_CONTEXT_READER,
  ChatContextReader,
} from '../ports/chat-context.reader';
import { ConversationDetailReadModel } from '../read-models/conversation.read-model';
import { toMessageReadModel } from '../read-models/message.read-model.mapper';

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
    @Inject(CHAT_CONTEXT_READER) private readonly contextReader: ChatContextReader,
  ) {}

  async execute(input: GetConversationInput): Promise<ConversationDetailReadModel> {
    const conversation = await this.conversations.findById(input.conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (!conversation.isParticipant(input.userId)) {
      throw new ForbiddenException('You are not a participant of this conversation');
    }

    const [messages, [ctx]] = await Promise.all([
      this.messages.findByConversation(conversation.id, {
        before: input.before,
        limit: input.limit,
      }),
      this.contextReader.getByConversationIds([conversation.id]),
    ]);
    const doctorSide = input.userId === ctx.doctorId;

    return {
      id: conversation.id,
      applicationId: conversation.applicationId,
      jobId: ctx.jobId,
      jobTitle: ctx.jobTitle,
      counterpartId: doctorSide ? ctx.employerId : ctx.doctorId,
      counterpartName: doctorSide ? ctx.employerName : ctx.doctorName,
      messages: messages.map(toMessageReadModel),
    };
  }
}
