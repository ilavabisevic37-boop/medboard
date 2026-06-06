import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';
import { Message } from '../../domain/entities/message.entity';
import { MessagePage, MessageRepository } from '../../domain/repositories/message.repository';
import { MessageMapper } from './message.mapper';

const DEFAULT_PAGE_SIZE = 50;

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByConversation(conversationId: string, page?: MessagePage): Promise<Message[]> {
    const rows = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: page?.limit ?? DEFAULT_PAGE_SIZE,
      ...(page?.before ? { cursor: { id: page.before }, skip: 1 } : {}),
    });
    return rows.map(MessageMapper.toDomain);
  }

  async save(message: Message): Promise<void> {
    await this.prisma.message.create({
      data: {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        body: message.body,
      },
    });
    // Bump the conversation's updatedAt so the inbox sorts by last activity.
    await this.prisma.conversation.update({
      where: { id: message.conversationId },
      data: { updatedAt: new Date() },
    });
  }

  async markRead(conversationId: string, readerId: string): Promise<void> {
    await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: readerId }, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async countUnread(conversationId: string, readerId: string): Promise<number> {
    return this.prisma.message.count({
      where: { conversationId, senderId: { not: readerId }, readAt: null },
    });
  }
}
