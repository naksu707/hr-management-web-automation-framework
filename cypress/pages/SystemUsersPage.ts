import { USERS_API } from "../support/api/users";
import { field, Table } from "./components";

export const SystemUsersPage = {
  path: "/web/index.php/admin/viewSystemUsers",

  /** Opens the list and waits for the first load of users. */
  open() {
    cy.intercept({ method: "GET", pathname: USERS_API }).as("userList");
    cy.visit(this.path);
    cy.wait("@userList");
    return this;
  },

  usernameInput: () => field("Username").find("input"),
  searchButton: () => cy.get('button[type="submit"]'),
  rows: () => Table.rows(),

  searchByUsername(username: string) {
    this.usernameInput().clear().type(username);
    cy.intercept({ method: "GET", pathname: USERS_API }).as("userSearch");
    this.searchButton().click();
    cy.wait("@userSearch");
    return this;
  },

  deleteFirstRow() {
    cy.intercept({ method: "DELETE", pathname: USERS_API }).as("deleteUser");
    Table.deleteFirstRow();
    cy.wait("@deleteUser");
    return this;
  },
};
