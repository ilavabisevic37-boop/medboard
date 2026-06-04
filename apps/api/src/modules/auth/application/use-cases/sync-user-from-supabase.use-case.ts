import { Inject, Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/application/use-case.interface';
import { RegisterUserUseCase } from '../../../../modules/users/application/use-cases/register-user.use-case';
import { UserRole } from '../../../../modules/users/domain/value-objects/user-role.vo';
import { USER_REPOSITORY, UserRepository } from '../../../../modules/users/domain/repositories/user.repository';

export interface SyncUserFromSupabaseInput {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

@Injectable()
export class SyncUserFromSupabaseUseCase implements UseCase<SyncUserFromSupabaseInput, void> {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: SyncUserFromSupabaseInput): Promise<void> {
    const existing = await this.users.findById(input.id);
    
    if (existing) {
      // Intentionally omitting email and role updates here.
      // These are core domain properties that should ideally be managed by
      // dedicated administrative workflows, rather than blindly overwritten
      // by raw metadata from the auth provider webhook.
      existing.rename(input.firstName, input.lastName);
      await this.users.save(existing);
      return;
    }

    await this.registerUserUseCase.execute({
      supabaseUserId: input.id,
      email: input.email,
      role: input.role,
      firstName: input.firstName,
      lastName: input.lastName,
    });
  }
}
