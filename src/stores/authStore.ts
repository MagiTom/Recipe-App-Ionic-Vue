import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: number; email: string; username: string } | null,
    token: localStorage.getItem('token') || '', // access token
    refreshToken: localStorage.getItem('refreshToken') || '', // refresh token
  }),

  actions: {
    async login(email: string, password: string) {
      const response = await axios.post('http://localhost:8000/api/login/', { email, password });
      this.token = response.data.access;
      this.refreshToken = response.data.refresh;
      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
    },

    async register(username: string, email: string, password: string) {
      const response = await axios.post('http://localhost:8000/api/register/', { username, email, password });
      this.token = response.data.access;
      this.refreshToken = response.data.refresh;
      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
    },

    logout() {
      this.user = null;
      this.token = '';
      this.refreshToken = '';
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },

    initializeAuth() {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      if (token && refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
      }
    },

    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout();
        // throw new Error('Brak odświeżającego tokena.');
      }

      try {
        const response = await axios.post('http://localhost:8000/api/refresh/', {
          refresh: this.refreshToken,
        });
        this.token = response.data.access;
        localStorage.setItem('token', this.token);
      } catch (error) {
        this.logout();
        // throw new Error('Nie udało się odświeżyć tokena.');
      }
    },
  },

  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
  },
});
