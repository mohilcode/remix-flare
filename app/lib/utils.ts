import { createCookieSessionStorage } from '@remix-run/cloudflare'
import { type ClassValue, clsx } from 'clsx'
import { createThemeSessionResolver } from 'remix-themes'
import { twMerge } from 'tailwind-merge'
import { PROD_API_URL, STAGING_API_URL, isProduction, isStaging } from '../constants/env'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createThemeSessionResolverWithSecret(secret: string) {
  const sessionStorage = createCookieSessionStorage({
    cookie: {
      name: 'theme',
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secrets: [secret],
      ...(isProduction
        ? { domain: new URL(PROD_API_URL).hostname, secure: true }
        : isStaging
          ? { domain: new URL(STAGING_API_URL).hostname, secure: true }
          : {}),
    },
  })

  return createThemeSessionResolver(sessionStorage)
}
