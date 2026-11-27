export const PersonalDetailsPage = {
  pathPattern: /\/pim\/viewPersonalDetails\/empNumber\/(\d+)/,

  employeeName: () => cy.get(".orangehrm-edit-employee-name h6"),
  firstName: () => cy.get('input[name="firstName"]'),
  lastName: () => cy.get('input[name="lastName"]'),
};
