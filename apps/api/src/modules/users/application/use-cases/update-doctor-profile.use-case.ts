import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';
import { UpdateDoctorProfileInput } from '../../presentation/graphql/update-doctor-profile.input';

@Injectable()
export class UpdateDoctorProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, input: UpdateDoctorProfileInput) {
    const updateData: any = { ...input };
    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const createData: any = {
      user: { connect: { id: userId } },
      specialization: input.specialization || '',
      yearsOfExp: input.yearsOfExp || 0,
      bio: input.bio,
      licenseNumber: input.licenseNumber,
      city: input.city,
      country: input.country,
    };

    return this.prisma.doctorProfile.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });
  }
}
