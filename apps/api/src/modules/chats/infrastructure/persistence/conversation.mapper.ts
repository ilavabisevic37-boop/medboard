import { Conversation as PrismaConversation } from '@prisma/client';

import { Conversation } from '../../domain/entities/conversation.entity';

/** Row shape the repository must fetch: participants come via the application. */
export type ConversationRow = PrismaConversation & {
  application: { doctorId: string; job: { employerId: string } };
};

export class ConversationMapper {
  static toDomain(row: ConversationRow): Conversation {
    return Conversation.restore(row.id, {
      applicationId: row.applicationId,
      doctorId: row.application.doctorId,
      employerId: row.application.job.employerId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
