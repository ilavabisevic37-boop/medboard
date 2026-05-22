import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

import { UserRole } from '../../domain/value-objects/user-role.vo';

export class RegisterUserHttpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;
}
