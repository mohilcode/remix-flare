import { API_BASE_URL } from '@/constants/env'

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

async function fetchWithBaseUrl(endpoint: string, options: RequestOptions = {}) {
  const { params, ...init } = options
  const url = new URL(`${API_BASE_URL}${endpoint}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value)
    }
  }

  const response = await fetch(url.toString(), {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  return response
}

export const api = {
  get: (endpoint: string, options?: RequestOptions) =>
    fetchWithBaseUrl(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, data?: unknown, options?: RequestOptions) =>
    fetchWithBaseUrl(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: unknown, options?: RequestOptions) =>
    fetchWithBaseUrl(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: RequestOptions) =>
    fetchWithBaseUrl(endpoint, { ...options, method: 'DELETE' }),
}
