import { Message as PrismaMessage } from '@prisma/client';

import { Message } from '../../domain/entities/message.entity';

export class MessageMapper {
  static toDomain(row: PrismaMessage): Message {
    return Message.restore(row.id, {
      conversationId: row.conversationId,
      senderId: row.senderId,
      body: row.body,
      readAt: row.readAt ?? undefined,
      createdAt: row.createdAt,
    });
  }
}
