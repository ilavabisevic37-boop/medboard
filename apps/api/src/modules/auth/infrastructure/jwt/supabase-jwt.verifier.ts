import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { jwtVerify, createRemoteJWKSet } from 'jose';

@Injectable()
export class SupabaseJwtVerifier {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

  async verify(token: string) {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!this.jwks) {
        if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
        this.jwks = createRemoteJWKSet(new URL(`${url}/auth/v1/.well-known/jwks.json`));
      }
      
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: `${url}/auth/v1`,
        audience: 'authenticated',
      });
      
      return payload;
    } catch (error) {
      if (error instanceof Error && (error.name.includes('JWT') || error.name.includes('JOSE'))) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      throw new InternalServerErrorException(error instanceof Error ? error.message : 'Internal Server Error');
    }
  }
}
