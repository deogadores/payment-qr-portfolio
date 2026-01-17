import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

/**
 * Generate a cryptographically secure random token
 * @param bytes Number of random bytes (default: 32)
 * @returns URL-safe base64 encoded string
 */
export function generateToken(bytes: number = 32): string {
  return randomBytes(bytes).toString('base64url')
}

/**
 * Generate a user-friendly registration phrase
 * Uses a combination of adjectives and nouns with a random number
 */
export function generateRegistrationPhrase(): string {
  const adjectives = [
    'brave', 'bright', 'calm', 'clever', 'eager', 'fancy', 'gentle', 'happy',
    'jolly', 'kind', 'lively', 'nice', 'proud', 'silly', 'witty', 'zany',
    'swift', 'bold', 'cool', 'wise'
  ]

  const nouns = [
    'panda', 'tiger', 'eagle', 'dolphin', 'fox', 'wolf', 'bear', 'lion',
    'hawk', 'owl', 'deer', 'rabbit', 'otter', 'seal', 'penguin', 'koala',
    'elephant', 'giraffe', 'zebra', 'cheetah'
  ]

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(1000 + Math.random() * 9000) // 4-digit number

  return `${adjective}-${noun}-${number}`
}

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Compare a password with its hash
 * @param password Plain text password
 * @param hash Hashed password
 * @returns True if password matches
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
