import { db } from '@/lib/db'
import { registrationPhrases } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export interface PhraseValidationResult {
  valid: boolean
  reason?: string
  phraseId?: string
}

/**
 * Validate a registration phrase
 * Checks if the phrase exists, is unused, and hasn't expired
 */
export async function validateRegistrationPhrase(
  phrase: string
): Promise<PhraseValidationResult> {
  try {
    // Find the phrase in the database
    const [registrationPhrase] = await db
      .select()
      .from(registrationPhrases)
      .where(eq(registrationPhrases.phrase, phrase))
      .limit(1)

    if (!registrationPhrase) {
      return { valid: false, reason: 'invalid_phrase' }
    }

    // Check if phrase has already been used
    if (registrationPhrase.isUsed) {
      return { valid: false, reason: 'phrase_already_used' }
    }

    // Check if phrase has expired
    if (registrationPhrase.expiresAt && registrationPhrase.expiresAt < new Date()) {
      return { valid: false, reason: 'phrase_expired' }
    }

    return { valid: true, phraseId: registrationPhrase.id }
  } catch (error) {
    console.error('Error validating registration phrase:', error)
    return { valid: false, reason: 'validation_error' }
  }
}

/**
 * Mark a registration phrase as used
 */
export async function markPhraseAsUsed(
  phraseId: string,
  userId: string
): Promise<void> {
  await db
    .update(registrationPhrases)
    .set({
      isUsed: true,
      usedBy: userId,
      usedAt: new Date(),
    })
    .where(eq(registrationPhrases.id, phraseId))
}
