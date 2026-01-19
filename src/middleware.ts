import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001'
const TOOL_SLUG = 'qr-portfolio'

const publicPaths = ['/', '/login', '/register', '/request-access']
const sharePaths = ['/share']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  // Allow share paths (public viewing)
  if (sharePaths.some((p) => path.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow API routes, static assets, etc.
  if (
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.includes('.') // Files with extensions (favicon.ico, etc.)
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token with central auth
  try {
    const res = await fetch(`${AUTH_API_URL}/api/auth/verify?tool=${TOOL_SLUG}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const result = await res.json()

    if (!result.valid) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth_token')
      return response
    }

    if (!result.hasToolAccess) {
      // User exists but no access to this tool
      return NextResponse.redirect(new URL('/request-access', request.url))
    }

    // User is authenticated and has tool access
    return NextResponse.next()
  } catch (error) {
    console.error('Auth verification error:', error)
    // On error, allow through but the page will handle auth check
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
