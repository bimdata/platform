import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "./guards";
import {
  dashboardResolver,
  modelViewerResolver,
  projectBoardResolver,
  rootResolver,
  spaceBoardResolver,
  userProjectsResolver,
  userSpacesResolver
} from "./resolvers";
// Components
import Layout from "@/Layout";
import Dashboard from "@/views/dashboard/Dashboard";
import ModelViewer from "@/views/model-viewer/ModelViewer";
import OidcCallback from "@/views/oidc-callback/OidcCallback";
import OidcCallbackError from "@/views/oidc-callback-error/OidcCallbackError";
import ProjectBoard from "@/views/project-board/ProjectBoard";
import SpaceBoard from "@/views/space-board/SpaceBoard";
import UserProjects from "@/views/user-projects/UserProjects";
import UserSpaces from "@/views/user-spaces/UserSpaces";

const routeNames = Object.freeze({
  root: "root",
  oidcCallback: "oidc-callback",
  oidcCallbackError: "oidc-callback-error",
  dashboard: "dashboard",
  userSpaces: "user-spaces",
  spaceBoard: "space-board",
  userProjects: "user-projects",
  projectBoard: "project-board",
  modelViewer: "model-viewer"
});

const routes = [
  {
    path: "/",
    name: routeNames.root,
    component: Layout,
    meta: {
      // Protect this route and all its children with authentication
      requiresAuth: true,
      resolver: rootResolver
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
        name: routeNames.userSpaces,
        component: UserSpaces,
        meta: {
          resolver: userSpacesResolver
        }
      },
      {
        path: "/projects",
        name: routeNames.userProjects,
        component: UserProjects,
        meta: {
          resolver: userProjectsResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)",
        name: routeNames.spaceBoard,
        component: SpaceBoard,
        meta: {
          resolver: spaceBoardResolver,
          breadcrumb: "BreadcrumbSpaceSelector"
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)",
        name: routeNames.projectBoard,
        component: ProjectBoard,
        meta: {
          resolver: projectBoardResolver,
          breadcrumb: "BreadcrumbProjectSelector"
        }
      },
      {
        path:
          "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)/viewer/:modelIDs",
        name: routeNames.modelViewer,
        component: ModelViewer,
        meta: {
          resolver: modelViewerResolver
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

router.beforeResolve(async targetRoute => {
  const resolvers = targetRoute.matched
    .filter(route => route.meta && route.meta.resolver)
    .map(route => route.meta.resolver);

  for (const resolver of resolvers) {
    await resolver(targetRoute);
  }
});

export { routeNames };

export default router;
