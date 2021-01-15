import { createRouter, createWebHistory } from 'vue-router';
import { useGlobalState } from '@/state/globalState';
// Components
import Layout from '@/Layout';
import Dashboard from '@/views/dashboard/Dashboard';
import OidcCallback from '@/views/oidc-callback/OidcCallback';
import OidcCallbackError from '@/views/oidc-callback-error/OidcCallbackError';
import Spaces from '@/views/spaces/Spaces';

const routes = [
  {
    path: '/',
    name: 'root',
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: '/spaces',
        name: 'spaces',
        component: Spaces
      }
    ]
  },
  {
    path: '/oidc-callback', // Should match `redirect_uri` in oidcConfig
    name: 'oidc-callback',
    component: OidcCallback
  },
  {
    path: '/oidc-callback-error',
    name: 'oidc-callback-error',
    component: OidcCallbackError
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, authenticate } = useGlobalState();
  if (isAuthenticated.value) {
    next();
  } else if (to.matched.some(r => r.meta.requiresAuth)) {
    await authenticate(to.path);
    next();
  } else {
    next();
  }
});

export default router;
