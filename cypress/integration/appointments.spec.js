describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
  });

  it("should book an interview", () => {
    cy.get("[alt=Add]").first().click();
    cy.get("input").type("Lydia Miller-Jones");

    cy.get("[data-testid=set-interviewer-test]").first().click();
    cy.contains("button", "Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
    //sees booked appointment
  });

  it("should edit an interview", () => {
    cy.get(".appointment__card--show").get("[alt=Edit]").click({ force: true });
    cy.get("[data-testid=student-name-input]").clear().type("Bob sponge");
    cy.get('[alt="Tori Malcolm"]').click();
    cy.contains("button", "Save").click();

    cy.contains(".appointment__card--show", "Bob sponge");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    cy.get(".appointment__card--show")
      .get("[alt=Delete]")
      .click({ force: true });
    cy.contains("button", "Confirm").click();
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
