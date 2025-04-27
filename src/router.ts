import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import RecipeList from './pages/RecipeList.vue';
import RecipeDetails from './pages/RecipeDetails.vue';
import AddRecipe from './pages/AddRecipe.vue';
import { authGuard } from './guards/authGuard';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home', // Redirect musi być używany bez komponentu
  },
  {
    path: '/home',
    name: 'Home',
    component: Home, // Home musi być poprawnie zaimportowany
    beforeEnter: authGuard,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/category/:id',
    component: RecipeList,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/recipe/:id',
    component: RecipeDetails,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/add-recipe',
    component: AddRecipe,
    meta: { requiresAuth: true },
  },
  {
    path: '/edit-recipe/:id',
    component: () => import('./pages/EditRecipe.vue'),
    props: true,
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach(authGuard);

export default router;
