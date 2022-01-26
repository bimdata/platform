import VisaService from "@/services/VisaService";

const createVisa = async (project, document, visa) => {
  return VisaService.createVisa(project, document, visa);
};

const createValidation = async (project, document, visa, validatorId) => {
  return VisaService.createValidation(project, document, visa, validatorId);
};

const deleteValidation = async (visaId, validatorId, baseInfo) => {
  return VisaService.deleteValidation(visaId, validatorId, baseInfo);
};

const fetchVisa = async (visaId, baseInfo) => {
  return VisaService.fetchVisa(visaId, baseInfo);
};

const acceptVisa = async (validationId, visaId, baseInfo) => {
  return VisaService.acceptVisa(validationId, visaId, baseInfo);
};

const denyVisa = async (validationId, visaId, baseInfo) => {
  return VisaService.denyVisa(validationId, visaId, baseInfo);
};

const resetVisa = async (validationId, visaId, baseInfo) => {
  return VisaService.resetVisa(validationId, visaId, baseInfo);
};

const deleteVisa = async (validationId, visaId, baseInfo) => {
  return VisaService.deleteVisa(validationId, visaId, baseInfo);
};

const closeVisa = async (validationId, visaId, baseInfo) => {
  return VisaService.closeVisa(validationId, visaId, baseInfo);
};

const resumeVisa = async (visaId, baseInfo) => {
  return VisaService.resumeVisa(visaId, baseInfo);
};

const fetchCreatedVisas = async baseInfo => {
  return VisaService.fetchCreatedVisas(baseInfo);
};

const fetchToValidateVisas = async baseInfo => {
  return VisaService.fetchToValidateVisas(baseInfo);
};

const updateVisa = async (visaId, baseInfo, data) => {
  return VisaService.updateVisa(visaId, baseInfo, data);
};

export function useVisa() {
  return {
    // Methods
    createVisa,
    createValidation,
    fetchVisa,
    acceptVisa,
    denyVisa,
    resetVisa,
    deleteVisa,
    closeVisa,
    resumeVisa,
    fetchCreatedVisas,
    fetchToValidateVisas,
    deleteValidation,
    updateVisa
  };
}
