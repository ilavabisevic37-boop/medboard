import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';

export interface UpdateEmployerProfileCommand {
  companyName?: string;
  website?: string | null;
  description?: string | null;
  city?: string | null;
  country?: string | null;
}

@Injectable()
export class UpdateEmployerProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, command: UpdateEmployerProfileCommand) {
    const updateData: any = { ...command };
    const normalizedCompanyName = command.companyName?.trim();
    if (normalizedCompanyName !== undefined) {
      updateData.companyName = normalizedCompanyName;
    }
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const createData: any = {
      user: { connect: { id: userId } },
      companyName: normalizedCompanyName || '',
      website: command.website,
      description: command.description,
      city: command.city,
      country: command.country,
    };

    return this.prisma.employerProfile.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });
  }
}
