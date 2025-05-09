import axios, { type AxiosInstance } from 'axios'
import { useAuth } from 'react-oidc-context'

export const useAxios = (): AxiosInstance => {
  const auth = useAuth()

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  })

  instance.interceptors.request.use(
    (config) => {
      if (auth.isAuthenticated && auth.user?.access_token) {
        config.headers.Authorization = `Bearer ${auth.user.access_token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return instance
}
