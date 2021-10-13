import { reactive, readonly, toRefs } from "vue";
import OrganizationService from "@/services/OrganizationService.js";

const state = reactive({
  userOrganizations: [],
  organizationsSpaces: {}
});

const resetState = () => {
  state.userOrganizations = [];
  state.organizationSpaces = {};
};

const retrieveUserOrganizations = async () => {
  const organizations = await OrganizationService.fetchUserOrganizations();
  organizations.sort((a, b) => (a.name < b.name ? 1 : -1));
  state.userOrganizations = organizations;
  return organizations;
};

const retrieveOrganizationSpaces = async organization => {
  const spaces = await OrganizationService.fecthOrganizationSpaces(
    organization
  );
  state.organizationsSpaces[organization.id] = spaces;
  return spaces;
};

const retrieveAllOrganizationsSpaces = async () => {
  return (
    await Promise.all(
      state.userOrganizations.map(orga => retrieveOrganizationSpaces(orga))
    )
  ).reduce((acc, spaces) => acc.concat(spaces), []);
};

const getOrganizationSpaces = organization => {
  return readonly(state.organizationsSpaces[organization?.id] || []);
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

const importOrganizationSpaces = async (organization, spaces) => {
  const importedSpaces = await Promise.all(
    spaces.map(space =>
      OrganizationService.updateSpaceOrganization(space, organization)
    )
  );
  await retrieveOrganizationSpaces(organization);
  return importedSpaces;
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
    resetState,
    retrieveUserOrganizations,
    retrieveOrganizationSpaces,
    retrieveAllOrganizationsSpaces,
    getOrganizationSpaces,
    createOrganization,
    updateOrganization,
    importOrganizationSpaces,
    deleteOrganization,
    softUpdateOrganization,
    softDeleteOrganization
  };
}
