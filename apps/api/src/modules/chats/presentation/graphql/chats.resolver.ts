import { Inject } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { chatMessageChannel } from '../../application/ports/chat-events.publisher';
import { GetConversationUseCase } from '../../application/use-cases/get-conversation.use-case';
import { GetMyConversationsUseCase } from '../../application/use-cases/get-my-conversations.use-case';
import { MarkConversationReadUseCase } from '../../application/use-cases/mark-conversation-read.use-case';
import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';
import { CHAT_PUB_SUB } from '../../infrastructure/pubsub/redis-pubsub.provider';
import { ConversationDetailType, ConversationSummaryType, MessageType } from './chat.type';
import { SendMessageInputType } from './send-message.input';

// Auth is enforced by the global SupabaseAuthGuard (APP_GUARD in AuthModule) —
// same convention as users/jobs resolvers. Nothing here is @Public.
@Resolver()
export class ChatsResolver {
  constructor(
    private readonly getMyConversations: GetMyConversationsUseCase,
    private readonly getConversation: GetConversationUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly markConversationReadUseCase: MarkConversationReadUseCase,
    @Inject(CHAT_PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Query(() => [ConversationSummaryType], { name: 'myConversations' })
  myConversations(@CurrentUser() user: { id: string }): Promise<ConversationSummaryType[]> {
    return this.getMyConversations.execute({ userId: user.id });
  }

  @Query(() => ConversationDetailType, { name: 'conversation' })
  conversation(
    @CurrentUser() user: { id: string },
    @Args('id', { type: () => ID }) id: string,
    @Args('before', { type: () => ID, nullable: true }) before?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<ConversationDetailType> {
    return this.getConversation.execute({ conversationId: id, userId: user.id, before, limit });
  }

  @Mutation(() => MessageType, { name: 'sendMessage' })
  sendMessage(
    @CurrentUser() user: { id: string },
    @Args('input') input: SendMessageInputType,
  ): Promise<MessageType> {
    return this.sendMessageUseCase.execute({
      conversationId: input.conversationId,
      senderId: user.id,
      body: input.body,
    });
  }

  @Mutation(() => Boolean, { name: 'markConversationRead' })
  markConversationRead(
    @CurrentUser() user: { id: string },
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.markConversationReadUseCase.execute({ conversationId: id, readerId: user.id });
  }

  /**
   * TODO(chats): subscriptions are NOT live yet —
   *  1. ws auth: app.module.ts only has the `graphql-ws` seam; verify the
   *     Supabase JWT from connectionParams in onConnect (SupabaseJwtVerifier)
   *     and make sure supabase-auth.guard.ts handles the ws context branch;
   *  2. participation check on subscribe: load the conversation and
   *     assertParticipant(user.id) BEFORE returning the iterator.
   */
  @Subscription(() => MessageType, { name: 'messageAdded' })
  messageAdded(@Args('conversationId', { type: () => ID }) conversationId: string) {
    return this.pubSub.asyncIterator(chatMessageChannel(conversationId));
  }
}
