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
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },

    async register(username: string, email: string, password: string) {
      const response = await axios.post('http://localhost:8000/api/register/', { username, email, password });
      this.token = response.data.access;
      this.refreshToken = response.data.refresh;
      localStorage.setItem('token', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },

    logout() {
      this.user = null;
      this.token = '';
      this.refreshToken = '';
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
    },

    initializeAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
  },

  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
  },
});
