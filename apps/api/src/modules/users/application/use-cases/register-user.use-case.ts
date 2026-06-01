import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';
import { RegisterUserInput, RegisterUserOutput } from '../dtos/register-user.dto';

@Injectable()
export class RegisterUserUseCase implements UseCase<RegisterUserInput, RegisterUserOutput> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: RegisterUserInput & { supabaseUserId: string }): Promise<RegisterUserOutput> {
    const email = Email.create(input.email);

    const existing = await this.users.findByEmail(email.value);
    if (existing) throw new ConflictException('Email already in use');

    const user = User.register({
      id: input.supabaseUserId,
      email,
      role: input.role,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    await this.users.save(user);

    return { id: user.id, email: user.email.value, role: user.role };
  }
}
