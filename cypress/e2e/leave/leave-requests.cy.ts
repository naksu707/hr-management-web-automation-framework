import { applyForLeave, findLeaveRequests } from "../../support/api/leave";
import { aFutureWorkingDay, type LeaveSetup } from "../../support/data/leave";
import { ApplyLeavePage } from "../../pages/ApplyLeavePage";
import { LeaveListPage } from "../../pages/LeaveListPage";
import { MyLeavePage } from "../../pages/MyLeavePage";
import { Toast } from "../../pages/components";

/** The status of the employee's only leave request, as the API reports it. */
function expectLeaveStatus(setup: LeaveSetup, status: string): void {
  cy.loginAs("admin");
  findLeaveRequests(setup.empNumber, setup.period).then((requests) => {
    expect(requests, "leave requests of the employee").to.have.length(1);
    expect(JSON.stringify(requests[0]), "leave request").to.contain(status);
  });
}

describe("Leave · Requests across two roles", () => {
  it("TC-LV-01 an employee applies for leave and it waits for approval", () => {
    cy.createEssWithLeave(10).then((setup) => {
      const day = aFutureWorkingDay(setup.period);
      cy.loginWith(setup.username, setup.password);

      ApplyLeavePage.open().chooseLeaveType(setup.leaveTypeName);
      ApplyLeavePage.balance().should("contain", "10.00");
      ApplyLeavePage.chooseDay(day).writeComment("Family trip").apply();

      cy.wait("@applyLeave").its("response.statusCode").should("eq", 200);
      Toast.message().should("contain", "Successfully Saved");

      MyLeavePage.open();
      MyLeavePage.rows()
        .should("have.length", 1)
        .first()
        .should("contain", setup.leaveTypeName)
        .and("contain", "Pending Approval");

      expectLeaveStatus(setup, "Pending Approval");
    });
  });

  it("TC-LV-02 the admin approves a leave request and the employee sees it scheduled", () => {
    cy.createEssWithLeave(10).then((setup) => {
      cy.loginWith(setup.username, setup.password);
      applyForLeave(setup.leaveTypeId, aFutureWorkingDay(setup.period), "Doctor appointment");

      cy.loginAs("admin");
      LeaveListPage.open().searchByEmployee(setup.firstName);
      // The list may format the name differently (spacing, middle name), so each part is checked
      LeaveListPage.rows()
        .should("have.length", 1)
        .first()
        .should("contain", setup.firstName)
        .and("contain", setup.leaveTypeName);
      LeaveListPage.decideFirstRow("Approve");
      Toast.message().should("contain", "Successfully Updated");

      cy.loginWith(setup.username, setup.password);
      MyLeavePage.open();
      MyLeavePage.rows().first().should("contain", "Scheduled");

      expectLeaveStatus(setup, "Scheduled");
    });
  });

  it("TC-LV-03 the admin rejects a leave request", () => {
    cy.createEssWithLeave(10).then((setup) => {
      cy.loginWith(setup.username, setup.password);
      applyForLeave(setup.leaveTypeId, aFutureWorkingDay(setup.period), "Conference");

      cy.loginAs("admin");
      LeaveListPage.open().searchByEmployee(setup.firstName);
      LeaveListPage.decideFirstRow("Reject");
      Toast.message().should("contain", "Successfully Updated");

      expectLeaveStatus(setup, "Rejected");
    });
  });

  it("TC-LV-04 asks for the leave type and the dates", () => {
    cy.createEssWithLeave(10).then((setup) => {
      cy.loginWith(setup.username, setup.password);

      ApplyLeavePage.open().apply();

      ApplyLeavePage.fieldError("Leave Type").should("have.text", "Required");
      ApplyLeavePage.fieldError("From Date").should("have.text", "Required");
      ApplyLeavePage.fieldError("To Date").should("have.text", "Required");
      cy.get("@applyLeave.all").should("have.length", 0);
    });
  });
});
