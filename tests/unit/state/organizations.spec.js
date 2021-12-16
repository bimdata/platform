import { useOrganizations } from "../../../src/state/organizations.js";

// Mock Organization Service
jest.mock("../../../src/services/OrganizationService.js", () => {
  return {
    __esModule: true,
    default: {
      fetchUserOrganizations: jest.fn(() => [
        { id: 1, name: "Organization 1" },
        { id: 2, name: "Organization 2" },
      ]),
      fetchOrganizationSpaces: jest.fn(org => [
        { id: 123, name: "Space 123" },
        { id: 456, name: "Space 456" }
      ]),
      createOrganization: jest.fn(org => org),
      updateOrganization: jest.fn(org => org),
      deleteOrganization: jest.fn(org => org)
    }
  };
});

const {
  userOrganizations,
  resetState,
  retrieveUserOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization
} = useOrganizations();

describe("Organizations State", () => {
  beforeEach(async () => {
    resetState();
    await retrieveUserOrganizations();
  });

  it("Should load organizations list", async () => {
    expect(userOrganizations.value).toEqual([
      { id: 1, name: "Organization 1" },
      { id: 2, name: "Organization 2" },
    ]);
  });

  it("Should create organization", async () => {
    // Act
    await createOrganization({ id: 3, name: "New Organization" });
    // Assert
    expect(userOrganizations.value).toEqual([
      { id: 3, name: "New Organization" },
      { id: 1, name: "Organization 1" },
      { id: 2, name: "Organization 2" }
    ]);
  });

  it("Should update organization", async () => {
    // Act
    await updateOrganization({ id: 2, name: "Updated Orga" });
    // Assert
    expect(userOrganizations.value).toEqual([
      { id: 1, name: "Organization 1" },
      { id: 2, name: "Updated Orga" }
    ]);
  });

  it("Should create organization", async () => {
    // Act
    await deleteOrganization({ id: 2 });
    // Assert
    expect(userOrganizations.value).toEqual([
      { id: 1, name: "Organization 1" }
    ]);
  });
});
