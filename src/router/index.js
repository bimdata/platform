import { createRouter, createWebHistory } from "vue-router";
import { contexts, useLoadingContext } from "@/composables/loading.js";
import { IS_SUBSCRIPTION_ENABLED } from "@/config/subscription.js";
import routeNames from "./route-names.js";
import legacyRoutes from "./legacy.js";
import subscriptionRoutes from "./subscription.js";

// Guards
import authGuard from "./guards/auth.js";
import dataGuard from "./guards/data.js";
import groupBoardGuard from "./guards/views/group-board.js";
import projectBoardGuard from "./guards/views/project-board.js";
import spaceBoardGuard from "./guards/views/space-board.js";

// Resolvers
import groupBoardResolver from "./resolvers/views/group-board.js";
import modelViewerResolver from "./resolvers/views/model-viewer.js";
import projectBoardResolver from "./resolvers/views/project-board.js";
import projectGroupsResolver from "./resolvers/views/project-groups.js";
import spaceBoardResolver from "./resolvers/views/space-board.js";

// Route components
import AppLayout from "@/AppLayout.vue";
import OidcCallback from "@/views/oidc-callback/OidcCallback.vue";
import OidcCallbackError from "@/views/oidc-callback-error/OidcCallbackError.vue";
import PageNotFound from "@/views/page-not-found/PageNotFound.vue";
import sessionGuard from "./guards/session.js";

// Lazy loaded view components
const Dashboard = () => import("@/views/dashboard/Dashboard.vue");
const GroupBoard = () => import("@/views/group-board/GroupBoard.vue");
const ModelViewer = () => import("@/views/model-viewer/ModelViewer.vue");
const ProjectBoard = () => import("@/views/project-board/ProjectBoard.vue");
const ProjectGroups = () => import("@/views/project-groups/ProjectGroups.vue");
const SpaceBoard = () => import("@/views/space-board/SpaceBoard.vue");
const UserProjects = () => import("@/views/user-projects/UserProjects.vue");
const UserSpaces = () => import("@/views/user-spaces/UserSpaces.vue");

const {
  root,
  oidcCallback,
  oidcCallbackError,
  pageNotFound,
  dashboard,
  userSpaces,
  userProjects,
  spaceBoard,
  projectBoard,
  modelViewer,
  projectGroups,
  groupBoard,
  userSubscriptions
} = routeNames;

const routes = [
  {
    path: "/",
    name: root,
    component: AppLayout,
    meta: {
      // Protect this route and all its children with authentication
      requiresAuth: true
    },
    children: [
      {
        path: "",
        name: dashboard,
        component: Dashboard
      },
      {
        path: "/spaces",
        name: userSpaces,
        component: UserSpaces,
        meta: {
          back: dashboard
        }
      },
      {
        path: "/projects",
        name: userProjects,
        component: UserProjects,
        meta: {
          back: dashboard
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)",
        name: spaceBoard,
        component: SpaceBoard,
        meta: {
          backRoutes: [userSpaces, userSubscriptions],
          backDefault: userSpaces,
          guard: spaceBoardGuard,
          resolver: spaceBoardResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)",
        name: projectBoard,
        component: ProjectBoard,
        meta: {
          backRoutes: [spaceBoard, userProjects],
          backDefault: spaceBoard,
          guard: projectBoardGuard,
          resolver: projectBoardResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)/viewer/:modelIDs",
        name: modelViewer,
        component: ModelViewer,
        meta: {
          backDefault: projectBoard,
          resolver: modelViewerResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)/groups",
        name: projectGroups,
        component: ProjectGroups,
        meta: {
          back: projectBoard,
          resolver: projectGroupsResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)/groups/:groupID(\\d+)",
        name: groupBoard,
        component: GroupBoard,
        meta: {
          back: projectGroups,
          guard: groupBoardGuard,
          resolver: groupBoardResolver
        }
      },
      // Add subscription routes if enabled
      ...(IS_SUBSCRIPTION_ENABLED ? subscriptionRoutes : []),
      // Add legacy routes for retro-compatibility
      ...legacyRoutes,
      {
        // Show 'page not found' view for unknown routes
        path: "/:path(.*)*",
        name: pageNotFound,
        component: PageNotFound
      }
    ]
  },
  {
    // Should match `redirect_uri` path in oidcConfig
    path: "/oidc-callback",
    name: oidcCallback,
    component: OidcCallback
  },
  {
    path: "/oidc-callback-error",
    name: oidcCallbackError,
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

const loading = useLoadingContext(contexts.viewContainer);

router.beforeEach(() => (loading.value = true));
router.beforeEach(authGuard);
router.beforeEach(dataGuard);
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

router.afterEach(sessionGuard);
router.afterEach(() => (loading.value = false));

export default router;
