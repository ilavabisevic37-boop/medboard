import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './presentation/auth.controller';
import { SupabaseAuthGuard } from './presentation/guards/supabase-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';
import { supabaseAdminClientProvider } from './infrastructure/supabase/supabase-admin.client';
import { SupabaseJwtVerifier } from './infrastructure/jwt/supabase-jwt.verifier';
import { SyncUserFromSupabaseUseCase } from './application/use-cases/sync-user-from-supabase.use-case';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    supabaseAdminClientProvider,
    SupabaseJwtVerifier,
    SyncUserFromSupabaseUseCase,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
