import { isRouteErrorResponse, useRouteError } from '@remix-run/react'

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-blue-600 dark:text-blue-400">{error.status}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {error.statusText}
          </h1>
          <p className="mt-4 text-base text-gray-500 dark:text-gray-400">{error.data}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-blue-600 dark:text-blue-400">Oops!</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    </div>
  )
}
