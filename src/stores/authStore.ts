import { defineStore } from 'pinia'
import axios from 'axios'

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

      const { data } = await axios.get('http://localhost:8000/api/user/', {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })

      this.user = data
    },

    async login(email: string, password: string) {
      const { data } = await axios.post('http://localhost:8000/api/login/', { email, password })
      this.setTokens(data.access, data.refresh)
    },

    async register(username: string, email: string, password: string) {
      const { data } = await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password,
      })
      this.setTokens(data.access, data.refresh)
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return
      }

      const { data } = await axios.post('http://localhost:8000/api/refresh/', {
        refresh: this.refreshToken,
      })

      this.token = data.access
      localStorage.setItem('token', data.access)
    },
  },
})
