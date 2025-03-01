export const NODE_ENV = process.env.NODE_ENV || 'development'
export const isDevelopment = NODE_ENV === 'development'
export const isProduction = NODE_ENV === 'production'

export const DEV_API_URL = 'http://localhost:3000'
export const STAGING_API_URL = 'https://staging.mohil.dev'
export const PROD_API_URL = 'https://mohil.dev'

export const isStaging =
  typeof window !== 'undefined' && window.location.hostname.includes('staging.mohil.dev')

export const API_BASE_URL = isDevelopment ? DEV_API_URL : isStaging ? STAGING_API_URL : PROD_API_URL
