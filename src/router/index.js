import { createRouter, createWebHistory } from "vue-router";
import legacyRoutes from "./legacy.js";

// Guards
import authGuard from "./guards/auth.js";
import groupBoardGuard from "./guards/views/group-board.js";
import projectBoardGuard from "./guards/views/project-board.js";
import spaceBoardGuard from "./guards/views/space-board.js";
import rootResolver from "./resolvers/root.js";

// Resolvers
import groupBoardResolver from "./resolvers/views/group-board.js";
import modelViewerResolver from "./resolvers/views/model-viewer.js";
import projectBoardResolver from "./resolvers/views/project-board.js";
import projectGroupsResolver from "./resolvers/views/project-groups.js";
import spaceBoardResolver from "./resolvers/views/space-board.js";

// Route components
import Layout from "@/Layout.vue";
import OidcCallback from "@/views/oidc-callback/OidcCallback.vue";
import OidcCallbackError from "@/views/oidc-callback-error/OidcCallbackError.vue";
import PageNotFound from "@/views/page-not-found/PageNotFound.vue";

// Lazy loaded view components
/* eslint-disable */
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/Dashboard");
const GroupBoard = () =>
  import(/* webpackChunkName: "group-board" */ "@/views/group-board/GroupBoard.vue");
const ModelViewer = () =>
  import(/* webpackChunkName: "model-viewer" */ "@/views/model-viewer/ModelViewer.vue");
const ProjectBoard = () =>
  import(/* webpackChunkName: "project-board" */ "@/views/project-board/ProjectBoard.vue");
const ProjectGroups = () =>
  import(/* webpackChunkName: "project-groups" */ "@/views/project-groups/ProjectGroups.vue");
const SpaceBoard = () =>
  import(/* webpackChunkName: "space-board" */ "@/views/space-board/SpaceBoard.vue");
const UserProjects = () =>
  import(/* webpackChunkName: "user-projects" */ "@/views/user-projects/UserProjects.vue");
const UserSubscriptions = () =>
  import(/* webpackChunkName: "user-subscriptions" */ "@/views/user-subscriptions/UserSubscriptions.vue");
const Payment = () =>
  import(/* webpackChunkName: "payment" */ "@/views/payment/Payment.vue");
const SpacePayment = () =>
  import(/* webpackChunkName: "space-payment" */ "@/views/space-payment/SpacePayment.vue");
const UserSpaces = () =>
  import(/* webpackChunkName: "user-spaces" */ "@/views/user-spaces/UserSpaces.vue");
/* eslint-enable */

// Route names
const routeNames = Object.freeze({
  root: "root",
  oidcCallback: "oidc-callback",
  oidcCallbackError: "oidc-callback-error",
  dashboard: "dashboard",
  userSpaces: "user-spaces",
  spaceBoard: "space-board",
  userProjects: "user-projects",
  userSubscriptions: "user-subscriptions",
  payment: "payment",
  spacePayment: "space-payment",
  projectBoard: "project-board",
  modelViewer: "model-viewer",
  projectGroups: "project-groups",
  groupBoard: "group-board",
  pageNotFound: "page-not-found"
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
        component: Dashboard
      },
      {
        path: "/spaces",
        name: routeNames.userSpaces,
        component: UserSpaces
      },
      {
        path: "/projects",
        name: routeNames.userProjects,
        component: UserProjects
      },
      {
        path: "/subscriptions",
        name: routeNames.userSubscriptions,
        component: UserSubscriptions
      },
      {
        path: "/payment",
        name: routeNames.payment,
        component: Payment
      },
      {
        path: "/spaces/:spaceID(\\d+)",
        name: routeNames.spaceBoard,
        component: SpaceBoard,
        meta: {
          guard: spaceBoardGuard,
          resolver: spaceBoardResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)",
        name: routeNames.projectBoard,
        component: ProjectBoard,
        meta: {
          guard: projectBoardGuard,
          resolver: projectBoardResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)/viewer/:modelIDs",
        name: routeNames.modelViewer,
        component: ModelViewer,
        meta: {
          resolver: modelViewerResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)/groups",
        name: routeNames.projectGroups,
        component: ProjectGroups,
        meta: {
          resolver: projectGroupsResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)/groups/:groupID(\\d+)",
        name: routeNames.groupBoard,
        component: GroupBoard,
        meta: {
          guard: groupBoardGuard,
          resolver: groupBoardResolver
        }
      },
      // Add legacy routes for retro-compatibility
      ...legacyRoutes,
      {
        // Show 'page not found' view for unknown routes
        path: "/:path(.*)*",
        name: routeNames.pageNotFound,
        component: PageNotFound
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
router.beforeEach(async route => {
  if (route.meta && route.meta.guard) {
    const result = await route.meta.guard(route);
    return result;
  }
});

router.beforeResolve(async route => {
  const resolvers = route.matched
    .filter(r => r.meta && r.meta.resolver)
    .map(r => r.meta.resolver);

  for (const resolver of resolvers) {
    await resolver(route);
  }
});

export { routeNames };

export default router;
