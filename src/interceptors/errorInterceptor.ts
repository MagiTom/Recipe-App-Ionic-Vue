import { useToast } from '@/composables/useToast'
import { API_BASE } from '@/enviroments'
import { useAuthStore } from '@/stores/authStore'
import { useLoaderStore } from '@/stores/useLoaderStore'
import axios from 'axios'

const { presentToast } = useToast()
const apiClient = axios.create({
  baseURL: API_BASE,
})

let isRefreshing = false
let failedQueue: any[] = []

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const loaderStore = useLoaderStore()
    loaderStore.startLoading()
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    const loaderStore = useLoaderStore()
    loaderStore.stopLoading()
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  async (response) => {
    const method = response.config.method?.toUpperCase() || ''
    const loaderStore = useLoaderStore()
    loaderStore.stopLoading()

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      if (response.data.message) {
        await presentToast(response.data.message, 'success')
      }
    }

    return response
  },
  async (error) => {
    const loaderStore = useLoaderStore()
    loaderStore.stopLoading()
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!authStore.refreshToken) {
        authStore.logout()
        await presentToast('Brak odświeżającego tokena. Zaloguj się ponownie.', 'danger')
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token
              resolve(apiClient(originalRequest))
            },
            reject: (err: any) => reject(err),
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      return new Promise(async (resolve, reject) => {
        try {
          await authStore.refreshAccessToken()
          originalRequest.headers['Authorization'] = `Bearer ${authStore.token}`
          processQueue(null, authStore.token)
          resolve(apiClient(originalRequest))
        } catch (refreshError) {
          processQueue(refreshError, null)
          authStore.logout()
          await presentToast('Sesja wygasła. Zaloguj się ponownie.', 'danger')
          reject(refreshError)
        } finally {
          isRefreshing = false
        }
      })
    }

    const responseData = error.response?.data
    let message = 'Coś poszło nie tak!'

    if (typeof responseData === 'string') {
      message = responseData
    } else if (responseData?.detail) {
      message = responseData.detail
    } else if (responseData?.details && typeof responseData.details === 'object') {
      const fieldErrors = Object.entries(responseData.details)
        .map(([field, errors]) => {
          if (Array.isArray(errors)) {
            return `${field}: ${errors.join(', ')}`
          }
          return `${field}: ${errors}`
        })
        .join('\n')

      if (fieldErrors) {
        message = fieldErrors
      }
    }

    await presentToast(message, 'danger')
    return Promise.reject(error)
  },
)

export default apiClient
