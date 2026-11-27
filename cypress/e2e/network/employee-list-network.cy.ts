import { EMPLOYEES_API } from "../../support/api/employees";
import { Table, Toast } from "../../pages/components";

const EMPLOYEE_LIST = "/web/index.php/pim/viewEmployeeList";
const employeeList = { method: "GET", pathname: EMPLOYEES_API };

describe("Network · Employee list with simulated API responses", () => {
  beforeEach(() => {
    cy.loginAs("admin");
  });

  it("TC-NET-01 shows the employees the API returns (fixture)", () => {
    cy.intercept(employeeList, { fixture: "employee-list.json" }).as("employees");

    cy.visit(EMPLOYEE_LIST);
    cy.wait("@employees");

    Table.recordsFound().should("contain", "(1) Record Found");
    Table.rows()
      .should("have.length", 1)
      .first()
      .should("contain", "STUB-001")
      .and("contain", "Stubbed")
      .and("contain", "Employee")
      .and("contain", "QA Engineer");
  });

  it("TC-NET-02 shows 'No Records Found' when the API returns an empty list", () => {
    cy.intercept(employeeList, { body: { data: [], meta: { total: 0 }, rels: [] } }).as(
      "employees",
    );

    cy.visit(EMPLOYEE_LIST);
    cy.wait("@employees");

    cy.contains("span.oxd-text", "No Records Found").should("be.visible");
    Table.rows().should("not.exist");
  });

  it("TC-NET-03 shows a loader while the API is slow, then the results", () => {
    cy.intercept(employeeList, (request) => {
      request.on("response", (response) => {
        response.setDelay(3000);
      });
    }).as("employees");

    cy.visit(EMPLOYEE_LIST);

    cy.get(".oxd-loading-spinner").should("be.visible");
    cy.wait("@employees");
    cy.get(".oxd-loading-spinner").should("not.exist");
    Table.rows().should("have.length.at.least", 1);
  });

  it("TC-NET-04 tells the user when the API fails with a server error", () => {
    cy.intercept(employeeList, {
      statusCode: 500,
      body: { error: { message: "Server error" } },
    }).as("employees");

    cy.visit(EMPLOYEE_LIST);
    cy.wait("@employees").its("response.statusCode").should("eq", 500);

    Toast.message().should("contain", "Error");
    Table.rows().should("not.exist");
  });
});
