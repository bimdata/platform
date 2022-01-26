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

  async deleteValidation(validationId, visaId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.deleteValidation({
        cloudPk,
        projectPk,
        documentPk,
        visaPk: visaId,
        id: validationId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DELETE_VALIDATION_ERROR, error);
    }
  }

  async fetchVisa(project, visa) {
    // console.log("visa.document", visa.document);
    // console.log("visa.document.id", visa.document.id);

    console.log("object for fetch", {
      cloudPk: project.cloud.id,
      projectPk: project.id,
      documentPk: visa.document.id,
      id: visa.id
    });

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

  async acceptVisa(validationId, visaId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.acceptValidation({
        cloudPk,
        projectPk,
        documentPk,
        visaPk: visaId,
        id: validationId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_ACCEPT_ERROR, error);
    }
  }

  async denyVisa(validationId, visaId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.denyValidation({
        cloudPk,
        projectPk,
        documentPk,
        visaPk: visaId,
        id: validationId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DENY_ERROR, error);
    }
  }

  async resetVisa(validationId, visaId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.resetValidation({
        cloudPk,
        projectPk,
        documentPk,
        visaPk: visaId,
        id: validationId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_REFRESH_ERROR, error);
    }
  }

  async deleteVisa(visaId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.deleteVisa({
        cloudPk,
        projectPk,
        documentPk,
        id: visaId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DELETE_ERROR, error);
    }
  }

  async closeVisa(visaId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.closeVisa({
        cloudPk,
        projectPk,
        documentPk,
        id: visaId
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

  async fetchCreatedVisas(baseInfo) {
    const { cloudPk, projectPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.getProjectCreatorVisas({
        cloudPk,
        projectPk
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FECTH_CREATED_ERROR, error);
    }
  }

  async fetchToValidateVisas(baseInfo) {
    const { cloudPk, projectPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.getProjectValidatorVisas({
        cloudPk,
        projectPk
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_FECTH_VALIDATOR_ERROR, error);
    }
  }

  async updateVisa(visaId, baseInfo, data) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.updateVisa({
        data,
        cloudPk,
        projectPk,
        documentPk,
        id: visaId
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_UPDATE_ERROR, error);
    }
  }
}

const service = new VisaService();

export default service;
