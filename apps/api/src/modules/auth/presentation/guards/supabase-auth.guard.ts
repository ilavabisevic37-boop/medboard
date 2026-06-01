import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SupabaseJwtVerifier } from '../../infrastructure/jwt/supabase-jwt.verifier';
import { USER_REPOSITORY, UserRepository } from '../../../../modules/users/domain/repositories/user.repository';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtVerifier: SupabaseJwtVerifier,
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.['sb-access-token'];

    if (!token) {
      throw new UnauthorizedException('No sb-access-token cookie found');
    }

    try {
      const payload = await this.jwtVerifier.verify(token);
      if (!payload.sub) throw new Error('JWT missing sub');

      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found in local database');
      }

      request.user = {
        id: user.id,
        email: user.email.value,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException(err instanceof Error ? err.message : 'Invalid token');
    }
  }
}
