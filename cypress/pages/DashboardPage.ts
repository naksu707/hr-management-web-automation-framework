export const DashboardPage = {
  path: "/web/index.php/dashboard/index",

  open() {
    cy.visit(this.path);
    return this;
  },

  header: () => cy.get(".oxd-topbar-header-breadcrumb"),
  userDropdown: () => cy.get(".oxd-userdropdown-tab"),

  logout() {
    this.userDropdown().click();
    cy.contains(".oxd-userdropdown-link", "Logout").click();
    return this;
  },
};
