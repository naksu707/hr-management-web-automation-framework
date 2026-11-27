import invalidLogins from "../../fixtures/invalid-logins.json";
import { DashboardPage } from "../../pages/DashboardPage";
import { LoginPage } from "../../pages/LoginPage";
import { USERS } from "../../support/data/users";

describe("Authentication · Login", () => {
  beforeEach(() => {
    LoginPage.open();
  });

  it("TC-AUTH-01 logs in with valid admin credentials and opens the dashboard", () => {
    const { username, password } = USERS.admin;

    LoginPage.loginWith(username, password);

    cy.location("pathname").should("eq", DashboardPage.path);
    DashboardPage.header().should("contain", "Dashboard");
  });

  invalidLogins.forEach(({ case: description, username, password }) => {
    it(`TC-AUTH-02 rejects ${description}`, () => {
      LoginPage.loginWith(username, password);

      LoginPage.errorAlert().should("have.text", "Invalid credentials");
      cy.location("pathname").should("eq", LoginPage.path);
    });
  });

  it("TC-AUTH-03 asks for the username and the password when both are empty", () => {
    LoginPage.submitButton().click();

    LoginPage.fieldErrors()
      .should("have.length", 2)
      .each(($error) => {
        expect($error.text()).to.eq("Required");
      });
    cy.location("pathname").should("eq", LoginPage.path);
  });

  it("TC-AUTH-04 asks for the password when only the username is filled in", () => {
    LoginPage.username().type("Admin");
    LoginPage.submitButton().click();

    LoginPage.fieldErrors().should("have.length", 1).and("have.text", "Required");
  });

  it("TC-AUTH-05 hides the password while it is typed", () => {
    LoginPage.password().should("have.attr", "type", "password");
  });
});
