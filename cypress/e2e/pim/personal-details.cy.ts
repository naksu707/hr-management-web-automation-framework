import { findEmployees } from "../../support/api/employees";
import { randomLetters } from "../../support/data/employees";
import { PersonalDetailsPage } from "../../pages/PersonalDetailsPage";
import { Toast } from "../../pages/components";

describe("PIM · Personal details", () => {
  beforeEach(() => {
    cy.loginAs("admin");
  });

  it("TC-PIM-09 edits the employee's name and the API returns the new name", () => {
    const newFirstName = `Edited${randomLetters(5)}`;
    const newLastName = `Renamed${randomLetters(5)}`;

    cy.createEmployee().then((employee) => {
      PersonalDetailsPage.open(employee.empNumber, employee.firstName)
        .changeName(newFirstName, newLastName)
        .save();

      Toast.message().should("contain", "Successfully Updated");

      findEmployees(employee.employeeId).then((found) => {
        expect(found, "employees with this ID").to.have.length(1);
        expect(found[0].firstName).to.eq(newFirstName);
        expect(found[0].lastName).to.eq(newLastName);
      });

      // BUG-002: the name above the photo only changes after a reload
      PersonalDetailsPage.open(employee.empNumber, newFirstName);
      PersonalDetailsPage.employeeName().should("contain", `${newFirstName} ${newLastName}`);
    });
  });

  it("TC-PIM-10 keeps the driver's license number after a reload", () => {
    const license = `DL-${randomLetters(6).toUpperCase()}`;

    cy.createEmployee().then((employee) => {
      PersonalDetailsPage.open(employee.empNumber, employee.firstName)
        .changeDriversLicense(license)
        .save();

      Toast.message().should("contain", "Successfully Updated");
      PersonalDetailsPage.open(employee.empNumber, employee.firstName);
      PersonalDetailsPage.driversLicense().should("have.value", license);
    });
  });

  it("TC-PIM-11 asks for the first name when it is cleared", () => {
    cy.intercept("PUT", PersonalDetailsPage.saveRequest).as("savePersonalDetails");

    cy.createEmployee().then((employee) => {
      PersonalDetailsPage.open(employee.empNumber, employee.firstName);

      PersonalDetailsPage.firstName().clear();
      PersonalDetailsPage.saveButton().click();

      PersonalDetailsPage.firstNameError().should("have.text", "Required");
      cy.get("@savePersonalDetails.all").should("have.length", 0);
    });
  });
});
