import { api } from '@/api/client'
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth'
import { LoginSchema, RegisterSchema } from '@/types/auth'
import { redirect } from '@remix-run/cloudflare'

export class AuthenticatorError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'AuthenticatorError'
  }
}

export const authenticator = {
  async login(credentials: LoginCredentials, redirectTo = '/') {
    try {
      const validatedData = LoginSchema.parse(credentials)

      await api.post<AuthResponse>('/api/auth/login', validatedData)

      throw redirect(redirectTo)
    } catch (error) {
      if (error instanceof Response) {
        throw error
      }
      if (error instanceof Error) {
        throw new AuthenticatorError(error.message)
      }
      throw error
    }
  },

  async register(credentials: RegisterCredentials) {
    try {
      const validatedData = RegisterSchema.parse(credentials)
      const response = await api.post<AuthResponse>('/api/auth/register', validatedData)
      return response
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthenticatorError(error.message)
      }
      throw error
    }
  },

  async logout() {
    try {
      await api.post('/api/auth/logout')
      throw redirect('/login')
    } catch (error) {
      if (error instanceof Response) {
        throw error
      }

      throw redirect('/login')
    }
  },

  async verifyEmail(token: string) {
    try {
      const response = await api.get<AuthResponse>(`/api/auth/verify?token=${token}`)
      return response
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthenticatorError(error.message)
      }
      throw error
    }
  },

  async resendVerification(email: string) {
    try {
      const response = await api.post<AuthResponse>('/api/auth/resend', { email })
      return response
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthenticatorError(error.message)
      }
      throw error
    }
  },

  async forgotPassword(email: string) {
    try {
      const response = await api.post<AuthResponse>('/api/auth/forgot-password', { email })
      return response
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthenticatorError(error.message)
      }
      throw error
    }
  },

  async resetPassword(token: string, password: string) {
    try {
      const response = await api.post<AuthResponse>('/api/auth/reset-password', {
        token,
        password,
      })
      return response
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthenticatorError(error.message)
      }
      throw error
    }
  },
}
