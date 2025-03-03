import { ModeToggle } from '@/components/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth'
import type { User as UserType } from '@/lib/types'
import { NavLink } from '@remix-run/react'
import { Home, LogOut, Settings, User } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DashboardSidebar() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: session } = await authClient.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    }

    fetchUserData()
  }, [])

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : '?'

  return (
    <div className="h-full w-64 border-r bg-sidebar flex flex-col">
      <div className="flex flex-col items-center space-y-2 p-4 border-b">
        {user ? (
          <div className="flex flex-col items-center space-y-2 w-full">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} alt={user.name || ''} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
        )}
      </div>

      <div className="flex-1 overflow-auto p-3">
        <nav className="flex flex-col space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isActive ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground' : ''}`
            }
            end
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isActive ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground' : ''}`
            }
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isActive ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground' : ''}`
            }
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <div className="border-t p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ModeToggle />
        </div>
        {user && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => authClient.signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </Button>
        )}
      </div>
    </div>
  )
}
