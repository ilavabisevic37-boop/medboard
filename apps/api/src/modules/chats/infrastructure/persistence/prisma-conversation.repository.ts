import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';
import { Conversation } from '../../domain/entities/conversation.entity';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { ConversationMapper } from './conversation.mapper';

/** Pulls the participants (doctor + employer) along with every conversation. */
const withParticipants = {
  application: { select: { doctorId: true, job: { select: { employerId: true } } } },
} as const;

@Injectable()
export class PrismaConversationRepository implements ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Conversation | null> {
    const row = await this.prisma.conversation.findUnique({
      where: { id },
      include: withParticipants,
    });
    return row ? ConversationMapper.toDomain(row) : null;
  }

  async findByApplicationId(applicationId: string): Promise<Conversation | null> {
    const row = await this.prisma.conversation.findUnique({
      where: { applicationId },
      include: withParticipants,
    });
    return row ? ConversationMapper.toDomain(row) : null;
  }

  async findByParticipant(userId: string): Promise<Conversation[]> {
    const rows = await this.prisma.conversation.findMany({
      where: {
        application: {
          OR: [{ doctorId: userId }, { job: { employerId: userId } }],
        },
      },
      include: withParticipants,
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(ConversationMapper.toDomain);
  }

  async save(conversation: Conversation): Promise<void> {
    const data = {
      id: conversation.id,
      applicationId: conversation.applicationId,
    };
    await this.prisma.conversation.upsert({
      where: { id: conversation.id },
      create: data,
      update: {}, // nothing mutable on the row itself; updatedAt bumps via messages
    });
  }
}
