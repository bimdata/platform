import { computed, reactive, readonly, toRefs } from "vue";
import OrganizationService from "@/services/OrganizationService.js";
import { useSpaces } from "@/state/spaces.js";

const { userSpaces } = useSpaces();
const userSpacesIDs = computed(() => userSpaces.value.map(s => s.id));

const state = reactive({
  userOrganizations: [],
  organizationsSpaces: {},
  organizationsUserSpaces: {}
});

const resetState = () => {
  state.userOrganizations = [];
  state.organizationsSpaces = {};
};

const retrieveUserOrganizations = async () => {
  const organizations = await OrganizationService.fetchUserOrganizations();
  organizations.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  state.userOrganizations = organizations;
  return organizations;
};

const retrieveOrganizationSpaces = async organization => {
  const spaces = await OrganizationService.fecthOrganizationSpaces(
    organization
  );
  state.organizationsSpaces[organization.id] = spaces;
  state.organizationsUserSpaces[organization.id] = spaces.filter(space =>
    userSpacesIDs.value.includes(space.id)
  );
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

const getOrganizationUserSpaces = organization => {
  return readonly(state.organizationsUserSpaces[organization?.id] || []);
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
  const updatedOrganizations = [organization].concat(
    spaces.map(space => space.organization)
  );
  await Promise.all(
    updatedOrganizations.map(orga => retrieveOrganizationSpaces(orga))
  );
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
    getOrganizationUserSpaces,
    createOrganization,
    updateOrganization,
    importOrganizationSpaces,
    deleteOrganization,
    softUpdateOrganization,
    softDeleteOrganization
  };
}
