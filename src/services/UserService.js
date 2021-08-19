import apiClient from "./api-client";

class UserService {
  fetchUserData() {
    return apiClient.collaborationApi.getSelfUser();
  }
}

const service = new UserService();

export default service;
