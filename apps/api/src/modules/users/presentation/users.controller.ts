import { Body, Controller, Post } from '@nestjs/common';

import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { RegisterUserHttpDto } from './dtos/register-user.http.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() body: RegisterUserHttpDto) {
    return this.registerUser.execute(body);
  }
}
