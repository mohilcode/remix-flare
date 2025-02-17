import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  emailVerified: z.boolean(),
  provider: z.enum(['email', 'google']),
  picture: z.string().nullable().optional(),
})

export type User = z.infer<typeof UserSchema>

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  user: User
  token: {
    expiresIn: number
  }
  csrfToken: string
}

export interface ErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown>
}
