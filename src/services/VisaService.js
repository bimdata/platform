import apiClient from "./api-client.js";
import { ERRORS, RuntimeError } from "./ErrorService.js";

class VisaService {
  async createVisa(project, document, visa) {
    try {
      return await apiClient.collaborationApi.createVisa(
        project.cloud.id,
        document.id,
        project.id,
        visa
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_CREATE_ERROR, error);
    }
  }

  async createValidation(project, document, visa, validator_id) {
    try {
      return await apiClient.collaborationApi.createValidation(
        project.cloud.id,
        document.id,
        project.id,
        visa.id,
        {
          validator_id
        }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_CREATE_VALIDATION_ERROR, error);
    }
  }

  async deleteValidation(project, document, visa, validationId) {
    try {
      return await apiClient.collaborationApi.deleteValidation(
        project.cloud.id,
        document.id,
        validationId,
        project.id,
        visa.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DELETE_VALIDATION_ERROR, error);
    }
  }

  async fetchVisa(project, visa) {
    try {
      return await apiClient.collaborationApi.getVisa(
        project.cloud.id,
        visa.document_id,
        visa.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FETCH_ERROR, error);
    }
  }

  async acceptValidation(project, document, visa, validationId) {
    try {
      return await apiClient.collaborationApi.acceptValidation(
        project.cloud.id,
        document.id,
        validationId,
        project.id,
        visa.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_ACCEPT_ERROR, error);
    }
  }

  async denyValidation(project, document, visa, validationId) {
    try {
      return await apiClient.collaborationApi.denyValidation(
        project.cloud.id,
        document.id,
        validationId,
        project.id,
        visa.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DENY_ERROR, error);
    }
  }

  async resetValidation(project, document, visa, validationId) {
    try {
      return await apiClient.collaborationApi.resetValidation(
        project.cloud.id,
        document.id,
        validationId,
        project.id,
        visa.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_REFRESH_ERROR, error);
    }
  }

  async deleteVisa(project, document, visa) {
    try {
      return await apiClient.collaborationApi.deleteVisa(
        project.cloud.id,
        document.id,
        visa.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DELETE_ERROR, error);
    }
  }

  async closeVisa(project, document, visa) {
    try {
      return await apiClient.collaborationApi.closeVisa(
        project.cloud.id,
        document.id,
        visa.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_CLOSE_ERROR, error);
    }
  }

  async resumeVisa(visaId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.resumeVisa(
        cloudPk,
        documentPk,
        visaId,
        projectPk
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_RESUME_ERROR, error);
    }
  }

  async fetchCreatedVisas(project) {
    try {
      return await apiClient.collaborationApi.getProjectCreatorVisas(
        project.cloud.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FECTH_CREATED_ERROR, error);
    }
  }

  async fetchToValidateVisas(project) {
    try {
      return await apiClient.collaborationApi.getProjectValidatorVisas(
        project.cloud.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FECTH_VALIDATOR_ERROR, error);
    }
  }

  async updateVisa(project, document, visa, data) {
    try {
      return await apiClient.collaborationApi.updateVisa(
        project.cloud.id,
        document.id,
        visa.id,
        project.id,
        data
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_UPDATE_ERROR, error);
    }
  }

  async getVisaComments(project, document, visa) {
    try {
      return await apiClient.collaborationApi.getVisaComments(
        project.cloud.id,
        document.id,
        project.id,
        visa.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FETCH_ALL_COMMENTS_ERROR, error);
    }
  }

  async createVisaComment(project, document, visa, data) {
    try {
      return await apiClient.collaborationApi.createVisaComment(
        project.cloud.id,
        document.id,
        project.id,
        visa.id,
        data
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_CREATE_COMMENTS_ERROR, error);
    }
  }

  async updateVisaComment(project, document, visa, comment, data) {
    try {
      return await apiClient.collaborationApi.updateVisaComment(
        project.cloud.id,
        document.id,
        comment.id,
        project.id,
        visa.id,
        data
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_UPDATE_COMMENT_ERROR, error);
    }
  }

  async deleteVisaComment(project, document, visa, comment) {
    try {
      return await apiClient.collaborationApi.deleteVisaComment(
        project.cloud.id,
        document.id,
        comment.id,
        project.id,
        visa.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DELETE_COMMENT_ERROR, error);
    }
  }
}

const service = new VisaService();

export default service;
