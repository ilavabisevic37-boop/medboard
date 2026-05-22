import { User } from '../entities/user.entity';

/**
 * Repository contract — defined in the Domain layer (Dependency Inversion).
 * Infrastructure provides the concrete Prisma-backed implementation.
 */
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('UserRepository');
