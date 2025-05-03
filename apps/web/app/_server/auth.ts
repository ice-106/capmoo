'use server'

import { redirect } from 'next/navigation'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const COGNITO_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_POOL_ID
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID

export const signOutRedirect = async () => {
  if (!BASE_URL || !COGNITO_POOL_ID || !COGNITO_CLIENT_ID) {
    throw new Error('Missing environment variables for AWS Cognito')
  }

  redirect(
    `https://${COGNITO_POOL_ID}.auth.ap-southeast-1.amazoncognito.com/logout?client_id=${COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(BASE_URL)}`
  )
}
