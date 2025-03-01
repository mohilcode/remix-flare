import { createAuthClient } from 'better-auth/react'
import { API_BASE_URL } from '../constants/env'

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
})
