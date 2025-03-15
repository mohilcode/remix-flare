import { isDevelopment } from '@/constants/env'
import { isRouteErrorResponse } from '@remix-run/react'

export function logError(error: unknown, context?: string): void {
  if (!isDevelopment) {
    return
  }

  if (context) {
    console.error(`[${context}]:`, error)
  } else {
    console.error(error)
  }
}

export function handleServerError(
  error: unknown,
  context: string,
  userMessage = 'An unexpected error occurred'
) {
  logError(error, context)

  return new Response(
    JSON.stringify({
      status: 'error',
      message: userMessage,
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export function getErrorDetails(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return {
      message: error.data?.message || error.data || 'An error occurred',
      status: error.status,
      isRouteError: true,
    }
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    status: 500,
    isRouteError: false,
  }
}
