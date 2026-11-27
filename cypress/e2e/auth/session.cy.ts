import { DashboardPage } from "../../pages/DashboardPage";
import { LoginPage } from "../../pages/LoginPage";
import { USERS } from "../../support/data/users";

describe("Authentication · Session and protected pages", () => {
  it("TC-AUTH-06 sends a visitor without a session to the login page", () => {
    cy.visit(DashboardPage.path);

    cy.location("pathname").should("eq", LoginPage.path);
    LoginPage.username().should("be.visible");
  });

  it("TC-AUTH-07 logs out and closes access to protected pages", () => {
    // A fresh login, so the cached cy.session of other tests stays valid
    const { username, password } = USERS.admin;
    LoginPage.open().loginWith(username, password);
    DashboardPage.header().should("contain", "Dashboard");

    DashboardPage.logout();

    cy.location("pathname").should("eq", LoginPage.path);
    cy.visit(DashboardPage.path);
    cy.location("pathname").should("eq", LoginPage.path);
  });

  it("TC-AUTH-08 reuses the cached admin session to open protected pages directly", () => {
    cy.loginAs("admin");

    DashboardPage.open();

    cy.location("pathname").should("eq", DashboardPage.path);
    DashboardPage.header().should("contain", "Dashboard");
  });

  it("TC-AUTH-09 opens the reset password page from the login page", () => {
    LoginPage.open();

    LoginPage.forgotPasswordLink().click();

    cy.location("pathname").should("include", "/auth/requestPasswordResetCode");
    cy.contains("h6", "Reset Password").should("be.visible");
  });
});
