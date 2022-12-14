import Vue from 'vue';
import VueRouter from 'vue-router';

import { AUTH_TOKEN } from '@/plugins/apollo';
import AuthService from '@/modules/auth/services/auth-service';
import authRoutes from '@/modules/auth/router';
import dashboardRoutes from '@/modules/dashboard/router';

Vue.use(VueRouter)

const routes = [
 ...authRoutes,
 ...dashboardRoutes,
 {path: '', redirect: '/login'}
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  if(to.matched.some(route => route.meta.requiresAuth)){
    const token = window.localStorage.getItem(AUTH_TOKEN);
    const loginRoute = {
      path: "/login",
      query: {
        redirect: to.fullPath
      }
    }
    if(token) {
      try {
        await AuthService.user({ fetchPOlicy: "network-only" });
        next();
        return;
      } catch (error) {
        console.log(error.message);
        next(loginRoute);
        return;
      }
    }

    next(loginRoute);
    return;
  }
  next();
})

export default router;
