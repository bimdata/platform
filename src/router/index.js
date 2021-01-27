import { createRouter, createWebHistory } from 'vue-router';
import { useGlobalState } from '@/state/globalState';
import { useSpacesState } from '@/state/spacesState';
// Components
import Layout from '@/Layout';
import Dashboard from '@/views/dashboard/Dashboard';
import OidcCallback from '@/views/oidc-callback/OidcCallback';
import OidcCallbackError from '@/views/oidc-callback-error/OidcCallbackError';
import Projects from '@/views/projects/Projects';
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
      },
      {
        path: '/spaces/:spaceID(\\d+)/projects',
        name: 'projects',
        component: Projects
      }
    ]
  },
  {
    // Should match `redirect_uri` path in oidcConfig
    path: '/oidc-callback',
    name: 'oidc-callback',
    component: OidcCallback
  },
  {
    path: '/oidc-callback-error',
    name: 'oidc-callback-error',
    component: OidcCallbackError
  },
  {
    // Redirect every unknown route to the root
    path: '/:path(.*)*',
    beforeEnter: (to, from, next) => next('/')
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

router.beforeResolve(({
  params: {
    spaceID
  }
}) => {
  if (spaceID) {
    useSpacesState().selectSpace(+spaceID);
  }
});

export default router;
