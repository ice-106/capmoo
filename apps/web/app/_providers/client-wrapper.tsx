'use client'

import { AuthProvider } from 'react-oidc-context'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const COGNITO_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_POOL_ID
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID

if (!BASE_URL || !COGNITO_POOL_ID || !COGNITO_CLIENT_ID) {
  throw new Error('Missing environment variables for AWS Cognito')
}

const oidcConfig = {
  authority: `https://cognito-idp.ap-southeast-1.amazonaws.com/${COGNITO_POOL_ID}`,
  client_id: COGNITO_CLIENT_ID,
  redirect_uri: `${BASE_URL}/callback`,
  response_type: 'code',
  scope: 'openid email phone profile',
}

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>
}
