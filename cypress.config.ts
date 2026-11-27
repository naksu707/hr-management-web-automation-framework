import { defineConfig } from "cypress";

export default defineConfig({
  // Test data lives in typed modules, so the browser never reads Cypress.env()
  allowCypressEnv: false,
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1440,
    viewportHeight: 900,
    // The public demo is shared and sometimes slow
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    retries: { runMode: 2, openMode: 0 },
    video: false,
    screenshotOnRunFailure: true,
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      reportDir: "cypress/reports",
      reportPageTitle: "HR Management · Cypress report",
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
});
