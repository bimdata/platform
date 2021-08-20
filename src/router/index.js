import { createRouter, createWebHistory } from "vue-router";
import authGuard from "./guards/auth";
import groupBoardResolver from "./resolvers/group-board";
import modelViewerResolver from "./resolvers/model-viewer";
import projectBoardResolver from "./resolvers/project-board";
import projectGroupsResolver from "./resolvers/project-groups";
import rootResolver from "./resolvers/root";
import spaceBoardResolver from "./resolvers/space-board";

// Route components
import Layout from "@/Layout";
import OidcCallback from "@/views/oidc-callback/OidcCallback";
import OidcCallbackError from "@/views/oidc-callback-error/OidcCallbackError";

// Lazy loaded view components
/* eslint-disable */
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/Dashboard");
const GroupBoard = () =>
  import(/* webpackChunkName: "group-board" */ "@/views/group-board/GroupBoard");
const ModelViewer = () =>
  import(/* webpackChunkName: "model-viewer" */ "@/views/model-viewer/ModelViewer");
const ProjectBoard = () =>
  import(/* webpackChunkName: "project-board" */ "@/views/project-board/ProjectBoard");
const ProjectGroups = () =>
  import(/* webpackChunkName: "project-groups" */ "@/views/project-groups/ProjectGroups");
const SpaceBoard = () =>
  import(/* webpackChunkName: "space-board" */ "@/views/space-board/SpaceBoard");
const UserProjects = () =>
  import(/* webpackChunkName: "user-projects" */ "@/views/user-projects/UserProjects");
const UserSpaces = () =>
  import(/* webpackChunkName: "user-spaces" */ "@/views/user-spaces/UserSpaces");
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
