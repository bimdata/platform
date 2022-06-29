import apiClient from "./api-client";
import { ERRORS, RuntimeError } from "./ErrorService";

class TagService {
  async fetchAllTags(project) {
    try {
      return await apiClient.collaborationApi.getTags(
        project.cloud.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.TAGS_FETCH_ERROR, error);
    }
  }

  async createTag(project, data) {
    try {
      return await apiClient.collaborationApi.createTag(
        project.cloud.id,
        project.id,
        data
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.TAGS_CREATE_ERROR, error);
    }
  }

  async updateTag(project, tag, data) {
    try {
      return await apiClient.collaborationApi.updateTag(
        project.cloud.id,
        tag.id,
        project.id,
        data
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.TAGS_UPDATE_ERROR, error);
    }
  }

  async deleteTag(project, tag) {
    try {
      return await apiClient.collaborationApi.deleteTag(
        project.cloud.id,
        tag.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.TAGS_DELETE_ERROR, error);
    }
  }

  async addDocumentTag(project, document, tag) {
    try {
      return await apiClient.collaborationApi.addDocumentTag(
        project.cloud.id,
        document.id,
        project.id,
        {
          tagId: tag.id
        }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.TAGS_ADD_DOCUMENT_ERROR, error);
    }
  }

  async deleteDocumentTag(project, document, tag) {
    try {
      return await apiClient.collaborationApi.deleteDocumentTag(
        project.cloud.id,
        document.id,
        tag.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.TAGS_DELETE_DOCUMENT_ERROR, error);
    }
  }
}

const service = new TagService();

export default service;
