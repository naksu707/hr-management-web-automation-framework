import type { LeavePeriod } from "../data/leave";

const LEAVE_API = "/web/index.php/api/v2/leave";
export const LEAVE_TYPES_API = `${LEAVE_API}/leave-types`;
export const MY_LEAVE_REQUESTS_API = `${LEAVE_API}/leave-requests`;
export const EMPLOYEE_LEAVE_REQUESTS_API = `${LEAVE_API}/employees/leave-requests`;

/** Status ids OrangeHRM uses: rejected, cancelled, pending approval, scheduled, taken. */
const ALL_STATUSES = [-1, 0, 1, 2, 3];

/** ids of leave types created during the current test, deleted in a global afterEach. */
let createdLeaveTypes: number[] = [];

export function hasLeaveTypesToCleanUp(): boolean {
  return createdLeaveTypes.length > 0;
}

export function getCurrentLeavePeriod(): Cypress.Chainable<LeavePeriod> {
  return cy.request(`${LEAVE_API}/leave-periods`).then((response) => {
    expect(response.status, "leave periods").to.eq(200);
    const current = response.body.meta?.currentLeavePeriod as LeavePeriod | undefined;
    const periods = response.body.data as LeavePeriod[];
    return current ?? periods[periods.length - 1];
  });
}

export function createLeaveType(name: string): Cypress.Chainable<number> {
  return cy
    .request({ method: "POST", url: LEAVE_TYPES_API, body: { name, situational: false } })
    .then((response) => {
      expect(response.status, "create leave type").to.eq(200);
      const id = response.body.data.id as number;
      createdLeaveTypes.push(id);
      return id;
    });
}

export function addEntitlement(
  empNumber: number,
  leaveTypeId: number,
  period: LeavePeriod,
  days: number,
): Cypress.Chainable<Cypress.Response<unknown>> {
  return cy
    .request({
      method: "POST",
      url: `${LEAVE_API}/leave-entitlements`,
      body: {
        empNumber,
        leaveTypeId,
        fromDate: period.startDate,
        toDate: period.endDate,
        entitlement: days,
      },
    })
    .then((response) => {
      expect(response.status, "add leave entitlement").to.eq(200);
      return response;
    });
}

/** Applies for one full day of leave as the user who is logged in. */
export function applyForLeave(
  leaveTypeId: number,
  date: string,
  comment: string,
): Cypress.Chainable<Cypress.Response<unknown>> {
  return cy
    .request({
      method: "POST",
      url: MY_LEAVE_REQUESTS_API,
      body: {
        leaveTypeId,
        fromDate: date,
        toDate: date,
        comment,
        duration: { type: "full_day" },
      },
    })
    .then((response) => {
      expect(response.status, "apply for leave").to.eq(200);
      return response;
    });
}

/** The employee's leave requests in the period, in any status (needs an admin session). */
export function findLeaveRequests(
  empNumber: number,
  period: LeavePeriod,
): Cypress.Chainable<unknown[]> {
  const statuses = ALL_STATUSES.map((status) => `statuses[]=${status}`).join("&");
  const url =
    `${EMPLOYEE_LEAVE_REQUESTS_API}?empNumber=${empNumber}` +
    `&fromDate=${period.startDate}&toDate=${period.endDate}&${statuses}` +
    `&includeEmployees=onlyCurrent&limit=50&offset=0`;

  return cy.request(url).then((response) => {
    expect(response.status, "search leave requests").to.eq(200);
    return response.body.data as unknown[];
  });
}

export function cleanUpLeaveTypes(): void {
  if (createdLeaveTypes.length === 0) {
    return;
  }
  const ids = [...createdLeaveTypes];
  createdLeaveTypes = [];
  cy.request({
    method: "DELETE",
    url: LEAVE_TYPES_API,
    body: { ids },
    failOnStatusCode: false,
  });
}
