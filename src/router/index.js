import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "./guards";
import {
  dashboardResolver,
  projectsResolver,
  spaceBoardResolver,
  spacesResolver
} from "./resolvers";
// Components
import Layout from "@/Layout";
import Dashboard from "@/views/dashboard/Dashboard";
import OidcCallback from "@/views/oidc-callback/OidcCallback";
import OidcCallbackError from "@/views/oidc-callback-error/OidcCallbackError";
import Projects from "@/views/projects/Projects";
import SpaceBoard from "@/views/space-board/SpaceBoard";
import Spaces from "@/views/spaces/Spaces";

const routeNames = Object.freeze({
  root: "root",
  oidcCallback: "oidc-callback",
  oidcCallbackError: "oidc-callback-error",
  dashboard: "dashboard",
  spaces: "spaces",
  spaceBoard: "space-board",
  projects: "projects"
});

const routes = [
  {
    path: "/",
    name: routeNames.root,
    component: Layout,
    meta: {
      // Protect this route and all its children with authentication
      requiresAuth: true
    },
    children: [
      {
        path: "",
        name: routeNames.dashboard,
        component: Dashboard,
        meta: {
          resolver: dashboardResolver
        }
      },
      {
        path: "/spaces",
        name: routeNames.spaces,
        component: Spaces,
        meta: {
          resolver: spacesResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)",
        name: routeNames.spaceBoard,
        component: SpaceBoard,
        meta: {
          resolver: spaceBoardResolver,
          breadcrumb: ["BreadcrumbSpaceSelector"]
        }
      },
      {
        path: "/projects",
        name: routeNames.projects,
        component: Projects,
        meta: {
          resolver: projectsResolver
        }
      }
    ]
  },
  {
    // Should match `redirect_uri` path in oidcConfig
    path: "/oidc-callback",
    name: routeNames.oidcCallback,
    component: OidcCallback
  },
  {
    path: "/oidc-callback-error",
    name: routeNames.oidcCallbackError,
    component: OidcCallbackError
  },
  {
    // Redirect every unknown route to the root
    path: "/:path(.*)*",
    beforeEnter: (to, from, next) => next("/")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(authGuard);

router.beforeResolve(async to => {
  const resolvers = to.matched
    .filter(r => r.meta && r.meta.resolver)
    .map(r => r.meta.resolver);

  for (const resolver of resolvers) {
    await resolver(to);
  }
});

export { routeNames };

export default router;
