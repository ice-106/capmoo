'use client'

import { AuthProvider } from 'react-oidc-context'

const oidcConfig = {
  authority:
    'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_kABCq3Yw4',
  client_id: '45pi75s2fqmpp08p51pdupv5jc',
  redirect_uri: 'http://localhost:3000/callback',
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
