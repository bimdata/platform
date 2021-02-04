import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "./guards";
import {
  dashboardResolver,
  projectsResolver,
  spacesResolver
} from "./resolvers";
// Components
import Layout from "@/Layout";
import Dashboard from "@/views/dashboard/Dashboard";
import OidcCallback from "@/views/oidc-callback/OidcCallback";
import OidcCallbackError from "@/views/oidc-callback-error/OidcCallbackError";
import Projects from "@/views/projects/Projects";
import Spaces from "@/views/spaces/Spaces";

const routes = [
  {
    path: "/",
    name: "root",
    component: Layout,
    meta: {
      // Protect this route and all its children with authentication
      requiresAuth: true
    },
    children: [
      {
        path: "",
        name: "dashboard",
        component: Dashboard,
        meta: {
          resolver: dashboardResolver
        }
      },
      {
        path: "/spaces",
        name: "spaces",
        component: Spaces,
        meta: {
          resolver: spacesResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects",
        name: "projects",
        component: Projects,
        meta: {
          resolver: projectsResolver,
          breadcrumb: ["BreadcrumbSpaceList"]
        }
      }
    ]
  },
  {
    // Should match `redirect_uri` path in oidcConfig
    path: "/oidc-callback",
    name: "oidc-callback",
    component: OidcCallback
  },
  {
    path: "/oidc-callback-error",
    name: "oidc-callback-error",
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

router.beforeResolve(to => {
  to.matched
    .filter(r => r.meta && r.meta.resolver)
    .reduce(
      (chain, r) => chain.then(() => r.meta.resolver(to)),
      Promise.resolve()
    );
});

export default router;
