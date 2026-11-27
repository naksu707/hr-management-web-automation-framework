import type { Employee } from "../support/data/employees";

export const AddEmployeePage = {
  path: "/web/index.php/pim/addEmployee",

  open() {
    cy.visit(this.path);
    this.firstName().should("be.visible");
    return this;
  },

  firstName: () => cy.get('input[name="firstName"]'),
  middleName: () => cy.get('input[name="middleName"]'),
  lastName: () => cy.get('input[name="lastName"]'),
  employeeId: () => cy.contains(".oxd-input-group", "Employee Id").find("input"),
  employeeIdError: () =>
    cy.contains(".oxd-input-group", "Employee Id").find(".oxd-input-field-error-message"),
  fieldErrors: () => cy.get(".oxd-input-field-error-message"),
  saveButton: () => cy.get('button[type="submit"]'),

  /** Types the names. The employee ID keeps the value OrangeHRM suggests. */
  fillName(employee: Employee) {
    this.firstName().type(employee.firstName);
    if (employee.middleName) {
      this.middleName().type(employee.middleName);
    }
    this.lastName().type(employee.lastName);
    return this;
  },

  fillEmployeeId(employeeId: string) {
    this.employeeId().clear().type(employeeId);
    return this;
  },

  /** Names and the employee's own unique ID. */
  fill(employee: Employee) {
    return this.fillName(employee).fillEmployeeId(employee.employeeId);
  },

  save() {
    this.saveButton().click();
    return this;
  },
};
