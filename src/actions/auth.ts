'use server'

import { signIn, signOut } from '@/lib/auth/auth'
import { db } from '@/lib/db'
import { users, userSettings } from '@/lib/db/schema'
import { hashPassword } from '@/lib/utils/crypto'
import { validateRegistrationPhrase, markPhraseAsUsed } from '@/lib/auth/phrase-validator'
import { registerSchema, type RegisterInput } from '@/lib/utils/validators'
import { eq } from 'drizzle-orm'
import { AuthError } from 'next-auth'

export async function loginAction(email: string, password: string) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Invalid email or password' }
    }
    return { success: false, error: 'An error occurred during login' }
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/login' })
}

export async function registerAction(data: RegisterInput) {
  try {
    // Validate input
    const validatedFields = registerSchema.safeParse(data)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid input data' }
    }

    const { registrationPhrase, name, email, password } = validatedFields.data

    // Validate registration phrase
    const phraseValidation = await validateRegistrationPhrase(registrationPhrase)
    if (!phraseValidation.valid) {
      const errorMessages = {
        invalid_phrase: 'Invalid registration phrase',
        phrase_already_used: 'This registration phrase has already been used',
        phrase_expired: 'This registration phrase has expired',
        validation_error: 'Error validating registration phrase',
      }
      return {
        success: false,
        error: errorMessages[phraseValidation.reason as keyof typeof errorMessages] || 'Invalid registration phrase',
      }
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (existingUser.length > 0) {
      return { success: false, error: 'Email already registered' }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name,
        isAdmin: false,
        registrationPhraseId: phraseValidation.phraseId,
      })
      .returning()

    // Mark phrase as used
    if (phraseValidation.phraseId) {
      await markPhraseAsUsed(phraseValidation.phraseId, newUser.id)
    }

    // Create default user settings
    await db.insert(userSettings).values({
      userId: newUser.id,
    })

    // Auto-login the user
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'An error occurred during registration' }
  }
}
