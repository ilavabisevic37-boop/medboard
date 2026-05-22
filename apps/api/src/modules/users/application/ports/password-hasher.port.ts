/**
 * Outbound port — the Application layer depends on this contract, not on bcrypt/argon2.
 * Concrete implementation lives in infrastructure/security.
 */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  verify(plain: string, hash: string): Promise<boolean>;
}

export const PASSWORD_HASHER = Symbol('PasswordHasher');
