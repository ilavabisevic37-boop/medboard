import { Module } from '@nestjs/common';

import { CHAT_EVENTS_PUBLISHER } from './application/ports/chat-events.publisher';
import { GetConversationUseCase } from './application/use-cases/get-conversation.use-case';
import { GetMyConversationsUseCase } from './application/use-cases/get-my-conversations.use-case';
import { MarkConversationReadUseCase } from './application/use-cases/mark-conversation-read.use-case';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { CONVERSATION_REPOSITORY } from './domain/repositories/conversation.repository';
import { MESSAGE_REPOSITORY } from './domain/repositories/message.repository';
import { PrismaConversationRepository } from './infrastructure/persistence/prisma-conversation.repository';
import { PrismaMessageRepository } from './infrastructure/persistence/prisma-message.repository';
import { RedisChatEventsPublisher } from './infrastructure/pubsub/redis-chat-events.publisher';
import { redisPubSubProvider } from './infrastructure/pubsub/redis-pubsub.provider';
import { ChatsResolver } from './presentation/graphql/chats.resolver';

@Module({
  providers: [
    GetMyConversationsUseCase,
    GetConversationUseCase,
    SendMessageUseCase,
    MarkConversationReadUseCase,
    ChatsResolver,
    redisPubSubProvider,
    { provide: CONVERSATION_REPOSITORY, useClass: PrismaConversationRepository },
    { provide: MESSAGE_REPOSITORY, useClass: PrismaMessageRepository },
    { provide: CHAT_EVENTS_PUBLISHER, useClass: RedisChatEventsPublisher },
  ],
  // Applications' apply-to-job use-case will need CONVERSATION_REPOSITORY to
  // create the conversation right after an application is submitted.
  exports: [CONVERSATION_REPOSITORY],
})
export class ChatsModule {}
