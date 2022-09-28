import { statusLimitNew, statusLimitActive } from "../../../src/config/projects.js";
import { projectStatus } from "../../../src/utils/projects.js";

describe("Projects Utils - project status", () => {
  let today;

  beforeEach(() => today = new Date());

  it("Should return 'new' if project has been created recently", () => {
    // Arrange
    const createDate = new Date();
    const updateDate = new Date();
    createDate.setDate(today.getDate() - 1);
    const project = {
      created_at: createDate,
      updated_at: updateDate
    };

    // Act
    const status = projectStatus(project);

    // Assert
    expect(status).toBe("new");
  });

  it("Should return 'active' if project has been modified recently", () => {
    // Arrange
    const createDate = new Date();
    const updateDate = new Date();
    createDate.setDate(today.getDate() - statusLimitNew - 1);
    updateDate.setDate(today.getDate() - statusLimitActive + 1);
    const project = {
      created_at: createDate,
      updated_at: updateDate
    };

    // Act
    const status = projectStatus(project);

    // Assert
    expect(status).toBe("active");
  });

  it("Should return 'inactive' if project has not been modified recently", () => {
    // Arrange
    const createDate = new Date();
    const updateDate = new Date();
    createDate.setDate(today.getDate() - statusLimitNew - 1);
    updateDate.setDate(today.getDate() - statusLimitActive - 1);
    const project = {
      created_at: createDate,
      updated_at: updateDate
    };

    // Act
    const status = projectStatus(project);

    // Assert
    expect(status).toBe("inactive");
  });

});
