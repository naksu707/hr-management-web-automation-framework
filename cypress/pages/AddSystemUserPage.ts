import type { UserRole } from "../support/data/users";
import { field, fieldError, pickFromAutocomplete, selectOption } from "./components";

export interface SystemUserForm {
  role: UserRole;
  employeeName: string;
  enabled: boolean;
  username: string;
  password: string;
  confirmPassword?: string;
}

export const AddSystemUserPage = {
  path: "/web/index.php/admin/saveSystemUser",

  open() {
    cy.visit(this.path);
    this.username().should("be.visible");
    return this;
  },

  username: () => field("Username").find("input"),
  password: () => cy.get('input[type="password"]').eq(0),
  confirmPassword: () => cy.get('input[type="password"]').eq(1),
  usernameError: () => fieldError("Username"),
  passwordError: () =>
    cy
      .get('input[type="password"]')
      .eq(0)
      .parents(".oxd-input-group")
      .first()
      .find(".oxd-input-field-error-message"),
  confirmPasswordError: () => fieldError("Confirm Password"),
  fieldErrors: () => cy.get(".oxd-input-field-error-message"),
  saveButton: () => cy.get('button[type="submit"]'),

  fill(form: SystemUserForm) {
    selectOption("User Role", form.role);
    pickFromAutocomplete("Employee Name", form.employeeName);
    selectOption("Status", form.enabled ? "Enabled" : "Disabled");
    this.username().type(form.username);
    this.password().type(form.password, { log: false });
    this.confirmPassword().type(form.confirmPassword ?? form.password, { log: false });
    return this;
  },

  save() {
    this.saveButton().click();
    return this;
  },
};
