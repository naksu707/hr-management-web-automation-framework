import { findUsers, trackUser, USERS_API } from "../../support/api/users";
import { aSystemUser, TEST_PASSWORD, uniqueUsername } from "../../support/data/users";
import { AddSystemUserPage } from "../../pages/AddSystemUserPage";
import { SystemUsersPage } from "../../pages/SystemUsersPage";
import { Toast } from "../../pages/components";

describe("Admin · System users", () => {
  beforeEach(() => {
    cy.loginAs("admin");
  });

  it("TC-ADM-01 creates an ESS user for an employee and the API confirms it", () => {
    const username = uniqueUsername();
    cy.intercept({ method: "POST", pathname: USERS_API }).as("createUser");

    cy.createEmployee().then((employee) => {
      AddSystemUserPage.open()
        .fill({
          role: "ESS",
          employeeName: employee.firstName,
          enabled: true,
          username,
          password: TEST_PASSWORD,
        })
        .save();

      cy.wait("@createUser").then(({ response }) => {
        expect(response?.statusCode).to.eq(200);
        trackUser(response?.body.data.id);
      });
      Toast.message().should("contain", "Successfully Saved");
      cy.location("pathname").should("eq", SystemUsersPage.path);

      SystemUsersPage.searchByUsername(username);
      SystemUsersPage.rows()
        .should("have.length", 1)
        .first()
        .should("contain", username)
        .and("contain", "ESS")
        .and("contain", employee.firstName)
        .and("contain", "Enabled");

      findUsers(username).then((users) => {
        expect(users, "users with this username").to.have.length(1);
        expect(users[0].userRole.name).to.eq("ESS");
        expect(users[0].status).to.eq(true);
        expect(users[0].employee.empNumber).to.eq(employee.empNumber);
      });
    });
  });

  it("TC-ADM-02 rejects a username that is already taken", () => {
    cy.createEmployee().then((employee) => {
      cy.createUser(aSystemUser(employee.empNumber)).then((existing) => {
        AddSystemUserPage.open().username().type(existing.username);

        AddSystemUserPage.usernameError().should("have.text", "Already exists");
      });
    });
  });

  it("TC-ADM-03 asks for a username of at least 5 characters", () => {
    AddSystemUserPage.open().username().type("abcd");
    AddSystemUserPage.save();

    AddSystemUserPage.usernameError().should("have.text", "Should be at least 5 characters");
  });

  it("TC-ADM-04 rejects a confirmation that does not match the password", () => {
    AddSystemUserPage.open();
    AddSystemUserPage.password().type(TEST_PASSWORD, { log: false });
    AddSystemUserPage.confirmPassword().type(`${TEST_PASSWORD}x`, { log: false });
    AddSystemUserPage.save();

    AddSystemUserPage.confirmPasswordError().should("have.text", "Passwords do not match");
  });

  it("TC-ADM-05 asks for every required field", () => {
    cy.intercept({ method: "POST", pathname: USERS_API }).as("createUser");

    AddSystemUserPage.open().save();

    // User Role, Employee Name, Status, Username and Password
    AddSystemUserPage.fieldErrors().should("have.length.at.least", 5);
    cy.location("pathname").should("eq", AddSystemUserPage.path);
    cy.get("@createUser.all").should("have.length", 0);
  });

  it("TC-ADM-06 deletes a system user from the list", () => {
    cy.createEmployee().then((employee) => {
      cy.createUser(aSystemUser(employee.empNumber)).then((user) => {
        SystemUsersPage.open().searchByUsername(user.username);
        SystemUsersPage.rows().should("have.length", 1);

        SystemUsersPage.deleteFirstRow();

        Toast.message().should("contain", "Successfully Deleted");
        findUsers(user.username).should("have.length", 0);
      });
    });
  });
});
