import axios from 'axios';
import { toastController } from '@ionic/vue';
import { useAuthStore } from '@/stores/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Request Interceptor - Dodawanie nagłówka Authorization
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Obsługa błędów
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    if (error.response?.status === 401 && error.config && !error.config._retry) {
      error.config._retry = true;

      try {
        await authStore.refreshAccessToken(); // Próba odświeżenia tokena
        error.config.headers['Authorization'] = `Bearer ${authStore.token}`;
        return apiClient(error.config); // Ponowne wykonanie żądania
      } catch (refreshError) {
        authStore.logout(); // Wylogowanie po nieudanym odświeżeniu
        const toast = await toastController.create({
          message: 'Sesja wygasła. Zaloguj się ponownie.',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
        return Promise.reject(refreshError);
      }
    }

    const toast = await toastController.create({
      message: error.response?.data?.detail || 'Coś poszło nie tak!',
      duration: 3000,
      color: 'danger',
    });
    await toast.present();

    return Promise.reject(error);
  }
);

export default apiClient;
