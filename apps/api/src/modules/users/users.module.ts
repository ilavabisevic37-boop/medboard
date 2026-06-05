import { Module } from '@nestjs/common';

import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UpdateDoctorProfileUseCase } from './application/use-cases/update-doctor-profile.use-case';
import { UpdateEmployerProfileUseCase } from './application/use-cases/update-employer-profile.use-case';
import { UsersResolver } from './presentation/graphql/users.resolver';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';

@Module({
  providers: [
    RegisterUserUseCase,
    GetUserUseCase,
    UpdateDoctorProfileUseCase,
    UpdateEmployerProfileUseCase,
    UsersResolver,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  ],
  exports: [USER_REPOSITORY, RegisterUserUseCase],
})
export class UsersModule {}
