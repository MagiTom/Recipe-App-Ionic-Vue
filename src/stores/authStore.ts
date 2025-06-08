import { defineStore } from 'pinia'
import apiClient from '@/interceptors/errorInterceptor'
import { API_BASE } from '@/enviroments'

interface User {
  id: number
  email: string
  username: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  }),

  getters: {
    isAuthenticated(state): boolean {
      return !!state.token
    },
  },

  actions: {
    setTokens(access: string, refresh: string) {
      this.token = access
      this.refreshToken = refresh
      localStorage.setItem('token', access)
      localStorage.setItem('refreshToken', refresh)
    },

    clearAuth() {
      this.user = null
      this.token = ''
      this.refreshToken = ''
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },

    logout() {
      this.clearAuth()
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')
      if (token && refreshToken) {
        this.token = token
        this.refreshToken = refreshToken
      }
    },

    async fetchUser() {
      if (!this.token) return

      const { data } = await apiClient.get(`${API_BASE}/user/`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })

      this.user = data
    },

    async login(email: string, password: string) {
      try {
        const { data } = await apiClient.post(`${API_BASE}/login/`, {
          email,
          password,
        })
        this.setTokens(data.access, data.refresh)
      } catch (err) {
        console.error('Błąd zalogowania:', err)
      }
    },

    async register(username: string, email: string, password: string) {
      try {
        const { data } = await apiClient.post(`${API_BASE}/register/`, {
          username,
          email,
          password,
        })
        this.setTokens(data.access, data.refresh)
      } catch (err) {
        console.error('Błąd rejestracji:', err)
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return
      }

      const { data } = await apiClient.post(`${API_BASE}/refresh/`, {
        refresh: this.refreshToken,
      })

      this.token = data.access
      localStorage.setItem('token', data.access)
    },
  },
})
