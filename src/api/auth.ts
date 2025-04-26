import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

export function setAuthHeader() {
  const authStore = useAuthStore();
  if (authStore.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
    console.log('Authorization ustawione:', axios.defaults.headers.common['Authorization']);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    console.log('Authorization usunięte');
  }
}
