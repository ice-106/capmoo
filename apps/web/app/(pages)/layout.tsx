'use client'

import { useAuth } from 'react-oidc-context'

export default function Layout({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  if (auth.error) {
    console.error('Authentication error:', auth.error)
  }

  if (auth.isLoading) {
    return null
  }

  return <>{children}</>
}
