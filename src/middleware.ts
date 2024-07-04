import createMiddleware from 'next-intl/middleware'
import { locales, localePrefix } from './navigation'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { authRoutes, guestRoutes } from './constants'

const nextIntlMiddleware = createMiddleware({
  defaultLocale: 'tr',
  locales,
  localePrefix
})

const authMiddleware = withAuth(
  function onSuccess(req) {
    return nextIntlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/login'
    }
  }
)

export default async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isGuestRoute = guestRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (!token) {
    if (isAuthRoute) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set(
        'callbackUrl',
        request.nextUrl.href.replace(request.nextUrl.origin, process.env.NEXTAUTH_URL || 'localhost:3000')
      )

      return NextResponse.redirect(redirectUrl)
    } else {
      return nextIntlMiddleware(request)
    }
  } else {
    if (isGuestRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return (authMiddleware as any)(request)
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next|_next/static|_next/image|images|_vercel.*\\..*).*)']
}
