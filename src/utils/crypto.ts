import crypto from 'crypto';
import {  KEY_LENGTH, IV_LENGTH, CRYPTO_PASSWORD } from '@config';

const ALGORITHM = 'aes-256-gcm'

export class CryptoUtil{
    /**
 * Encrypts the private key.
 * @param {string} privateKey - The Ethereum private key to encrypt.
 * @returns {string} The encrypted private key (in base64 format).
 */
encryptPrivateKey(privateKey: string): string {
    // Generate a 256-bit key using scrypt
  const key = crypto.scryptSync(CRYPTO_PASSWORD, 'salt', Number(KEY_LENGTH));

  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(Number(IV_LENGTH));

  // Create cipher instance
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Encrypt the private key
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get the authentication tag
  const authTag = cipher.getAuthTag().toString('hex');

  // Return the IV, encrypted key, and auth tag concatenated together
  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  }

/**
 * Decrypts the encrypted private key.
 * @param {string} encryptedData - The encrypted private key.
 * @returns {string} The decrypted private key.
 */
 decryptPrivateKey(encryptedData: string): string {
    const [ivHex, encryptedHex, authTagHex] = encryptedData.split(':');

  // Derive the same 256-bit key using scrypt
  const key = crypto.scryptSync(CRYPTO_PASSWORD, 'salt', Number(KEY_LENGTH));

  // Convert hex to buffers
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  // Create decipher instance
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  // Decrypt the private key
  let decrypted = decipher.update(encrypted); // No encoding options needed with Buffer
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
  }
}