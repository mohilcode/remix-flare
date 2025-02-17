import { useAuth } from '@/context/auth'
import type { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [{ title: 'Dashboard' }]
}

export default function Index() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome back, {user?.firstName}!
      </h1>
    </div>
  )
}
