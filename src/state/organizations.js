import OrganizationService from "@/services/OrganizationService.js";

const retrieveOrganizations = async () => {
  return await OrganizationService.retrieveOrganizations();
};

const createOrganization = async () => {
  // TODO
};

const updateOrganization = async () => {
  // TODO
};

const deleteOrganization = async () => {
  // TODO
};

export function useOrganizations() {
  return {
    // Methods
    retrieveOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization
  };
}
