import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simplified middleware without auth - protection will be done at page level
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
