import VisaService from "@/services/VisaService";

const createVisa = async (description, date, baseInfo) => {
  return VisaService.createVisa(description, date, baseInfo);
};

const createValidation = async (visaId, validatorId, baseInfo) => {
  return VisaService.createValidation(visaId, validatorId, baseInfo);
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

const fetchCreatedVisas = async baseInfo => {
  return VisaService.fetchCreatedVisas(baseInfo);
};

const fetchToValidateVisas = async baseInfo => {
  return VisaService.fetchToValidateVisas(baseInfo);
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
    fetchCreatedVisas,
    fetchToValidateVisas
  };
}
