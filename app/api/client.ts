import { API_BASE_URL } from '@/constants/env'
import { AuthError, type ErrorResponse } from '@/types/auth'

export interface APIClientOptions {
  baseURL: string
  credentials?: RequestCredentials
  headers?: HeadersInit
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ErrorResponse
  ) {
    super(message)
    this.name = 'APIError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()

  if (!response.ok) {
    const error = data as ErrorResponse
    throw new APIError(error.message, response.status, error)
  }

  return data as T
}

export function createAPIClient(options: APIClientOptions) {
  const { baseURL, credentials = 'include', headers: defaultHeaders = {} } = options

  async function fetchWithAuth(
    endpoint: string,
    options: RequestInit & { params?: Record<string, string> } = {}
  ) {
    const { params, headers, ...init } = options
    const url = new URL(endpoint, baseURL)

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value)
      }
    }

    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf-token='))
      ?.split('=')[1]

    const response = await fetch(url.toString(), {
      ...init,
      credentials,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...headers,
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
    })

    return response
  }

  return {
    get: async <T>(
      endpoint: string,
      options?: RequestInit & { params?: Record<string, string> }
    ) => {
      const response = await fetchWithAuth(endpoint, { ...options, method: 'GET' })
      return handleResponse<T>(response)
    },

    post: async <T>(
      endpoint: string,
      data?: unknown,
      options?: RequestInit & { params?: Record<string, string> }
    ) => {
      const response = await fetchWithAuth(endpoint, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      })
      return handleResponse<T>(response)
    },

    put: async <T>(
      endpoint: string,
      data?: unknown,
      options?: RequestInit & { params?: Record<string, string> }
    ) => {
      const response = await fetchWithAuth(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      })
      return handleResponse<T>(response)
    },

    delete: async <T>(
      endpoint: string,
      options?: RequestInit & { params?: Record<string, string> }
    ) => {
      const response = await fetchWithAuth(endpoint, { ...options, method: 'DELETE' })
      return handleResponse<T>(response)
    },
  }
}

export const api = createAPIClient({
  baseURL: API_BASE_URL,
})
