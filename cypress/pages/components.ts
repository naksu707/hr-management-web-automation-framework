/** Toast messages shown after saving or deleting. */
export const Toast = {
  message: () => cy.get(".oxd-toast", { timeout: 30000 }),
};
