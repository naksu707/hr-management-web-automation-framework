export const PersonalDetailsPage = {
  pathPattern: /\/pim\/viewPersonalDetails\/empNumber\/(\d+)/,

  employeeName: () => cy.get(".orangehrm-edit-employee-name h6"),
  firstName: () => cy.get('input[name="firstName"]'),
  lastName: () => cy.get('input[name="lastName"]'),

  /**
   * Waits until the page has loaded the employee's data. Leaving the page earlier
   * cancels its requests, and the app then throws an unhandled error.
   */
  waitUntilLoaded(firstName: string) {
    this.employeeName().should("contain", firstName);
    this.firstName().should("have.value", firstName);
    return this;
  },
};
