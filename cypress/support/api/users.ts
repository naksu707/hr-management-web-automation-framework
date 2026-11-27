import { USER_ROLES, type CreatedSystemUser, type SystemUser } from "../data/users";

export const USERS_API = "/web/index.php/api/v2/admin/users";

interface UserRecord {
  id: number;
  userName: string;
  status: boolean;
  userRole: { id: number; name: string };
  employee: { empNumber: number; firstName: string; lastName: string };
}

/** ids of system users created during the current test, deleted in a global afterEach. */
let createdUsers: number[] = [];

export function trackUser(id: number): void {
  createdUsers.push(id);
}

export function hasUsersToCleanUp(): boolean {
  return createdUsers.length > 0;
}

export function createUser(user: SystemUser): Cypress.Chainable<CreatedSystemUser> {
  return cy
    .request({
      method: "POST",
      url: USERS_API,
      body: {
        username: user.username,
        password: user.password,
        status: user.enabled,
        userRoleId: USER_ROLES[user.role],
        empNumber: user.empNumber,
      },
    })
    .then((response) => {
      expect(response.status, "create system user").to.eq(200);
      const created: CreatedSystemUser = { ...user, id: response.body.data.id };
      trackUser(created.id);
      return created;
    });
}

export function deleteUsers(ids: number[]): Cypress.Chainable<Cypress.Response<unknown>> {
  return cy.request({
    method: "DELETE",
    url: USERS_API,
    body: { ids },
    // The user may already be gone (deleted by the test, or by a demo reset)
    failOnStatusCode: false,
  });
}

/** System users whose username matches exactly. */
export function findUsers(username: string): Cypress.Chainable<UserRecord[]> {
  return cy
    .request({
      method: "GET",
      url: USERS_API,
      qs: { username, limit: 50, offset: 0 },
    })
    .then((response) => {
      expect(response.status, "search system users").to.eq(200);
      return (response.body.data as UserRecord[]).filter((user) => user.userName === username);
    });
}

export function cleanUpUsers(): void {
  if (createdUsers.length === 0) {
    return;
  }
  const ids = [...createdUsers];
  createdUsers = [];
  deleteUsers(ids);
}
