import { cn } from '@/lib/utils'
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes'
import { createThemeSessionResolverWithSecret } from './sessions.server'

import styles from './tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: styles },
]

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { env } = context.cloudflare

  const secret = env.THEME_COOKIE_SECRET || 's3cr3t1'

  const resolver = createThemeSessionResolverWithSecret(secret)

  const { getTheme } = await resolver(request)

  return {
    theme: getTheme(),
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  )
}

export function App() {
  const data = useLoaderData<typeof loader>()
  const [theme] = useTheme()

  return (
    <html lang="en" className={cn(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
