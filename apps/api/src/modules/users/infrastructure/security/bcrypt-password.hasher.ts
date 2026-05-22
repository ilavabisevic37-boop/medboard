import { Injectable } from '@nestjs/common';

import { PasswordHasher } from '../../application/ports/password-hasher.port';

/**
 * Placeholder adapter — swap for bcrypt/argon2 once the dependency is added.
 * Kept as plain-text passthrough so the skeleton compiles without extra packages.
 */
@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    return `unhashed:${plain}`;
  }

  async verify(plain: string, hash: string): Promise<boolean> {
    return hash === `unhashed:${plain}`;
  }
}
