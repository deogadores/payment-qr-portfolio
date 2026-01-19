import { cookies } from 'next/headers'
import { verifyToken, type AuthUser } from './api-client'

const TOKEN_COOKIE = 'auth_token'

export interface Session {
  user: AuthUser
  token: string
  toolAccess: string[]
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value

  if (!token) {
    return null
  }

  const result = await verifyToken(token)

  if (!result.valid || !result.hasToolAccess || !result.user) {
    return null
  }

  return {
    user: result.user,
    token,
    toolAccess: result.toolAccess || [],
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_COOKIE)
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_COOKIE)?.value || null
}
