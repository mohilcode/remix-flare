import type {
  AuthResponse,
  AuthState,
  ErrorResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types/auth'
import { UserSchema } from '@/types/auth'
import { api } from '@/utils/api'
import { useNavigate } from '@remix-run/react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | ErrorResponse

  if (!response.ok) {
    const error = data as ErrorResponse
    throw new Error(error.message || 'An error occurred')
  }

  return data as T
}

export function useAuthController(): AuthContextType {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        const response = await api.post('/api/auth/login', credentials)
        const data = await handleResponse<AuthResponse>(response)
        const user = UserSchema.parse(data.user)

        setState(prev => ({ ...prev, user, isLoading: false }))
        navigate('/')
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Login failed',
          isLoading: false,
        }))
      }
    },
    [navigate]
  )

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        const response = await api.post('/api/auth/register', credentials)
        const data = await handleResponse<AuthResponse>(response)
        const user = UserSchema.parse(data.user)

        setState(prev => ({ ...prev, user, isLoading: false }))
        navigate('/verify-email')
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Registration failed',
          isLoading: false,
        }))
      }
    },
    [navigate]
  )

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf-token='))
        ?.split('=')[1]

      const response = await api.post('/api/auth/logout', null, {
        headers: {
          'X-CSRF-Token': csrfToken || '',
        },
      })

      await handleResponse<{ message: string }>(response)

      setState({ user: null, isLoading: false, error: null })
      navigate('/login')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false,
      }))
    }
  }, [navigate])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/session')

        if (response.ok) {
          const data = await handleResponse<{
            session: { email: string } & Record<string, unknown>
          }>(response)
          setState(prev => ({ ...prev, user: data.session as User, isLoading: false }))
        } else {
          setState(prev => ({ ...prev, user: null, isLoading: false }))
        }
      } catch (_error) {
        setState(prev => ({
          ...prev,
          user: null,
          error: 'Failed to check authentication status',
          isLoading: false,
        }))
      }
    }

    checkAuth()
  }, [])

  return { ...state, login, register, logout }
}
