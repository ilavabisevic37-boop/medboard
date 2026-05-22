import { UserRole } from '../../domain/value-objects/user-role.vo';

export interface RegisterUserInput {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface RegisterUserOutput {
  id: string;
  email: string;
  role: UserRole;
}
