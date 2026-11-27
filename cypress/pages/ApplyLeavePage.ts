import { MY_LEAVE_REQUESTS_API } from "../support/api/leave";
import { field, fieldError, selectOption, typeDate } from "./components";

export const ApplyLeavePage = {
  path: "/web/index.php/leave/applyLeave",

  open() {
    cy.visit(this.path);
    cy.contains("h6", "Apply Leave").should("be.visible");
    return this;
  },

  /** The balance shown after choosing a leave type, such as "10.00 Day(s)". */
  balance: () => cy.contains(/\d+\.\d{2} Day\(s\)/),
  comments: () => field("Comments").find("textarea"),
  applyButton: () => cy.get('button[type="submit"]'),
  fieldError: (label: string) => fieldError(label),

  chooseLeaveType(name: string) {
    selectOption("Leave Type", name);
    return this;
  },

  /** One full day of leave. */
  chooseDay(isoDate: string) {
    typeDate("From Date", isoDate);
    typeDate("To Date", isoDate);
    // Closes the date picker, if it is still open
    cy.contains("h6", "Apply Leave").click();
    return this;
  },

  writeComment(comment: string) {
    this.comments().type(comment);
    return this;
  },

  apply() {
    cy.intercept({ method: "POST", pathname: MY_LEAVE_REQUESTS_API }).as("applyLeave");
    this.applyButton().click();
    return this;
  },
};
