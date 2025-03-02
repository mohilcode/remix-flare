import { UserProfile } from '@/components/UserProfile'
import { authClient } from '@/lib/auth'
import type { LoaderFunction } from '@remix-run/cloudflare'
import { Outlet, useNavigate } from '@remix-run/react'
import { useEffect, useState } from 'react'

export const loader: LoaderFunction = async ({ request }) => {
  return {
    timestamp: Date.now(),
    url: request.url,
  }
}

export default function ProtectedLayout() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true)
        const { data: session } = await authClient.getSession()

        if (!session) {
          navigate('/login')
        }
      } catch (error) {
        console.error('Session check failed:', error)
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <header>
        <UserProfile />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
