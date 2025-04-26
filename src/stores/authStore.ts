import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { id: number; email: string } | null,
    token: null as string | null,
  }),

  actions: {
    async login(email: string, password: string) {
      const response = await axios.post('http://localhost:8000/api/auth/login/', { email, password });
      this.user = response.data.user;
      this.token = response.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },

    async register(email: string, password: string) {
      const response = await axios.post('http://localhost:8000/api/auth/register/', { email, password });
      this.user = response.data.user;
      this.token = response.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },

    logout() {
      this.user = null;
      this.token = null;
      delete axios.defaults.headers.common['Authorization'];
    },
  },

  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
  },
});
