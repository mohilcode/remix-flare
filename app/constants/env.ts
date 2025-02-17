export const NODE_ENV = process.env.NODE_ENV || 'development'
export const isDevelopment = NODE_ENV === 'development'
export const isProduction = NODE_ENV === 'production'

export const API_BASE_URL = isDevelopment ? 'http://localhost:3000' : 'https://mohil.dev'
