import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  banned: z.boolean().nullable().optional(),
  role: z.string().nullable().optional(),
  banReason: z.string().optional().nullable(),
  banExpires: z.date().or(z.string()).optional().nullable(),
})

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date().or(z.string()),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
})

export type User = z.infer<typeof UserSchema>
export type Session = z.infer<typeof SessionSchema>
