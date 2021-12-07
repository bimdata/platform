import VisaService from "@/services/VisaService";

const createVisa = async (description, date, baseInfo) => {
  return VisaService.createVisa(description, date, baseInfo);
};

export function useVisa() {
  return {
    // Methods
    createVisa
  };
}
