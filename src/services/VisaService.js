import apiClient from "./api-client";
import { ERRORS, RuntimeError } from "./ErrorService";

class VisaService {
  async createVisa(project, document, visa) {
    try {
      return await apiClient.collaborationApi.createVisa({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        data: visa
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_CREATE_ERROR, error);
    }
  }

  async createValidation(project, document, visa, validatorId) {
    try {
      return await apiClient.collaborationApi.createValidation({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        visaPk: visa.id,
        data: {
          validatorId
        }
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_CREATE_VALIDATION_ERROR, error);
    }
  }

  async deleteValidation(project, document, visa, validationId) {
    try {
      return await apiClient.collaborationApi.deleteValidation({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        visaPk: visa.id,
        id: validationId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DELETE_VALIDATION_ERROR, error);
    }
  }

  async fetchVisa(project, visa) {
    try {
      return await apiClient.collaborationApi.getVisa({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: visa.document.id,
        id: visa.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FETCH_ERROR, error);
    }
  }

  async acceptValidation(project, document, visa, validationId) {
    try {
      return await apiClient.collaborationApi.acceptValidation({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        visaPk: visa.id,
        id: validationId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_ACCEPT_ERROR, error);
    }
  }

  async denyValidation(project, document, visa, validationId) {
    try {
      return await apiClient.collaborationApi.denyValidation({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        visaPk: visa.id,
        id: validationId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DENY_ERROR, error);
    }
  }

  async resetValidation(project, document, visa, validationId) {
    try {
      return await apiClient.collaborationApi.resetValidation({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        visaPk: visa.id,
        id: validationId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_REFRESH_ERROR, error);
    }
  }

  async deleteVisa(project, document, visa) {
    try {
      return await apiClient.collaborationApi.deleteVisa({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        id: visa.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DELETE_ERROR, error);
    }
  }

  async closeVisa(project, document, visa) {
    try {
      return await apiClient.collaborationApi.closeVisa({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        id: visa.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_CLOSE_ERROR, error);
    }
  }

  async resumeVisa(visaId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.resumeVisa({
        cloudPk,
        projectPk,
        documentPk,
        id: visaId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_RESUME_ERROR, error);
    }
  }

  async fetchCreatedVisas(project) {
    try {
      return await apiClient.collaborationApi.getProjectCreatorVisas({
        cloudPk: project.cloud.id,
        projectPk: project.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FECTH_CREATED_ERROR, error);
    }
  }

  async fetchToValidateVisas(project) {
    try {
      return await apiClient.collaborationApi.getProjectValidatorVisas({
        cloudPk: project.cloud.id,
        projectPk: project.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FECTH_VALIDATOR_ERROR, error);
    }
  }

  async updateVisa(project, document, visa, data) {
    try {
      return await apiClient.collaborationApi.updateVisa({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        id: visa.id,
        data
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_UPDATE_ERROR, error);
    }
  }

  async getVisaComments(project, document, visa) {
    try {
      return await apiClient.collaborationApi.getVisaComments({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        visaPk: visa.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FETCH_ALL_COMMENTS_ERROR, error);
    }
  }

  async createVisaComment(project, document, visa, data) {
    try {
      return await apiClient.collaborationApi.createVisaComment({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        visaPk: visa.id,
        data
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_CREATE_COMMENTS_ERROR, error);
    }
  }

  async updateVisaComment(project, document, visa, comment, data) {
    try {
      return await apiClient.collaborationApi.updateVisaComment({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        visaPk: visa.id,
        id: comment.id,
        data
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_UPDATE_COMMENT_ERROR, error);
    }
  }

  async deleteVisaComment(project, document, visa, comment) {
    try {
      return await apiClient.collaborationApi.deleteVisaComment({
        cloudPk: project.cloud.id,
        projectPk: project.id,
        documentPk: document.id,
        visaPk: visa.id,
        id: comment.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DELETE_COMMENT_ERROR, error);
    }
  }
}

const service = new VisaService();

export default service;
