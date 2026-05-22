import { Module } from '@nestjs/common';

import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password.hasher';
import { UsersController } from './presentation/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
