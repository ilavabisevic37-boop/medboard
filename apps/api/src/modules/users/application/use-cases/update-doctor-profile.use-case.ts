import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma.service';

export interface UpdateDoctorProfileCommand {
  specialization?: string;
  yearsOfExp?: number;
  bio?: string | null;
  licenseNumber?: string | null;
  city?: string | null;
  country?: string | null;
}

@Injectable()
export class UpdateDoctorProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, command: UpdateDoctorProfileCommand) {
    const updateData: any = { ...command };
    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const createData: any = {
      user: { connect: { id: userId } },
      specialization: command.specialization || '',
      yearsOfExp: command.yearsOfExp || 0,
      bio: command.bio,
      licenseNumber: command.licenseNumber,
      city: command.city,
      country: command.country,
    };

    return this.prisma.doctorProfile.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });
  }
}
