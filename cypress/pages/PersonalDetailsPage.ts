import { field } from "./components";

export const PersonalDetailsPage = {
  pathPattern: /\/pim\/viewPersonalDetails\/empNumber\/(\d+)/,
  saveRequest: "**/api/v2/pim/employees/*/personal-details",

  open(empNumber: number, firstName: string) {
    cy.visit(`/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`);
    return this.waitUntilLoaded(firstName);
  },

  employeeName: () => cy.get(".orangehrm-edit-employee-name h6"),
  firstName: () => cy.get('input[name="firstName"]'),
  lastName: () => cy.get('input[name="lastName"]'),
  driversLicense: () => field("Driver's License Number").find("input"),
  firstNameError: () =>
    cy
      .get('input[name="firstName"]')
      .parents(".oxd-input-group")
      .first()
      .find(".oxd-input-field-error-message"),
  /** The first form of the page is "Personal Details"; the second one is "Custom Fields". */
  saveButton: () => cy.get('button[type="submit"]').first(),

  /**
   * Waits until the page has loaded the employee's data. Leaving the page earlier
   * cancels its requests, and the app then throws an unhandled error.
   */
  waitUntilLoaded(firstName: string) {
    this.employeeName().should("contain", firstName);
    this.firstName().should("have.value", firstName);
    return this;
  },

  changeName(firstName: string, lastName: string) {
    this.firstName().clear().type(firstName);
    this.lastName().clear().type(lastName);
    return this;
  },

  changeDriversLicense(number: string) {
    this.driversLicense().clear().type(number);
    return this;
  },

  save() {
    cy.intercept("PUT", this.saveRequest).as("savePersonalDetails");
    this.saveButton().click();
    cy.wait("@savePersonalDetails").its("response.statusCode").should("eq", 200);
    return this;
  },
};
