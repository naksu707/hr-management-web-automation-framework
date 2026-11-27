import { createEmployee, deleteEmployees, EMPLOYEES_API } from "./api/employees";
import { anEmployee } from "./data/employees";
import { USERS, type Role } from "./data/users";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";

Cypress.Commands.add("loginAs", (role: Role) => {
  const { username, password } = USERS[role];

  cy.session(
    ["user", role],
    () => {
      LoginPage.open().loginWith(username, password);
      DashboardPage.header().should("contain", "Dashboard");
    },
    {
      cacheAcrossSpecs: true,
      // The demo resets: if the cached session no longer works, log in again
      validate() {
        cy.request({ url: EMPLOYEES_API, qs: { limit: 1 }, followRedirect: false })
          .its("status")
          .should("eq", 200);
      },
    },
  );
});

Cypress.Commands.add("createEmployee", (employee = anEmployee()) => {
  return createEmployee(employee);
});

Cypress.Commands.add("deleteEmployee", (empNumber: number) => {
  deleteEmployees([empNumber]);
});
