import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtVerify, createRemoteJWKSet } from 'jose';

@Injectable()
export class SupabaseJwtVerifier {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

  async verify(token: string) {
    try {
      if (!this.jwks) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
        this.jwks = createRemoteJWKSet(new URL(`${url}/rest/v1/auth/v1/jwk`));
      }
      
      const { payload } = await jwtVerify(token, this.jwks);
      
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
