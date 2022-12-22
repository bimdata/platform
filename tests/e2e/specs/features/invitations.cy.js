describe("Invitation feature", () => {

  it("Should invit user1 and user 2 in user0 project successfully", () => {
    cy.invitInProject("user0", "user1");
    cy.fillInvitForm("user2")
  })

  it("Should user1 and user2 accept user0 invitation project successfully", () => {
    cy.acceptInvit("user0", "user1")
    cy.acceptInvit("user0", "user2")
  })

  it("Should user3 reject user0 invitation project successfully", () => {
    cy.invitInProject("user0", "user3");

    cy.task("get-user", "user3").then(user => cy.login(user))
    cy.visit("/invitations");

    cy.task("get-user", "user0").then(({ firstname, lastname }) => {
      cy.hook("card-invitation", { timeout: 60000 }).first().within(() => {
        cy.contains(firstname).should("have.length", 1);
        cy.contains(lastname).should("have.length", 1);

        cy.hook("btn-deny-invit").click();

        cy.contains("Invitation declined")
        cy.hook("btn-go-to-project").should("not.exist")
      });
    })
  })

  it("Should invit user0 in user1 and user2 project and accept both invit successfully", () => {
    cy.invitInProject("user1", "user0");
    cy.invitInProject("user2", "user0");

    cy.task("get-user", "user0").then(user => cy.login(user))
    cy.visit("/invitations");

    cy.hook("btn-accept-all-invit").click()

    cy.hook("card-invitation").first().within(() => cy.hook("btn-go-to-project"));
    cy.hook("card-invitation").last().within(() => cy.hook("btn-go-to-project"));
  })
});