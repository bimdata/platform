import { privateApiClient } from "./api-client.js";
import { ERRORS, RuntimeError } from "./ErrorService.js";

class OrganizationService {
  async fetchUserOrganizations() {
    try {
      return await privateApiClient.get("/organization");
    } catch (error) {
      return [];
    }
  }

  async fetchOrganizationSpaces(organization) {
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
      const data = new FormData();
      data.append("name", organization.name);
      if (organization.logo) {
        data.append("logo", organization.logo);
      }
      return await privateApiClient.post("/organization", data, {
        json: false
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.ORGANIZATION_CREATE_ERROR, error);
    }
  }

  async updateOrganization(organization) {
    try {
      const data = new FormData();
      data.append("name", organization.name);
      if (organization.logo) {
        data.append("logo", organization.logo);
      }
      return await privateApiClient.patch(
        `/organization/${organization.id}`,
        data,
        { json: false }
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
        `/organization/${space.organization.id}/cloud/${space.id}/update-org`,
        { organization: organization.id }
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.SPACE_UPDATE_ERROR, error);
    }
  }
}

const service = new OrganizationService();

export default service;
