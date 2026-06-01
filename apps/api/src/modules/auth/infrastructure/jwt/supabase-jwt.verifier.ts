import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtVerify } from 'jose';

@Injectable()
export class SupabaseJwtVerifier {
  async verify(token: string) {
    try {
      const secret = process.env.SUPABASE_JWT_SECRET;
      if (!secret) throw new Error('SUPABASE_JWT_SECRET is not set');
      
      const encoder = new TextEncoder();
      const { payload } = await jwtVerify(token, encoder.encode(secret));
      
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
