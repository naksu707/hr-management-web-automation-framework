export const LoginPage = {
  path: "/web/index.php/auth/login",

  open() {
    cy.visit(this.path);
    this.username().should("be.visible");
    return this;
  },

  username: () => cy.get('input[name="username"]'),
  password: () => cy.get('input[name="password"]'),
  submitButton: () => cy.get('button[type="submit"]'),
  errorAlert: () => cy.get(".oxd-alert-content-text"),
  fieldErrors: () => cy.get(".oxd-input-field-error-message"),
  forgotPasswordLink: () => cy.contains("p", "Forgot your password?"),

  loginWith(username: string, password: string) {
    if (username) {
      this.username().type(username);
    }
    if (password) {
      this.password().type(password, { log: false });
    }
    this.submitButton().click();
    return this;
  },
};
