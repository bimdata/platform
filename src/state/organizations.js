import { reactive, readonly, toRefs } from "vue";
import OrganizationService from "@/services/OrganizationService.js";

const state = reactive({
  userOrganizations: [],
  organizationSpaces: []
});

const retrieveUserOrganizations = async () => {
  const organizations = await OrganizationService.fetchUserOrganizations();
  state.userOrganizations = organizations;
  return organizations;
};

const retrieveOrganizationSpaces = async organization => {
  const spaces = await OrganizationService.fecthOrganizationSpaces(
    organization
  );
  state.organizationSpaces = spaces;
  return spaces;
};

const createOrganization = async organization => {
  const newOrganization = await OrganizationService.createOrganization(
    organization
  );
  state.userOrganizations = [newOrganization].concat(state.userOrganizations);
  return newOrganization;
};

const updateOrganization = async organization => {
  const newOrganization = await OrganizationService.updateOrganization(
    organization
  );
  softUpdateOrganization(newOrganization);
  return newOrganization;
};

const deleteOrganization = async organization => {
  await OrganizationService.deleteOrganization(organization);
  softDeleteOrganization(organization);
  return organization;
};

const softUpdateOrganization = organization => {
  state.userOrganizations = state.userOrganizations.map(orga =>
    orga.id === organization.id ? { ...orga, ...organization } : orga
  );
  return organization;
};

const softDeleteOrganization = organization => {
  state.userOrganizations = state.userOrganizations.filter(
    orga => orga.id !== organization.id
  );
  return organization;
};

export function useOrganizations() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    retrieveUserOrganizations,
    retrieveOrganizationSpaces,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    softUpdateOrganization,
    softDeleteOrganization
  };
}