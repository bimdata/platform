import { apiClient, backendClient } from "./api-client.js";

class UserService {
  fetchUserData() {
    return apiClient.collaborationApi.getSelfUser();
  }

  fetchUserFavorites() {
    return backendClient.get("/fav/");
  }

  addFavoriteSpace(space) {
    return backendClient.post("/fav/clouds/", { cloud_id: space.id });
  }

  removeFavoriteSpace(space) {
    return backendClient.delete(`/fav/clouds/${space.id}/`);
  }

  addFavoriteProject(project) {
    return backendClient.post("/fav/projects/", { project_id: project.id });
  }

  removeFavoriteProject(project) {
    return backendClient.delete(`/fav/projects/${project.id}/`);
  }

  async fetchGuidedTours() {
    try {
      return await backendClient.get("/guidedtour/");
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  setGuidedTourComplete(tour) {
    return backendClient.post("/guidedtour/", { name: tour });
  }
}

const service = new UserService();

export default service;
