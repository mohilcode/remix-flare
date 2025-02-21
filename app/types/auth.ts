import { z } from 'zod'

export const UserRoleEnum = {
  USER: 'user',
  ADMIN: 'admin',
} as const

export const AuthProviderEnum = {
  EMAIL: 'email',
  GOOGLE: 'google',
} as const

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
})

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum([UserRoleEnum.USER, UserRoleEnum.ADMIN]).default(UserRoleEnum.USER),
  provider: z
    .enum([AuthProviderEnum.EMAIL, AuthProviderEnum.GOOGLE])
    .default(AuthProviderEnum.EMAIL),
  emailVerified: z.boolean().default(false),
  picture: z.string().nullable().optional(),
})

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  exp: z.number(),
  iat: z.number(),
  email: z.string(),
  role: z.string(),
})

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  session: SessionSchema.optional(),
})

export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  timestamp: z.string(),
})

export type User = z.infer<typeof UserSchema>
export type Session = z.infer<typeof SessionSchema>
export type LoginCredentials = z.infer<typeof LoginSchema>
export type RegisterCredentials = z.infer<typeof RegisterSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>

export interface AuthContextState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AuthError'
  }
}
