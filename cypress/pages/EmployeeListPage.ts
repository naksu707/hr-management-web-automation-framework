import { EMPLOYEES_API } from "../support/api/employees";

export const EmployeeListPage = {
  path: "/web/index.php/pim/viewEmployeeList",

  /** Opens the list and waits for the first load of employees. */
  open() {
    cy.intercept({ method: "GET", pathname: EMPLOYEES_API }).as("employeeList");
    cy.visit(this.path);
    cy.wait("@employeeList");
    return this;
  },

  employeeNameInput: () => cy.contains(".oxd-input-group", "Employee Name").find("input"),
  employeeIdInput: () => cy.contains(".oxd-input-group", "Employee Id").find("input"),
  searchButton: () => cy.get('button[type="submit"]'),
  rows: () => cy.get(".oxd-table-body .oxd-table-card"),
  recordsFound: () => cy.contains("span.oxd-text", /Record(s)? Found/),

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
    this.employeeNameInput().clear().type(name);
    cy.contains(".oxd-autocomplete-option", name).click();
    return this.search();
  },

  deleteFirstRow() {
    cy.intercept({ method: "DELETE", pathname: EMPLOYEES_API }).as("deleteEmployee");
    this.rows().first().find(".bi-trash").closest("button").click();
    cy.contains(".oxd-dialog-sheet button", "Yes, Delete").click();
    cy.wait("@deleteEmployee");
    return this;
  },
};
