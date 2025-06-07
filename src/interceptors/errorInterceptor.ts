import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const { presentToast } = useToast()
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
})

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  async (response) => {
    const method = response.config.method?.toUpperCase() || ''

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      await presentToast(response.data.message, 'success')
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
    await presentToast(error.response?.data?.detail || 'Coś poszło nie tak!', 'danger')

    return Promise.reject(error)
  },
)

export default apiClient
