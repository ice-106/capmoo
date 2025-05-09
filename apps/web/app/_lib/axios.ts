import axios, { type AxiosInstance } from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from 'react-oidc-context'

export const useAxios = (): AxiosInstance => {
  const auth = useAuth()
  const router = useRouter()

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  })

  instance.interceptors.request.use(
    (config) => {
      if (!auth.user) {
        router.push('/')
        return config
      }
      config.headers.Authorization = `Bearer ${auth.user.access_token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return instance
}
