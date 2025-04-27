import { useAuthStore } from '@/stores/authStore';
import apiClient from '@/interceptors/errorInterceptor';

export function setAuthHeader() {
  const authStore = useAuthStore();
  if (authStore.token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
    console.log('Authorization ustawione:', apiClient.defaults.headers.common['Authorization']);
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    console.log('Authorization usunięte');
  }
}
