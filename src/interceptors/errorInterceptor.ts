import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const { presentToast } = useToast()
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
})

apiClient.interceptors.response.use(
  async (response) => {
    const method = response.config.method?.toUpperCase() || ''

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      if (response.data.message) {
        await presentToast(response.data.message, 'success')
      }
    }

    return response
  },
  async (error) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401 && error.config && !error.config._retry) {
      error.config._retry = true

      try {
        await authStore.refreshAccessToken()
        error.config.headers['Authorization'] = `Bearer ${authStore.token}`
        return apiClient(error.config)
      } catch (refreshError) {
        authStore.logout()
        await presentToast('Sesja wygasła. Zaloguj się ponownie.', 'danger')
        return Promise.reject(refreshError)
      }
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
  }
)



export default apiClient
