import { createRouter, createWebHistory } from 'vue-router';
import { vuexOidcCreateReactiveStateRouterMiddleware } from 'vuex-oidc';
import Home from '@/views/Home';
import OidcCallback from '@/views/OidcCallback';
import OidcCallbackError from '@/views/OidcCallbackError';
import { useOidcState } from '@/state/oidcState';

const routes = [
  {
    path: '/',
    name: '',
    component: Home,
    meta: {
      isPublic: false
    }
  },
  {
    path: '/oidc-callback', // Needs to match redirect_uri in your oidcSettings
    name: 'oidcCallback',
    component: OidcCallback,
    meta: {
      isOidcCallback: true
    }
  },
  {
    path: '/oidc-callback-error',
    name: 'oidcCallbackError',
    component: OidcCallbackError,
    meta: {
      isPublic: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(
  vuexOidcCreateReactiveStateRouterMiddleware(
    useOidcState()
  )
);

export default router;
