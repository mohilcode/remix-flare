import Navbar from '@/components/layout/Navbar'
import type { MetaFunction } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Welcome to Your App' },
    { name: 'description', content: 'Your app description' },
  ]
}

export default function Index() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main className="pt-16">
        <div className="relative isolate px-6 lg:px-8">
          <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Your App Tagline Goes Here
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                A brief description of your application and its main value proposition. Make it
                compelling and clear.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/register"
                  className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  Log in <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
