import type { PlatformProxy } from 'wrangler'

type Cloudflare = Omit<PlatformProxy<CloudflareBindings>, 'dispose'>

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare
  }
}
