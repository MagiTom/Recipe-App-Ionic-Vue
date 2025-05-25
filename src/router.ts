import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import RecipeList from './pages/RecipeList.vue';
import RecipeDetails from './pages/RecipeDetails.vue';
import AddRecipe from './pages/AddRecipe.vue';
import EditRecipe from './pages/EditRecipe.vue';
import { authGuard } from './guards/authGuard';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
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
    component: EditRecipe,
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
