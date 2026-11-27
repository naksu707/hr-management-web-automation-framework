import { findEmployees } from "../../support/api/employees";
import { uniqueEmployeeId } from "../../support/data/employees";
import { EmployeeListPage } from "../../pages/EmployeeListPage";
import { Toast } from "../../pages/components";

describe("PIM · Employee list", () => {
  beforeEach(() => {
    cy.loginAs("admin");
  });

  it("TC-PIM-05 finds an employee created through the API by their ID", () => {
    cy.createEmployee().then((employee) => {
      EmployeeListPage.open().searchById(employee.employeeId);

      EmployeeListPage.recordsFound().should("contain", "(1) Record Found");
      EmployeeListPage.rows()
        .should("have.length", 1)
        .first()
        .should("contain", employee.employeeId)
        .and("contain", employee.firstName)
        .and("contain", employee.lastName);
    });
  });

  it("TC-PIM-06 finds an employee by name with the autocomplete", () => {
    cy.createEmployee().then((employee) => {
      EmployeeListPage.open().searchByName(employee.firstName);

      EmployeeListPage.rows()
        .should("have.length", 1)
        .first()
        .should("contain", employee.firstName)
        .and("contain", employee.lastName);
    });
  });

  it("TC-PIM-07 shows 'No Records Found' for an ID nobody has", () => {
    EmployeeListPage.open().searchById(uniqueEmployeeId());

    Toast.message().should("contain", "No Records Found");
    EmployeeListPage.rows().should("not.exist");
  });

  it("TC-PIM-08 deletes an employee from the list", () => {
    cy.createEmployee().then((employee) => {
      EmployeeListPage.open().searchById(employee.employeeId);
      EmployeeListPage.rows().should("have.length", 1);

      EmployeeListPage.deleteFirstRow();

      Toast.message().should("contain", "Successfully Deleted");
      findEmployees(employee.employeeId).should("have.length", 0);
    });
  });
});
