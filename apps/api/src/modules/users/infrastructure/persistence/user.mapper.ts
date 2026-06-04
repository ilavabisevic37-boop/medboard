import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';

import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserRole } from '../../domain/value-objects/user-role.vo';

export class UserMapper {
  static toDomain(row: PrismaUser): User {
    return User.restore(row.id, {
      email: Email.create(row.email),
      role: row.role as unknown as UserRole,
      firstName: row.firstName,
      lastName: row.lastName,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      email: user.email.value,
      role: user.role as unknown as PrismaUserRole,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
