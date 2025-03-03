import type { ActionFunctionArgs } from '@remix-run/cloudflare'
import { createThemeAction } from 'remix-themes'
import { createThemeSessionResolverWithSecret, getThemeSecret } from '../lib/theme-utils.server'

export const action = async ({ request, context, params }: ActionFunctionArgs) => {
  const secret = getThemeSecret(context.cloudflare.env)

  const resolver = createThemeSessionResolverWithSecret(secret)

  const themeAction = createThemeAction(resolver)
  return themeAction({ request, context, params })
}
