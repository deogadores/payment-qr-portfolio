'use server'

import { loginWithCentralAuth, registerWithCentralAuth, requestToolAccess } from '@/lib/auth/api-client'
import { setAuthCookie, clearAuthCookie } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { userSettings } from '@/lib/db/schema'
import { registerSchema, type RegisterInput } from '@/lib/utils/validators'

export async function loginAction(email: string, password: string) {
  const result = await loginWithCentralAuth(email, password)

  if (!result.success) {
    return { success: false, error: result.error || 'Login failed' }
  }

  // Check if user has access to this tool
  if (!result.toolAccess?.includes('qr-portfolio')) {
    return {
      success: false,
      error: 'You do not have access to this tool. Please request access first.',
    }
  }

  if (result.token) {
    await setAuthCookie(result.token)
  }

  return { success: true }
}

export async function registerAction(data: RegisterInput) {
  // Validate input
  const validatedFields = registerSchema.safeParse(data)
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid input data' }
  }

  const result = await registerWithCentralAuth(data)

  if (!result.success) {
    return { success: false, error: result.error || 'Registration failed' }
  }

  // Create default user settings in local database
  if (result.user) {
    try {
      await db.insert(userSettings).values({
        userId: result.user.id,
      })
    } catch (error) {
      // Settings might already exist, ignore error
      console.error('Error creating user settings:', error)
    }
  }

  if (result.token) {
    await setAuthCookie(result.token)
  }

  return { success: true }
}

export async function logoutAction() {
  await clearAuthCookie()
  redirect('/login')
}

export async function requestAccessAction(data: {
  name: string
  email: string
  reason?: string
}) {
  const result = await requestToolAccess(data)

  if (!result.success) {
    return { success: false, error: result.error || 'Failed to submit request' }
  }

  return { success: true, message: result.message }
}
