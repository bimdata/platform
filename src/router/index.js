import { createRouter, createWebHistory } from 'vue-router';
import { vuexOidcCreateReactiveStateRouterMiddleware } from 'vuex-oidc';
import Layout from '@/Layout';
// import Home from '@/views/home/Home';
import Spaces from '@/views/spaces/Spaces';
import OidcCallback from '@/views/oidc-callback/OidcCallback';
import OidcCallbackError from '@/views/oidc-callback-error/OidcCallbackError';
import { useOidcState } from '@/state/oidcState';

const routes = [
  {
    path: '/',
    name: '',
    component: Layout,
    meta: {
      isPublic: false
    },
    children: [
      {
        path: '',
        component: Spaces
      }
    ]
  },
  {
    path: '/oidc-callback', // Needs to match `redirect_uri` in oidcSettings
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
