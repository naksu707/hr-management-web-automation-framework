import { EMPLOYEE_LEAVE_REQUESTS_API } from "../support/api/leave";
import { pickFromAutocomplete, Table } from "./components";

/** The admin's list of leave requests. By default it shows those pending approval. */
export const LeaveListPage = {
  path: "/web/index.php/leave/viewLeaveList",

  open() {
    cy.intercept({ method: "GET", pathname: EMPLOYEE_LEAVE_REQUESTS_API }).as("leaveList");
    cy.visit(this.path);
    cy.wait("@leaveList");
    return this;
  },

  rows: () => Table.rows(),

  searchByEmployee(firstName: string) {
    pickFromAutocomplete("Employee Name", firstName);
    cy.intercept({ method: "GET", pathname: EMPLOYEE_LEAVE_REQUESTS_API }).as("leaveSearch");
    cy.get('button[type="submit"]').click();
    cy.wait("@leaveSearch");
    return this;
  },

  /** Clicks Approve or Reject on the first row and waits for the update. */
  decideFirstRow(decision: "Approve" | "Reject") {
    // Matches the update of one request (/leave-requests/{id}) or of several at once
    cy.intercept({ method: "PUT", url: /\/api\/v2\/leave\/employees\/leave-requests/ }).as(
      "leaveDecision",
    );
    this.rows().first().contains("button", decision).click();
    cy.wait("@leaveDecision").its("response.statusCode").should("eq", 200);
    return this;
  },
};
