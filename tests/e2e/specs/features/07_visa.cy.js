describe("Visa CRUD", () => {
  it("Should user0 create a visa including user1 and user2 as validators", () => {
    cy.task("get-user", "user0").then((user) => {
      cy.login(user);
      cy.visit("/spaces");
      cy.hook("space-card")
        .contains(`${user.firstname} ${user.lastname}`)
        .click();
    });
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
    cy.hook("btn-actions-cell").click();
    cy.hook("btn-open-visa-manager").click();
    cy.hook("btn-add-visa-validator").click();

    cy.task("get-user", "user1").then(({ firstname, lastname }) => {
      cy.hook("visa-validator-list")
        .contains(
          "div[data-test-id=visa-validator-users]",
          `${firstname} ${lastname}`
        )
        .within(() => {
          cy.hook("checkbox-add-validator").click();
        });
    });

    cy.task("get-user", "user2").then(({ firstname, lastname }) => {
      cy.hook("visa-validator-list")
        .contains(
          "div[data-test-id=visa-validator-users]",
          `${firstname} ${lastname}`
        )
        .within(() => {
          cy.hook("checkbox-add-validator").click();
        });
    });

    cy.hook("btn-submit-validators").click();
    cy.hook("btn-submit-visa-creation").click();

    cy.hook("visa-summary-validator-list").within(() => {
      cy.task("get-user", "user1").then(({ firstname, lastname }) => {
        cy.contains(`${firstname} ${lastname}`);
      });
      cy.task("get-user", "user2").then(({ firstname, lastname }) => {
        cy.contains(`${firstname} ${lastname}`);
      });
    });
  });

  it("Should user0 delete and add again user2 as validator", () => {
    cy.task("get-user", "user0").then((user) => {
      cy.login(user);
      cy.visit("/spaces");
      cy.hook("space-card")
        .contains(`${user.firstname} ${user.lastname}`)
        .click();
    });
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
    cy.hook("btn-open-visa-list").click();

    cy.hook("visa-list-tabs").within(() => {
      cy.get("li[class=bimdata-tabs__container__tab]").not(".active").click();
    });
    cy.hook("visa-validation-item").first().click();

    cy.task("get-user", "user2").then(({ firstname, lastname }) => {
      cy.hook("visa-summary-validator-list")
        .contains(
          "div[data-test-id=visa-summary-validator-item]",
          `${firstname} ${lastname}`
        )
        .within(() => {
          cy.hook("btn-action-visa-summary-validator").click();
          cy.hook("btn-delete-validator").click();
        });

      cy.hook("visa-summary-validator-list")
        .contains(
          "div[data-test-id=visa-summary-validator-item]",
          `${firstname} ${lastname}`
        )
        .should("not.exist");

      cy.hook("btn-add-validator").click();
      cy.hook("visa-validator-list")
        .contains(
          "div[data-test-id=visa-validator-users]",
          `${firstname} ${lastname}`
        )
        .within(() => {
          cy.hook("checkbox-add-validator").click();
        });
      cy.hook("btn-submit-validators").click();
      cy.hook("visa-summary-validator-list")
        .contains(
          "div[data-test-id=visa-summary-validator-item]",
          `${firstname} ${lastname}`
        )
        .should("have.length", 1);
    });
  });

  it("Should user1 vote in user0 visa", () => {
    cy.task("get-user", "user1").then(
      ({ firstname, lastname, email, password }) => {
        cy.login({ email, password });
        cy.visit("/spaces");
        cy.task("get-user", "user0").then((user) => {
          cy.hook("space-card")
            .contains(`${user.firstname} ${user.lastname}`)
            .click();
        });

        cy.hook("project-card").first().click();
        cy.hook("project-tab-files").click();
        cy.hook("btn-open-visa-list").click();
        cy.hook("visa-validation-item").first().click();
        cy.hook("btn-validate-visa").click();

        cy.hook("visa-summary-validator-list")
          .contains(
            "div[data-test-id=visa-summary-validator-item]",
            `${firstname} ${lastname}`
          )
          .within(() => {
            cy.get(".visa-summary-validator__right-side__A").should(
              "have.length",
              1
            );
          });

        cy.hook("btn-validate-visa").click();

        cy.hook("visa-summary-validator-list")
          .contains(
            "div[data-test-id=visa-summary-validator-item]",
            `${firstname} ${lastname}`
          )
          .within(() => {
            cy.get(".visa-summary-validator__right-side__P").should(
              "have.length",
              1
            );
          });

        cy.hook("btn-deny-visa").click();
        cy.hook("visa-summary-validator-list")
          .contains(
            "div[data-test-id=visa-summary-validator-item]",
            `${firstname} ${lastname}`
          )
          .within(() => {
            cy.get(".visa-summary-validator__right-side__D").should(
              "have.length",
              1
            );
          });

        cy.hook("btn-deny-visa").click();
        cy.hook("visa-summary-validator-list")
          .contains(
            "div[data-test-id=visa-summary-validator-item]",
            `${firstname} ${lastname}`
          )
          .within(() => {
            cy.get(".visa-summary-validator__right-side__P").should(
              "have.length",
              1
            );
          });

        cy.hook("btn-deny-visa").click();
        cy.hook("visa-summary-validator-list")
          .contains(
            "div[data-test-id=visa-summary-validator-item]",
            `${firstname} ${lastname}`
          )
          .within(() => {
            cy.hook("btn-refresh-validation").click();
            cy.get(".visa-summary-validator__right-side__P").should(
              "have.length",
              1
            );
          });

        cy.hook("btn-validate-visa").click();
      }
    );
  });

  it("Should user1 manage comment", () => {
    cy.task("get-user", "user1").then((user) => cy.login(user));
    cy.visit("/spaces");
    cy.task("get-user", "user0").then((user) => {
      cy.hook("space-card")
        .contains(`${user.firstname} ${user.lastname}`)
        .click();
    });

    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
    cy.hook("btn-open-visa-list").click();
    cy.hook("visa-validation-item").first().click();

    cy.hook("visa-open-comments").click();
    cy.get("textarea[name=comment]").type("I validated the visa");
    cy.hook("btn-submit-visa-comment").click();

    cy.task("get-user", "user1").then(({ firstname, lastname }) => {
      cy.hook("visa-comments-thread-list")
        .contains(
          "div[data-test-id=visa-comment-item]",
          `${firstname} ${lastname}`
        )
        .within(() => {
          cy.hook("btn-visa-comment-action").click();
          cy.hook("btn-edit-visa-comment").click();

          cy.hook("btn-undo-edit-visa-comment").click();
          cy.get("textarea[name=description]").should(
            "have.value",
            "I validated the visa"
          );

          cy.hook("btn-visa-comment-action").click();
          cy.hook("btn-edit-visa-comment").click();

          cy.get("textarea[name=description]")
            .clear()
            .type("I disapproved the visa");

          cy.hook("btn-edit-visa-comment").click();
          cy.get("textarea[name=description]").should(
            "have.value",
            "I disapproved the visa"
          );

          cy.hook("btn-visa-comment-action").click();
          cy.hook("btn-delete-visa-comment").click();
          cy.hook("btn-confirm-delete-visa-comment").click();
        });

      cy.hook("visa-comment-item").should("have.length", 0);
    });
  });

  it("Should user0 refresh user1 vote", () => {
    cy.task("get-user", "user0").then((user) => {
      cy.login(user);
      cy.visit("/spaces");
      cy.hook("space-card")
        .contains(`${user.firstname} ${user.lastname}`)
        .click();
    });
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
    cy.hook("btn-open-visa-list").click();

    cy.hook("visa-list-tabs").within(() => {
      cy.get("li[class=bimdata-tabs__container__tab]").not(".active").click();
    });
    cy.hook("visa-validation-item").first().click();

    cy.task("get-user", "user1").then(({ firstname, lastname }) => {
      cy.hook("visa-summary-validator-list")
        .contains(
          "div[data-test-id=visa-summary-validator-item]",
          `${firstname} ${lastname}`
        )
        .within(() => {
          cy.hook("btn-action-visa-summary-validator").click();
          cy.hook("btn-refresh-validator").click();
          cy.get(".visa-summary-validator__right-side__P").should(
            "have.length",
            1
          );
        });
    });
  });

  it("Should user0 close and delete visa", () => {
    cy.task("get-user", "user0").then((user) => {
      cy.login(user);
      cy.visit("/spaces");
      cy.hook("space-card")
        .contains(`${user.firstname} ${user.lastname}`)
        .click();
    });
    cy.hook("project-card").first().click();
    cy.hook("project-tab-files").click();
    cy.hook("btn-open-visa-list").click();

    cy.hook("visa-list-tabs").within(() => {
      cy.get("li[class=bimdata-tabs__container__tab]").not(".active").click();
    });
    cy.hook("visa-validation-item").first().click();

    cy.hook("btn-close-visa").click();
    cy.hook("btn-confirm-visa-safe-zone").click();

    cy.hook("btn-close-visa-panel").click();

    cy.hook("btn-open-visa-list").click();
    cy.hook("visa-validation-item").first().click();

    cy.hook("btn-close-visa").should("be.disabled");

    cy.hook("btn-delete-visa").click();
    cy.hook("btn-confirm-visa-safe-zone").click();

    cy.hook("visa-validation-item").should("have.length", 0);
  });
});
