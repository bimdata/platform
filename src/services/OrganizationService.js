import { privateApiClient } from "./api-client.js";
import { ERRORS, ErrorService, RuntimeError } from "./ErrorService.js";

class OrganizationService {
  async fetchUserOrganizations() {
    try {
      return await privateApiClient.get("/organization");
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.ORGANIZATIONS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fecthOrganizationSpaces(organization) {
    try {
      return await privateApiClient.get(
        `/organization/${organization.id}/cloud`
      );
    } catch (error) {
      return [];
    }
  }

  async createOrganization(organization) {
    try {
      return await privateApiClient.post("/organization", organization);
    } catch (error) {
      throw new RuntimeError(ERRORS.ORGANIZATION_CREATE_ERROR, error);
    }
  }

  async updateOrganization(organization) {
    try {
      return await privateApiClient.patch(
        `/organization/${organization.id}`,
        organization
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.ORGANIZATION_UPDATE_ERROR, error);
    }
  }

  async deleteOrganization(organization) {
    try {
      return await privateApiClient.delete(`/organization/${organization.id}`);
    } catch (error) {
      throw new RuntimeError(ERRORS.ORGANIZATION_DELETE_ERROR, error);
    }
  }

  async updateSpaceOrganization(space, organization) {
    try {
      return await privateApiClient.patch(
        `/organization/${organization.id}/cloud/${space.id}/update-org`,
        { organization: organization.id }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.SPACE_UPDATE_ERROR, error);
    }
  }
}

const service = new OrganizationService();

export default service;
