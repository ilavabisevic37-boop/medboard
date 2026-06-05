import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';
import { UpdateEmployerProfileInput } from '../../presentation/graphql/update-employer-profile.input';

@Injectable()
export class UpdateEmployerProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, input: UpdateEmployerProfileInput) {
    const updateData: any = { ...input };
    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const createData: any = {
      user: { connect: { id: userId } },
      companyName: input.companyName || '',
      website: input.website,
      description: input.description,
      city: input.city,
      country: input.country,
    };

    return this.prisma.employerProfile.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });
  }
}
