import apiClient from "./api-client";
import { ERRORS, RuntimeError } from "./ErrorService";

class VisaService {
  async createVisa(description, date, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.createVisa({
        data: {
          description,
          deadline: date
        },
        cloudPk,
        projectPk,
        documentPk
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_CREATE_ERROR, error);
    }
  }
  async createValidation(visaId, validatorId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.createValidation({
        data: {
          validatorId
        },
        cloudPk,
        projectPk,
        documentPk,
        visaPk: visaId
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

  async fetchVisa(visaId, baseInfo) {
    const { cloudPk, projectPk, documentPk } = baseInfo;
    try {
      return await apiClient.collaborationApi.getVisa({
        cloudPk,
        projectPk,
        documentPk,
        id: visaId
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
      throw new RuntimeError(ERRORS.VISA_DENY_ERROR, error);
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
