export type UserRole = 'DOCTOR' | 'EMPLOYER' | 'ADMIN';

export interface UserPublic {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}
