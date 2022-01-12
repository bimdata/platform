import VisaService from "@/services/VisaService";

const createVisa = async (project, document, visa) => {
  return VisaService.createVisa(project, document, visa);
};

const createValidation = async (project, document, visa, validatorId) => {
  return VisaService.createValidation(project, document, visa, validatorId);
};

const deleteValidation = async (project, document, visa, validationId) => {
  return VisaService.deleteValidation(project, document, visa, validationId);
};

const fetchVisa = async (project, visa) => {
  return VisaService.fetchVisa(project, visa);
};

const acceptValidation = async (project, document, visa, validationId) => {
  return VisaService.acceptValidation(project, document, visa, validationId);
};

const denyValidation = async (project, document, visa, validationId) => {
  return VisaService.denyValidation(project, document, visa, validationId);
};

const resetValidation = async (project, document, visa, validationId) => {
  return VisaService.resetValidation(project, document, visa, validationId);
};

const deleteVisa = async (project, document, visa) => {
  return VisaService.deleteVisa(project, document, visa);
};

const closeVisa = async (project, document, visa) => {
  return VisaService.closeVisa(project, document, visa);
};

const resumeVisa = async (visaId, baseInfo) => {
  return VisaService.resumeVisa(visaId, baseInfo);
};

const fetchCreatedVisas = async project => {
  return (await VisaService.fetchCreatedVisas(project)).sort((a, b) =>
    a.createdAt.getTime() < b.createdAt.getTime() ? 1 : -1
  );
};

const fetchToValidateVisas = async project => {
  return (await VisaService.fetchToValidateVisas(project)).sort((a, b) =>
    a.createdAt.getTime() < b.createdAt.getTime() ? 1 : -1
  );
};

const updateVisa = async (project, document, visa, data) => {
  return VisaService.updateVisa(project, document, visa, data);
};

const fetchAllComments = async (visaId, baseInfo) => {
  return VisaService.getVisaComments(visaId, baseInfo);
};

const createComment = async (visaId, baseInfo, data) => {
  return VisaService.createVisaComment(visaId, baseInfo, data);
};

const updateComment = async (commentId, visaId, baseInfo, data) => {
  return VisaService.updateVisaComment(commentId, visaId, baseInfo, data);
};

const deleteComment = async (commentId, visaId, baseInfo) => {
  return VisaService.deleteVisaComment(commentId, visaId, baseInfo);
};

export function useVisa() {
  return {
    // Methods
    createVisa,
    createValidation,
    fetchVisa,
    acceptValidation,
    denyValidation,
    resetValidation,
    deleteVisa,
    closeVisa,
    resumeVisa,
    fetchCreatedVisas,
    fetchToValidateVisas,
    deleteValidation,
    updateVisa,
    fetchAllComments,
    createComment,
    updateComment,
    deleteComment
  };
}
