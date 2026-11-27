import { MY_LEAVE_REQUESTS_API } from "../support/api/leave";
import { Table } from "./components";

/** The ESS user's own list of leave requests. */
export const MyLeavePage = {
  path: "/web/index.php/leave/viewMyLeaveList",

  open() {
    cy.intercept({ method: "GET", pathname: MY_LEAVE_REQUESTS_API }).as("myLeave");
    cy.visit(this.path);
    cy.wait("@myLeave");
    return this;
  },

  rows: () => Table.rows(),
};
