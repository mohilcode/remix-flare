import type { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [
    { title: 'Welcome to Your App' },
    { name: 'description', content: 'Your app description' },
  ]
}

export default function Index() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
