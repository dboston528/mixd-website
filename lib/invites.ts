import { createHash, randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure random token
 * Returns a 64-character hex string (32 bytes)
 */
export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Hash a token using SHA-256
 * This is what we store in the database (never store plain tokens)
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Validate a token by comparing its hash to the stored hash
 */
export function validateTokenHash(token: string, storedHash: string): boolean {
  const tokenHash = hashToken(token);
  return tokenHash === storedHash;
}

