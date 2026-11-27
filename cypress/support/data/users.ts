/**
 * Public demo credentials, shown on the demo's own login page.
 * Real credentials would come from CI secrets instead.
 */
export const USERS = {
  admin: { username: "Admin", password: "admin123" },
} as const;

export type Role = keyof typeof USERS;
