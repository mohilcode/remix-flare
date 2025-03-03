import { DashboardSidebar } from '@/components/dashboard-sidebar'
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
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="border-b border-border px-6 py-3">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
