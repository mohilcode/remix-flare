import type { ActionFunctionArgs } from '@remix-run/cloudflare'
import { createThemeAction } from 'remix-themes'
import { createThemeSessionResolverWithSecret } from '../lib/utils'

export const action = async ({ request, context, params }: ActionFunctionArgs) => {
  const { env } = context.cloudflare

  const secret = env.THEME_COOKIE_SECRET || 's3cr3t1'

  const resolver = createThemeSessionResolverWithSecret(secret)

  const themeAction = createThemeAction(resolver)
  return themeAction({ request, context, params })
}
