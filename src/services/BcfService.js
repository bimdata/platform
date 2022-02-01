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
  async fetchTopicExtensions(project) {
    try {
      return await apiClient.bcfApi.getExtensions({
        projectsPk: project.id
      });
    } catch (error) {
      console.log(error);
    }
  }
  async createTopic(project, topic) {
    try {
      return await apiClient.bcfApi.createTopic({
        projectsPk: project.id,
        data: topic
      });
    } catch (error) {
      console.log(error);
    }
  }
  async deleteTopic(project, topic) {
    try {
      return await apiClient.bcfApi.deleteTopic({
        projectsPk: project.id,
        guid: topic.guid
      });
    } catch (error) {
      console.log(error);
    }
  }
  async importBcf(project, file) {
    try {
      const formData = new FormData();
      formData.append("name", file.name);
      formData.append("file", file);
      await fetch(
        `${process.env.VUE_APP_API_BASE_URL}/bcf/2.1/projects/${project.id}/import`,
        {
          method: "POST",
          headers: {
            authorization: apiClient.config.accessToken()
          },
          body: formData
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

const service = new BcfService();

export default service;
