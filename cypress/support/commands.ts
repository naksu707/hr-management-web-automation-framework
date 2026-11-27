import { createEmployee, deleteEmployees, EMPLOYEES_API } from "./api/employees";
import { createUser } from "./api/users";
import { anEmployee } from "./data/employees";
import { USERS, type Role } from "./data/users";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";

function loginThroughTheUi(username: string, password: string): void {
  LoginPage.open().loginWith(username, password);
  DashboardPage.header().should("contain", "Dashboard");
}

Cypress.Commands.add("loginAs", (role: Role) => {
  const { username, password } = USERS[role];

  cy.session(["role", role], () => loginThroughTheUi(username, password), {
    cacheAcrossSpecs: true,
    // The demo resets: if the cached session no longer works, log in again
    validate() {
      cy.request({ url: EMPLOYEES_API, qs: { limit: 1 }, followRedirect: false })
        .its("status")
        .should("eq", 200);
    },
  });
});

Cypress.Commands.add("loginWith", (username: string, password: string) => {
  // Users created by a test live only for that test, so their session is not shared
  cy.session(["user", username], () => loginThroughTheUi(username, password));
});

Cypress.Commands.add("createEmployee", (employee = anEmployee()) => {
  return createEmployee(employee);
});

Cypress.Commands.add("deleteEmployee", (empNumber: number) => {
  deleteEmployees([empNumber]);
});

Cypress.Commands.add("createUser", (user) => {
  return createUser(user);
});
