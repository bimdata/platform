import apiClient from "./api-client.js";

class BcfService {
  async fetchProjectTopics(project) {
    try {
      return await apiClient.bcfApi.getTopics({
        projectsPk: project.id
      });
    } catch (error) {
      console.log(error);
    }
  }
  async fetchTopicViewpoints(project, topic) {
    try {
      return await apiClient.bcfApi.getTopicViewpoints({
        projectsPk: project.id,
        topicsGuid: topic.guid
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const service = new BcfService();

export default service;
