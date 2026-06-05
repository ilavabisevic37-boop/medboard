import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SupabaseJwtVerifier } from '../../infrastructure/jwt/supabase-jwt.verifier';
import { USER_REPOSITORY, UserRepository } from '../../../../modules/users/domain/repositories/user.repository';
import { GqlExecutionContext } from '@nestjs/graphql';

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

    let request;
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      const gqlCtx = GqlExecutionContext.create(context);
      request = gqlCtx.getContext().req;
    }

    const token = request.cookies?.['sb-access-token'];

    if (!token) {
      throw new UnauthorizedException('No sb-access-token cookie found');
    }

    try {
      const payload = await this.jwtVerifier.verify(token);
      if (!payload.sub) throw new Error('JWT missing sub');

      // TODO: For MVP, we query the DB on every request. 
      // In the future, implement Redis caching here to reduce DB load.
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
      console.error('Supabase token verification failed:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
