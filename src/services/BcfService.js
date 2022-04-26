import apiClient from "./api-client.js";

class BcfService {
  // --- BCF Topics API ---

  async fetchProjectTopics(project) {
    try {
      return await apiClient.bcfApi.getTopics(project.id);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchTopicViewpoints(project, topic, imgFormat = null) {
    try {
      return await apiClient.bcfApi.getTopicViewpoints(
        project.id,
        topic.guid,
        imgFormat ? "url" : null
      );
    } catch (error) {
      console.log(error);
    }
  }

  async createTopic(project, topic) {
    try {
      return await apiClient.bcfApi.createTopic(project.id, topic);
    } catch (error) {
      console.log(error);
    }
  }

  async createFullTopic(project, topic) {
    try {
      return await apiClient.bcfApi.createFullTopic(project.id, topic);
    } catch (error) {
      console.log(error);
    }
  }

  async updateFullTopic(project, topic, data) {
    try {
      return await apiClient.bcfApi.updateFullTopic(
        topic.guid,
        project.id,
        data
      );
    } catch (error) {
      console.log(error);
    }
  }

  async createViewpoint(project, topic, viewpoint) {
    try {
      return await apiClient.bcfApi.createViewpoint(
        project.id,
        topic.guid,
        viewpoint
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteViewpoint(project, topic, viewpoint) {
    try {
      return await apiClient.bcfApi.deleteViewpoint(
        viewpoint.guid,
        project.id,
        topic.guid
      );
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
      return await apiClient.bcfApi.downloadBcfExport(project.id);
    } catch (error) {
      console.log(error);
    }
  }

  // --- BCF Extensions API ---

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

  async createExtension(project, extensionType, data) {
    try {
      return await apiClient.bcfApi["createExtension" + extensionType](
        project.id,
        data
      );
    } catch (error) {
      console.log(error);
    }
  }

  async updateExtension(project, extensionType, extensionId, data) {
    try {
      return await apiClient.bcfApi["updateExtension" + extensionType](
        extensionId,
        project.id,
        data
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteExtension(project, extensionType, extension) {
    try {
      return await apiClient.bcfApi["deleteExtension" + extensionType](
        extension.id,
        project.id
      );
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
      return await apiClient.bcfApi.getComments(project.id, topic.guid);
    } catch (error) {
      console.log(error);
    }
  }

  async createComment(project, topic, data) {
    try {
      return await apiClient.bcfApi.createComment(project.id, topic.guid, data);
    } catch (error) {
      console.log(error);
    }
  }

  async updateComment(project, topic, comment, data) {
    try {
      return await apiClient.bcfApi.updateComment(
        comment.guid,
        project.id,
        topic.guid,
        data
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteComment(project, topic, comment) {
    try {
      return await apiClient.bcfApi.deleteComment(
        comment.guid,
        project.id,
        topic.guid
      );
    } catch (error) {
      console.log(error);
    }
  }
}

const service = new BcfService();

export default service;
