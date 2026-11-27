import type { CreatedEmployee, Employee } from "../data/employees";

export const EMPLOYEES_API = "/web/index.php/api/v2/pim/employees";

/** empNumbers created during the current test, deleted in a global afterEach. */
let createdEmployees: number[] = [];

export function trackEmployee(empNumber: number): void {
  createdEmployees.push(empNumber);
}

export function createEmployee(employee: Employee): Cypress.Chainable<CreatedEmployee> {
  return cy
    .request({
      method: "POST",
      url: EMPLOYEES_API,
      body: {
        firstName: employee.firstName,
        middleName: employee.middleName ?? "",
        lastName: employee.lastName,
        empPicture: null,
        employeeId: employee.employeeId,
      },
    })
    .then((response) => {
      expect(response.status, "create employee").to.eq(200);
      const created: CreatedEmployee = { ...employee, empNumber: response.body.data.empNumber };
      trackEmployee(created.empNumber);
      return created;
    });
}

export function deleteEmployees(
  empNumbers: number[],
): Cypress.Chainable<Cypress.Response<unknown>> {
  return cy.request({
    method: "DELETE",
    url: EMPLOYEES_API,
    body: { ids: empNumbers },
    // The employee may already be gone (deleted by the test, or by a demo reset)
    failOnStatusCode: false,
  });
}

/** Employees whose name or ID matches the text. */
export function findEmployees(nameOrId: string): Cypress.Chainable<CreatedEmployee[]> {
  return cy
    .request({
      method: "GET",
      url: EMPLOYEES_API,
      qs: { nameOrId, limit: 50, offset: 0, includeEmployees: "onlyCurrent" },
    })
    .then((response) => {
      expect(response.status, "search employees").to.eq(200);
      return response.body.data as CreatedEmployee[];
    });
}

export function hasEmployeesToCleanUp(): boolean {
  return createdEmployees.length > 0;
}

export function cleanUpEmployees(): void {
  if (createdEmployees.length === 0) {
    return;
  }
  const ids = [...createdEmployees];
  createdEmployees = [];
  deleteEmployees(ids);
}
