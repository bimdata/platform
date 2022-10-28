import { downloadBlobAs } from "../utils/download.js";

import apiClient from "./api-client.js";
import { ERRORS, RuntimeError } from "./ErrorService.js";

class BcfService {
  async fetchProjectTopics(project) {
    try {
      return await apiClient.bcfApi.getTopics(project.id);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchTopicViewpoints(project, topic, imgFormat = "url") {
    try {
      return await apiClient.bcfApi.getTopicViewpoints(
        project.id,
        topic.guid,
        imgFormat
      );
    } catch (error) {
      console.log(error);
    }
  }

  async fetchTopicComments(project, topic) {
    try {
      return await apiClient.bcfApi.getComments(project.id, topic.guid);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchExtensions(project) {
    try {
      return await apiClient.bcfApi.getExtensions(project.id);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchDetailedExtensions(project) {
    try {
      return await apiClient.bcfApi.getDetailedExtensions(project.id);
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
        `${process.env.VUE_APP_API_BASE_URL}/bcf/2.1/projects/${
          project.id
        }/import`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            ...apiClient.authHeader
          },
          body: formData
        }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.BCF_IMPORT_ERROR, error);
    }
  }

  async exportBcf(project) {
    try {
      const response = await apiClient.bcfApi.downloadBcfExport(project.id);
      downloadBlobAs(`${project.name}.bcf`, response);
    } catch (error) {
      throw new RuntimeError(ERRORS.BCF_IMPORT_ERROR, error);
    }
  }
}

const service = new BcfService();

export default service;
