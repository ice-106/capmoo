'use server'

import { redirect } from 'next/navigation'

export const signOutRedirect = async () => {
  const clientId = process.env.WEB_AWS_COGNITO_CLIENT_ID
  const logoutUri = process.env.WEB_BASE_URL
  const cognitoDomain = process.env.WEB_AWS_COGNITO_URL

  if (!clientId || !logoutUri || !cognitoDomain) {
    throw new Error('Missing environment variables for Cognito sign out')
  }

  redirect(
    `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
  )
}
