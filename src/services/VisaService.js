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
}

const service = new VisaService();

export default service;
