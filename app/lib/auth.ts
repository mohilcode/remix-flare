import { useNavigate } from '@remix-run/react'
import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../constants/env'

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  plugins: [adminClient()],
})

export function useRedirectIfAuthenticated(redirectTo = '/dashboard') {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: session } = await authClient.getSession()
        if (session) {
          navigate(redirectTo)
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkSession()
  }, [navigate, redirectTo])

  return isChecking
}
