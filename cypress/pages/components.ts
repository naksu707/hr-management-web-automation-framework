/** Shared OrangeHRM components, used by several pages. */

/** Toast messages shown after saving or deleting. */
export const Toast = {
  message: () => cy.get(".oxd-toast", { timeout: 30000 }),
};

/** A form field, found by its label. */
export function field(label: string | RegExp) {
  return cy.contains(".oxd-input-group", label);
}

/** The error message under a form field. */
export function fieldError(label: string | RegExp) {
  return field(label).find(".oxd-input-field-error-message");
}

/** Opens an OrangeHRM dropdown and picks an option. */
export function selectOption(label: string, option: string): void {
  field(label).find(".oxd-select-text").click();
  cy.contains(".oxd-select-dropdown .oxd-select-option", option).click();
  field(label).find(".oxd-select-text-input").should("have.text", option);
}

/** Types in an autocomplete and picks the suggestion that contains the text. */
export function pickFromAutocomplete(label: string, text: string): void {
  field(label).find("input").clear().type(text);
  cy.contains(".oxd-autocomplete-option", text).click();
}

/** The rows of the results table. */
export const Table = {
  rows: () => cy.get(".oxd-table-body .oxd-table-card"),
  recordsFound: () => cy.contains("span.oxd-text", /Record(s)? Found/),

  /** Clicks the trash icon of the first row and confirms. */
  deleteFirstRow(): void {
    Table.rows().first().find(".bi-trash").closest("button").click();
    cy.contains(".oxd-dialog-sheet button", "Yes, Delete").click();
  },
};

/** The main menu on the left side. */
export const SideMenu = {
  items: () => cy.get(".oxd-main-menu-item"),
  item: (name: string) => cy.contains(".oxd-main-menu-item", name),
};
