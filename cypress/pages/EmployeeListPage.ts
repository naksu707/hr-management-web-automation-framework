import { EMPLOYEES_API } from "../support/api/employees";
import { field, pickFromAutocomplete, Table } from "./components";

export const EmployeeListPage = {
  path: "/web/index.php/pim/viewEmployeeList",

  /** Opens the list and waits for the first load of employees. */
  open() {
    cy.intercept({ method: "GET", pathname: EMPLOYEES_API }).as("employeeList");
    cy.visit(this.path);
    cy.wait("@employeeList");
    return this;
  },

  employeeIdInput: () => field("Employee Id").find("input"),
  searchButton: () => cy.get('button[type="submit"]'),
  rows: () => Table.rows(),
  recordsFound: () => Table.recordsFound(),

  search() {
    cy.intercept({ method: "GET", pathname: EMPLOYEES_API }).as("employeeSearch");
    this.searchButton().click();
    cy.wait("@employeeSearch");
    return this;
  },

  searchById(employeeId: string) {
    this.employeeIdInput().clear().type(employeeId);
    return this.search();
  },

  /** Types the name and picks the matching suggestion of the autocomplete. */
  searchByName(name: string) {
    pickFromAutocomplete("Employee Name", name);
    return this.search();
  },

  deleteFirstRow() {
    cy.intercept({ method: "DELETE", pathname: EMPLOYEES_API }).as("deleteEmployee");
    Table.deleteFirstRow();
    cy.wait("@deleteEmployee");
    return this;
  },
};
