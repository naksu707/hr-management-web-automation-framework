import "cypress-mochawesome-reporter/register";
import "./commands";
import { cleanUpEmployees, hasEmployeesToCleanUp } from "./api/employees";
import { cleanUpLeaveTypes, hasLeaveTypesToCleanUp } from "./api/leave";
import { cleanUpUsers, hasUsersToCleanUp } from "./api/users";
import { ignoreBug001 } from "./known-defects";

ignoreBug001();

/**
 * Deletes the test data created during the test, even when it fails.
 * A test may end logged in as another user, so the clean-up runs as admin.
 */
afterEach(() => {
  if (!hasUsersToCleanUp() && !hasEmployeesToCleanUp() && !hasLeaveTypesToCleanUp()) {
    return;
  }
  cy.loginAs("admin");
  cleanUpUsers();
  cleanUpEmployees();
  cleanUpLeaveTypes();
});
