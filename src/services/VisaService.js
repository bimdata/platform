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
}

const service = new VisaService();

export default service;
