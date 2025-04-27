import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;

  if (!isAuthenticated && to.meta.requiresAuth) {
    next({ name: 'Login' });
  } else if (isAuthenticated) {
    try {
      await authStore.refreshAccessToken(); // Automatyczne odświeżenie tokena
      next();
    } catch (error) {
      next({ name: 'Login' }); // Wylogowanie, jeśli odświeżenie tokena się nie powiodło
    }
  } else {
    next();
  }
}
