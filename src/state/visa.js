import async from "async";
import VisaService from "@/services/VisaService.js";
import FileService from "@/services/FileService.js";

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
  const [visaInfo, document] = await Promise.all([
    VisaService.fetchVisa(project, visa),
    FileService.getDocument(project, { id: visa.document_id })
  ]);

  return {
    ...visaInfo,
    document
  };
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
  const visas = await VisaService.fetchCreatedVisas(project);

  const visasWithDoc = await async.mapLimit(visas, 20, async visa => ({
    ...visa,
    document: await FileService.getDocument(project, { id: visa.document_id })
  }));

  return visasWithDoc.sort((a, b) =>
    a.created_at.getTime() < b.created_at.getTime() ? 1 : -1
  );
};

const fetchToValidateVisas = async project => {
  const visas = await VisaService.fetchToValidateVisas(project);

  const visasWithDoc = await async.mapLimit(visas, 20, async visa => ({
    ...visa,
    document: await FileService.getDocument(project, { id: visa.document_id })
  }));

  return visasWithDoc.sort((a, b) =>
    a.created_at.getTime() < b.created_at.getTime() ? 1 : -1
  );
};

const updateVisa = async (project, document, visa, data) => {
  return VisaService.updateVisa(project, document, visa, data);
};

const fetchAllComments = async (project, document, visa) => {
  return VisaService.getVisaComments(project, document, visa);
};

const createComment = async (project, document, visa, data) => {
  return VisaService.createVisaComment(project, document, visa, data);
};

const updateComment = async (project, document, visa, comment, data) => {
  return VisaService.updateVisaComment(project, document, visa, comment, data);
};

const deleteComment = async (project, document, visa, comment) => {
  return VisaService.deleteVisaComment(project, document, visa, comment);
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
