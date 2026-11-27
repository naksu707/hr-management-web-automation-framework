import { EMPLOYEES_API, findEmployees, trackEmployee } from "../../support/api/employees";
import { anEmployee } from "../../support/data/employees";
import { AddEmployeePage } from "../../pages/AddEmployeePage";
import { EmployeeListPage } from "../../pages/EmployeeListPage";
import { PersonalDetailsPage } from "../../pages/PersonalDetailsPage";
import { Toast } from "../../pages/components";

describe("PIM · Add employee", () => {
  beforeEach(() => {
    cy.loginAs("admin");
  });

  it("TC-PIM-01 adds an employee and the API confirms it", () => {
    const employee = anEmployee();
    cy.intercept({ method: "POST", pathname: EMPLOYEES_API }).as("createEmployee");

    AddEmployeePage.open().fill(employee).save();

    cy.wait("@createEmployee").then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      trackEmployee(response?.body.data.empNumber);
    });
    Toast.message().should("contain", "Successfully Saved");
    cy.location("pathname").should("match", PersonalDetailsPage.pathPattern);
    PersonalDetailsPage.employeeName().should(
      "contain",
      `${employee.firstName} ${employee.lastName}`,
    );

    findEmployees(employee.employeeId).then((found) => {
      expect(found, "employees with this ID").to.have.length(1);
      expect(found[0].firstName).to.eq(employee.firstName);
      expect(found[0].lastName).to.eq(employee.lastName);
    });
  });

  it("TC-PIM-02 adds an employee with a middle name and finds them in the list", () => {
    const employee = anEmployee({ middleName: "Test" });
    cy.intercept({ method: "POST", pathname: EMPLOYEES_API }).as("createEmployee");

    AddEmployeePage.open().fill(employee).save();

    cy.wait("@createEmployee").then(({ response }) => {
      trackEmployee(response?.body.data.empNumber);
    });
    cy.location("pathname").should("match", PersonalDetailsPage.pathPattern);
    PersonalDetailsPage.waitUntilLoaded(employee.firstName);

    EmployeeListPage.open().searchById(employee.employeeId);
    EmployeeListPage.rows()
      .should("have.length", 1)
      .first()
      .should("contain", employee.employeeId)
      .and("contain", `${employee.firstName} ${employee.middleName}`)
      .and("contain", employee.lastName);
  });

  it("TC-PIM-03 asks for the first and last name", () => {
    cy.intercept({ method: "POST", pathname: EMPLOYEES_API }).as("createEmployee");

    AddEmployeePage.open().save();

    AddEmployeePage.fieldErrors()
      .should("have.length", 2)
      .each(($error) => {
        expect($error.text()).to.eq("Required");
      });
    cy.location("pathname").should("eq", AddEmployeePage.path);
    cy.get("@createEmployee.all").should("have.length", 0);
  });

  it("TC-PIM-04 rejects an employee ID that is already taken", () => {
    cy.createEmployee().then((existing) => {
      AddEmployeePage.open().fill(anEmployee({ employeeId: existing.employeeId }));

      AddEmployeePage.employeeIdError().should("have.text", "Employee Id already exists");
      cy.location("pathname").should("eq", AddEmployeePage.path);
    });
  });
});
