describe("Documents import feature", () => {
  beforeEach(() => {
    cy.fixture("house-plan.pdf").as("housePlan");

    cy.task("get-user", "user0").then((user) => cy.login(user));
    cy.visit("/spaces");
    cy.hook("space-card").first().click();
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
  });

  it("Should upload a file successfully", () => {
    cy.hook("btn-upload-file").click();
    cy.get("body > input[type=file]").selectFile("@housePlan", { force: true });

    cy.intercept("**/dms-tree").as("getDmsTree");
    cy.wait("@getDmsTree");

    cy.hook("files-table")
      .contains("tbody tr", "house-plan.pdf")
      .should("have.length", 1);

    cy.deleteGedDoc("house-plan.pdf");
  });

  it("Should drag and drop a file successfully", () => {
    cy.hook("files-table").selectFile(
      { contents: "@housePlan", fileName: "house-plan.pdf" },
      { action: "drag-drop" }
    );

    cy.intercept("**/dms-tree").as("getDmsTree");
    cy.wait("@getDmsTree");

    cy.hook("files-table")
      .contains("tbody tr", "house-plan.pdf")
      .should("have.length", 1);

    cy.deleteGedDoc("house-plan.pdf");
  });

  it("Should drag and drop multiple file successfully", () => {
    cy.fixture("terminaux-plafond.dwg").as("terminauxPlafond");

    cy.hook("files-table").selectFile(
      [
        { contents: "@housePlan", fileName: "house-plan.pdf" },
        "@terminauxPlafond"
      ],
      { action: "drag-drop" }
    );

    cy.intercept("**/dms-tree").as("getDmsTree");
    cy.wait("@getDmsTree");

    cy.hook("files-table")
      .contains("tbody tr", "house-plan.pdf")
      .should("have.length", 1);
    cy.hook("files-table")
      .contains("tbody tr", "terminaux-plafond.dwg")
      .should("have.length", 1);

    cy.deleteGedDoc("house-plan.pdf");
    cy.deleteGedDoc("terminaux-plafond.dwg");
  });

  it("Should retry upload if it fails with one of the 'upload retry status code'", () => {
    // Arrange
    // - Simulate an error from the API
    cy.intercept(
      { method: "POST", url: "**/document", times: 1 },
      { statusCode: 502 }
    );
    // - Simulate an error from the network connection
    cy.intercept(
      { method: "POST", url: "**/document", times: 1 },
      { forceNetworkError: true }
    );

    // Act
    cy.hook("btn-upload-file").click();
    cy.get("body > input[type=file]").selectFile(
      { contents: "@housePlan", fileName: "house-plan.pdf" },
      { force: true }
    );
    cy.intercept("**/dms-tree").as("getDmsTree");
    cy.wait("@getDmsTree");

    // Assert
    cy.hook("files-table")
      .contains("tbody tr", "house-plan.pdf")
      .should("have.length", 1);

    // Clean
    cy.deleteGedDoc("house-plan.pdf");
  });

  it("Should retry upload at most 3 times", () => {
    // Arrange
    let reqCount = 0;
    cy.intercept(
      { method: "POST", url: "**/document" },
      req => {
        reqCount += 1;
        req.continue(res => res.send({ statusCode: 502 }));
      }
    ).as("uploadRequest");

    // Act
    cy.hook("btn-upload-file").click();
    cy.get("body > input[type=file]").selectFile(
      { contents: "@housePlan", fileName: "house-plan.pdf" },
      { force: true }
    );

    // Assert
    cy.wait(5000).then(() => {
      expect(reqCount).to.equal(4);
    });
  });

  it("Should not retry upload if it fails with 4XX status code", () => {
    // Arrange
    let reqCount = 0;
    cy.intercept(
      { method: "POST", url: "**/document" },
      req => {
        reqCount += 1;
        req.continue(res => res.send({ statusCode: 400 }));
      }
    ).as("uploadRequest");

    // Act
    cy.hook("btn-upload-file").click();
    cy.get("body > input[type=file]").selectFile(
      { contents: "@housePlan", fileName: "house-plan.pdf" },
      { force: true }
    );

    // Assert
    cy.wait(5000).then(() => {
      expect(reqCount).to.equal(1);
    });
  });
});
