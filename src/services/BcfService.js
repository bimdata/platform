import apiClient from "./api-client.js";

class BcfService {
  // --- BCF Topics API ---

  async fetchProjectTopics(project) {
    try {
      return await apiClient.bcfApi.getTopics({
        projectsPk: project.id
      });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchTopicViewpoints(project, topic, imgFormat = null) {
    try {
      return await apiClient.bcfApi.getTopicViewpoints({
        projectsPk: project.id,
        topicsGuid: topic.guid,
        imgFormat: imgFormat ? "url" : null
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

  async createFullTopic(project, topic) {
    try {
      await fetch(
        `${process.env.VUE_APP_API_BASE_URL}/bcf/2.1/projects/${project.id}/full-topic`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...apiClient.authHeader
          },
          body: JSON.stringify(topic)
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async updateFullTopic(project, topic, data) {
    try {
      return await fetch(
        `${process.env.VUE_APP_API_BASE_URL}/bcf/2.1/projects/${project.id}/full-topic/${topic.guid}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            ...apiClient.authHeader
          },
          body: JSON.stringify(data)
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async createViewpoint(project, topic, viewpoint) {
    try {
      return await apiClient.bcfApi.createViewpoint({
        projectsPk: project.id,
        topicsGuid: topic.guid,
        data: viewpoint
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteViewpoint(project, topic, viewpoint) {
    try {
      return await apiClient.bcfApi.deleteViewpoint({
        projectsPk: project.id,
        topicsGuid: topic.guid,
        guid: viewpoint.guid
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
            ...apiClient.authHeader
          },
          body: formData
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async exportBcf(project) {
    try {
      return await fetch(
        `${process.env.VUE_APP_API_BASE_URL}/bcf/2.1/projects/${project.id}/export`,
        {
          method: "GET",
          headers: {
            ...apiClient.authHeader
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  // --- BCF Extensions API ---

  async fetchExtensions(project) {
    try {
      return await apiClient.bcfApi.getExtensions({
        id: project.id
      });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchDetailedExtensions(project) {
    try {
      return await apiClient.bcfApi.getDetailedExtensions({
        id: project.id
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createExtension(project, extensionType, data) {
    try {
      return await apiClient.bcfApi["createExtension" + extensionType]({
        projectsPk: project.id,
        data
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateExtension(project, extensionType, extensionId, data) {
    try {
      return await apiClient.bcfApi["updateExtension" + extensionType]({
        projectsPk: project.id,
        id: extensionId,
        data
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteExtension(project, extensionType, priority) {
    try {
      return await apiClient.bcfApi["deleteExtension" + extensionType]({
        projectsPk: project.id,
        id: priority.id
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

  // --- BCF Topic Comments API ---

  async fetchAllComments(project, topic) {
    try {
      return await apiClient.bcfApi.getComments({
        projectsPk: project.id,
        topicsGuid: topic.guid
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createComment(project, topic, data) {
    try {
      return await apiClient.bcfApi.createComment({
        projectsPk: project.id,
        topicsGuid: topic.guid,
        data
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateComment(project, topic, comment, data) {
    try {
      return await apiClient.bcfApi.updateComment({
        projectsPk: project.id,
        topicsGuid: topic.guid,
        guid: comment.guid,
        data
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteComment(project, topic, comment) {
    try {
      return await apiClient.bcfApi.deleteComment({
        projectsPk: project.id,
        topicsGuid: topic.guid,
        guid: comment.guid
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const service = new BcfService();

export default service;
