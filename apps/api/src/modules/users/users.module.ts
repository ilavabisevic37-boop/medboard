import { Module } from '@nestjs/common';

import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';

@Module({
  providers: [
    RegisterUserUseCase,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  ],
  exports: [USER_REPOSITORY, RegisterUserUseCase],
})
export class UsersModule {}
