import { api } from '@/api/client'
import type { Session } from '@/types/auth'
import { createCookieSessionStorage, redirect } from '@remix-run/cloudflare'

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'app_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
})

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export async function requireUser(_request: Request): Promise<Session> {
  try {
    const response = await api.get<{ success: boolean; session: Session }>('/api/auth/session')
    return response.session
  } catch (_error) {
    throw redirect('/login')
  }
}

export async function destroySession(request: Request) {
  const session = await getSession(request)
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}
