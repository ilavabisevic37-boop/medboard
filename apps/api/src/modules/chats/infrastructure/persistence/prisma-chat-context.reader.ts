import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';
import {
  ChatContextReader,
  ConversationContext,
} from '../../application/ports/chat-context.reader';

@Injectable()
export class PrismaChatContextReader implements ChatContextReader {
  constructor(private readonly prisma: PrismaService) {}

  async getByConversationIds(ids: string[]): Promise<ConversationContext[]> {
    if (ids.length === 0) return [];

    const rows = await this.prisma.conversation.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        application: {
          select: {
            doctor: { select: { id: true, firstName: true, lastName: true } },
            job: {
              select: {
                id: true,
                title: true,
                employer: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    employerProfile: { select: { companyName: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    return rows.map((row) => {
      const { doctor, job } = row.application;
      return {
        conversationId: row.id,
        jobId: job.id,
        jobTitle: job.title,
        doctorId: doctor.id,
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        employerId: job.employer.id,
        employerName:
          job.employer.employerProfile?.companyName ??
          `${job.employer.firstName} ${job.employer.lastName}`,
      };
    });
  }
}
