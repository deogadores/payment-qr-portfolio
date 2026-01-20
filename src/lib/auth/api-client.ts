const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001'
const TOOL_SLUG = 'qr-portfolio'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  isAdmin: boolean
}

export interface LoginResponse {
  success: boolean
  user?: AuthUser
  token?: string
  toolAccess?: string[]
  error?: string
}

export interface RegisterResponse {
  success: boolean
  user?: AuthUser
  token?: string
  toolAccess?: string[]
  error?: string
}

export interface VerifyResponse {
  valid: boolean
  user?: AuthUser
  toolAccess?: string[]
  hasToolAccess?: boolean
  error?: string
}

export async function loginWithCentralAuth(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await fetch(`${AUTH_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return res.json()
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Failed to connect to auth service' }
  }
}

export async function registerWithCentralAuth(data: {
  registrationPhrase: string
  name: string
  email: string
  password: string
}): Promise<RegisterResponse> {
  try {
    const res = await fetch(`${AUTH_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  } catch (error) {
    console.error('Register error:', error)
    return { success: false, error: 'Failed to connect to auth service' }
  }
}

export async function verifyToken(token: string): Promise<VerifyResponse> {
  try {
    const res = await fetch(`${AUTH_API_URL}/api/auth/verify?tool=${TOOL_SLUG}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.json()
  } catch (error) {
    console.error('Verify error:', error)
    return { valid: false, error: 'Failed to connect to auth service' }
  }
}

export async function requestToolAccess(data: {
  name?: string
  email?: string
  reason?: string
}, token?: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${AUTH_API_URL}/api/tools/${TOOL_SLUG}/request-access`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  } catch (error) {
    console.error('Request access error:', error)
    return { success: false, error: 'Failed to connect to auth service' }
  }
}

export interface PublicUserInfo {
  id: string
  name: string | null
}

export async function getPublicUserInfo(userId: string): Promise<PublicUserInfo | null> {
  try {
    const res = await fetch(`${AUTH_API_URL}/api/users/${userId}/public`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.user || null
  } catch (error) {
    console.error('Get public user info error:', error)
    return null
  }
}
