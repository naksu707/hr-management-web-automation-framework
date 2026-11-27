import { randomLetters } from "./employees";

/**
 * Public demo credentials, shown on the demo's own login page.
 * Real credentials would come from CI secrets instead.
 */
export const USERS = {
  admin: { username: "Admin", password: "admin123" },
} as const;

export type Role = keyof typeof USERS;

/** The roles OrangeHRM gives to system users, with their API ids. */
export const USER_ROLES = { Admin: 1, ESS: 2 } as const;

export type UserRole = keyof typeof USER_ROLES;

export interface SystemUser {
  username: string;
  password: string;
  role: UserRole;
  enabled: boolean;
  empNumber: number;
}

export interface CreatedSystemUser extends SystemUser {
  id: number;
}

/** Meets the demo's password rules: length, upper and lower case, a number and a symbol. */
export const TEST_PASSWORD = "HrmTest-2026!";

export function uniqueUsername(): string {
  return `cy.${randomLetters(10)}`;
}

/** An enabled ESS user for the employee, with a unique username. */
export function aSystemUser(empNumber: number, overrides: Partial<SystemUser> = {}): SystemUser {
  return {
    username: uniqueUsername(),
    password: TEST_PASSWORD,
    role: "ESS",
    enabled: true,
    empNumber,
    ...overrides,
  };
}
