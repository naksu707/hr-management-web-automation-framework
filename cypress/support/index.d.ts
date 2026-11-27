/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /** Logs in with the role's credentials, cached with cy.session. */
    loginAs(role: import("./data/users").Role): Chainable<void>;

    /** Logs in as a user created by the test, with its own cy.session. */
    loginWith(username: string, password: string): Chainable<void>;

    /** Creates an employee through the API. It is deleted after the test. */
    createEmployee(
      employee?: import("./data/employees").Employee,
    ): Chainable<import("./data/employees").CreatedEmployee>;

    /** Deletes an employee through the API. */
    deleteEmployee(empNumber: number): Chainable<void>;

    /** Creates a system user through the API. It is deleted after the test. */
    createUser(
      user: import("./data/users").SystemUser,
    ): Chainable<import("./data/users").CreatedSystemUser>;
  }
}
