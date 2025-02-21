import type { Session } from '@/types/auth'
import type { LoaderFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { requireUser } from './session'

export interface AuthLoaderData {
  session: Session
}

export function createAuthLoader(options: {
  allowedRoles?: string[]
  redirectTo?: string
}): LoaderFunction {
  const { allowedRoles, redirectTo = '/login' } = options

  return async ({ request }) => {
    try {
      const session = await requireUser(request)

      if (allowedRoles && !allowedRoles.includes(session.role)) {
        throw redirect('/unauthorized')
      }

      return { session }
    } catch (error) {
      if (error instanceof Response) {
        throw error
      }
      throw redirect(redirectTo)
    }
  }
}
