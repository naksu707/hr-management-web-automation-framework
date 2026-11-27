import { aSystemUser } from "../../support/data/users";
import { DashboardPage } from "../../pages/DashboardPage";
import { LoginPage } from "../../pages/LoginPage";
import { SideMenu } from "../../pages/components";

describe("Admin · Access by role", () => {
  beforeEach(() => {
    cy.loginAs("admin");
  });

  it("TC-ADM-07 an admin sees the Admin and PIM menus", () => {
    DashboardPage.open();

    SideMenu.item("Admin").should("be.visible");
    SideMenu.item("PIM").should("be.visible");
  });

  it("TC-ADM-08 an ESS user logs in and sees only their own menus", () => {
    cy.createEmployee().then((employee) => {
      cy.createUser(aSystemUser(employee.empNumber, { role: "ESS" })).then((user) => {
        cy.loginWith(user.username, user.password);

        DashboardPage.open();
        DashboardPage.header().should("contain", "Dashboard");
        SideMenu.item("My Info").should("be.visible");
        SideMenu.items().should("not.contain", "Admin").and("not.contain", "PIM");
      });
    });
  });

  it("TC-ADM-09 an ESS user cannot open the admin pages", () => {
    cy.createEmployee().then((employee) => {
      cy.createUser(aSystemUser(employee.empNumber, { role: "ESS" })).then((user) => {
        cy.loginWith(user.username, user.password);

        cy.visit("/web/index.php/admin/viewSystemUsers", { failOnStatusCode: false });

        // OrangeHRM does not show the page to an ESS user: the list of system users never loads
        cy.contains("h5", "System Users").should("not.exist");
        cy.get(".oxd-table").should("not.exist");
      });
    });
  });

  it("TC-ADM-10 a disabled user cannot log in", () => {
    cy.createEmployee().then((employee) => {
      cy.createUser(aSystemUser(employee.empNumber, { enabled: false })).then((user) => {
        cy.clearCookies();

        LoginPage.open().loginWith(user.username, user.password);

        LoginPage.errorAlert().should("have.text", "Account disabled");
        cy.location("pathname").should("eq", LoginPage.path);
      });
    });
  });
});
