import { Controller, Get, Post, Req, UnauthorizedException, Headers, Inject } from '@nestjs/common';
import type { Request } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';

import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserPublic } from '@medboard/shared-types';
import { SyncUserFromSupabaseUseCase } from '../application/use-cases/sync-user-from-supabase.use-case';
import { USER_REPOSITORY, UserRepository } from '../../../modules/users/domain/repositories/user.repository';
import { UserRole } from '../../../modules/users/domain/value-objects/user-role.vo';

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

    const expectedSignatureHex = hmac.update(rawBody).digest('hex');
    
    // Supabase Auth sends `v1=...` or `t=...,v1=...`. 
    // Usually x-supabase-signature is just the hex for Auth webhooks, or `v1=hex` for DB webhooks.
    // Let's strip `v1=` if it exists.
    const actualSignatureHex = signature.replace(/^v1=/, '');

    const expectedBuffer = Buffer.from(expectedSignatureHex, 'utf8');
    const actualBuffer = Buffer.from(actualSignatureHex, 'utf8');

    if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const payload = JSON.parse(rawBody.toString('utf8'));

    if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
      const record = payload.record;
      const rawRole = record.raw_user_meta_data?.role?.toUpperCase();
      const validRole = Object.values(UserRole).includes(rawRole) ? rawRole as UserRole : UserRole.Doctor;

      await this.syncUserUseCase.execute({
        id: record.id,
        email: record.email,
        role: validRole,
        firstName: record.raw_user_meta_data?.firstName || '',
        lastName: record.raw_user_meta_data?.lastName || '',
      });
    } else if (payload.type === 'DELETE') {
      await this.userRepository.delete(payload.old_record.id);
    }

    return { success: true };
  }
}
