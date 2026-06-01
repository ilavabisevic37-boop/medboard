import { Controller, Get, Post, Req, UnauthorizedException, Headers } from '@nestjs/common';
import { Request } from 'express';
import { createHmac } from 'crypto';

import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserPublic } from '@medboard/shared-types';
import { SyncUserFromSupabaseUseCase } from '../application/use-cases/sync-user-from-supabase.use-case';
import { USER_REPOSITORY, UserRepository } from '../../../modules/users/domain/repositories/user.repository';
import { Inject } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly syncUserUseCase: SyncUserFromSupabaseUseCase,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  @Get('me')
  getMe(@CurrentUser() user: UserPublic): UserPublic {
    return user;
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('x-supabase-signature') signature: string,
  ) {
    const secret = process.env.SUPABASE_WEBHOOK_SECRET;
    if (!secret) throw new Error('SUPABASE_WEBHOOK_SECRET is not set');

    // Verify HMAC signature
    const hmac = createHmac('sha256', secret);
    const rawBody = (req as any).rawBody; // Configured in main.ts
    
    if (!rawBody) throw new UnauthorizedException('No raw body for webhook verification');

    const expectedSignature = hmac.update(rawBody).digest('hex');
    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody.toString('utf8'));

    if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
      const record = payload.record;
      await this.syncUserUseCase.execute({
        id: record.id,
        email: record.email,
        role: record.raw_user_meta_data?.role || 'DOCTOR',
        firstName: record.raw_user_meta_data?.firstName || '',
        lastName: record.raw_user_meta_data?.lastName || '',
      });
    } else if (payload.type === 'DELETE') {
      await this.userRepository.delete(payload.old_record.id);
    }

    return { success: true };
  }
}
