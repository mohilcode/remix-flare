import { authClient } from '@/lib/auth'

export function UserProfile() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div>Loading...</div>
  }

  if (session?.user) {
    return (
      <div>
        <p>Welcome, {session.user.name}</p>
        <button type="button" onClick={() => authClient.signOut()}>
          Sign Out
        </button>
      </div>
    )
  }

  return null
}
