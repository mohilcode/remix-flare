import { UserProfile } from '@/components/UserProfile'
import { authClient } from '@/lib/auth'
import { redirect } from '@remix-run/cloudflare'
import { Outlet } from '@remix-run/react'

export async function loader() {
  const { data: session } = await authClient.getSession()
  if (!session) {
    throw redirect('/login')
  }
  return { session }
}

export default function ProtectedLayout() {
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
