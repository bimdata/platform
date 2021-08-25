import { createRouter, createWebHistory } from "vue-router";
import authGuard from "./guards/auth.js";
import groupBoardResolver from "./resolvers/group-board.js";
import modelViewerResolver from "./resolvers/model-viewer.js";
import projectBoardResolver from "./resolvers/project-board.js";
import projectGroupsResolver from "./resolvers/project-groups.js";
import rootResolver from "./resolvers/root.js";
import spaceBoardResolver from "./resolvers/space-board.js";

// Route components
import Layout from "@/Layout.vue";
import OidcCallback from "@/views/oidc-callback/OidcCallback.vue";
import OidcCallbackError from "@/views/oidc-callback-error/OidcCallbackError.vue";
import PageNotFound from "@/views/page-not-found/PageNotFound.vue";

// Lazy loaded view components
/* eslint-disable */
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/Dashboard.vue");
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
  projectBoard: "project-board",
  modelViewer: "model-viewer",
  projectGroups: "project-groups",
  groupBoard: "group-board"
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
        path: "/spaces/:spaceID(\\d+)",
        name: routeNames.spaceBoard,
        component: SpaceBoard,
        meta: {
          resolver: spaceBoardResolver
        }
      },
      {
        path: "/spaces/:spaceID(\\d+)/projects/:projectID(\\d+)",
        name: routeNames.projectBoard,
        component: ProjectBoard,
        meta: {
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
          resolver: groupBoardResolver
        }
      },
      {
        // Show 'page not found' view for unknown routes
        path: "/:path(.*)*",
        name: routeNames.PageNotFound,
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
