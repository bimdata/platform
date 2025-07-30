import { fullName } from "./users.js";
import { VISA_STATUS, VALIDATION_STATUS } from "../config/visa.js";

export const enhanceVisa = (visa, user, t, handler) => {
  const validationType = () => {
    if (visa.status === VISA_STATUS.CLOSE) {
      return t("Visa.view.visaClosed");
    }
    if (fullName(user) === fullName(visa.creator)) {
      return t("Visa.view.myRequests");
    } else {
      return t("Visa.view.visaPending");
    }
  };

  const statutType = () => {
    const visaStatuses = visa.validations.map((validation) => validation.status);
    const isDelay = (visa) => {
      const todayDate = new Date();
      return visa.deadline < todayDate.setDate(todayDate.getDate() - 1);
    };

    if (visaStatuses.some((status) => status === VALIDATION_STATUS.ACCEPT)) {
      return t("Visa.view.valid");
    } else if (visaStatuses.some((status) => status === VALIDATION_STATUS.DENY)) {
      return t("Visa.view.denied");
    } else if (isDelay(visa) && visa.status !== VISA_STATUS.ACCEPT) {
      return t("Visa.view.overdue");
    } else if (visaStatuses.every((status) => status === VALIDATION_STATUS.PENDING)) {
      return t("Visa.view.pending");
    }
  };

  const getUniqueValidators = () => {
    const validators = visa.validations.map((validation) => validation.validator).filter(Boolean);
    const emailValidators = [...new Set(validators.map((validator) => validator.email))];
    return emailValidators;
  };

  const document = handler.get({ id: visa.document.head_id ?? visa.document.id, nature: "Document" });

  return {
    ...visa,
    validationType: validationType(),
    statutType: statutType(),
    validators: getUniqueValidators(),
    document: {
      ...visa.document,
      file: document.file,
      file_name: document.file_name,
      model_id: document.model_id,
      model_type: document.model_type,
    },
  };
};
