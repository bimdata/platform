/**
 * This module exports route records for retro-compatible URLs.
 * Those URLs are needed to be able to use paths from the old platform on the new one.
 */

import routeNames from "./route-names.js";

const routes = [
  {
    path: "/cloud/:spaceID(\\d+)",
    redirect: route => ({
      name: routeNames.spaceBoard,
      params: route.params
    })
  },
  {
    path: "/cloud/:spaceID(\\d+)/project/:projectID(\\d+)",
    redirect: route => ({
      name: routeNames.projectBoard,
      params: route.params
    })
  },
  {
    path: "/cloud/:spaceID(\\d+)/project/:projectID(\\d+)/viewer/:modelIDs",
    redirect: route => ({
      name: routeNames.modelViewer,
      params: route.params
    })
  },
  {
    path: "/cloud/:spaceID(\\d+)/project/:projectID(\\d+)/groups",
    redirect: route => ({
      name: routeNames.projectGroups,
      params: route.params
    })
  },
  {
    path: "/cloud/:spaceID(\\d+)/project/:projectID(\\d+)/groups/:groupID(\\d+)",
    redirect: route => ({
      name: routeNames.groupBoard,
      params: route.params
    })
  }
];

export default routes;
