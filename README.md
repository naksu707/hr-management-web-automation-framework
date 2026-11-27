<div align="center">

# HR Management Web Automation Framework

**End-to-end test automation for an HR management system, with Cypress and TypeScript**

![Cypress](https://img.shields.io/badge/Cypress-17202C?style=flat-square&logo=cypress&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Mochawesome](docs/images/badge-mochawesome.svg)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

[![E2E tests](https://github.com/naksu707/hr-management-web-automation-framework/actions/workflows/cypress.yml/badge.svg)](https://github.com/naksu707/hr-management-web-automation-framework/actions/workflows/cypress.yml)

**[📊 Latest test reports](https://naksu707.github.io/hr-management-web-automation-framework/)** · **[🧪 Test cases](docs/test-cases.md)** · **[🐞 Defects](docs/defects.md)** · **[🧭 Test strategy](docs/test-strategy.md)** · **[🗓️ Test plan](docs/test-plan.md)**

</div>

---

## 📈 In numbers

|                         |                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **40** automated tests  | Authentication 11 · PIM 11 · Admin 10 · Leave 4 · Network 4                                                      |
| **3** browsers          | Chrome, Firefox and Edge on every push: **120** test runs per CI run                                             |
| **10** Page Objects     | Plus shared components for fields, dropdowns, dates, tables and toasts                                           |
| **6** custom commands   | `cy.loginAs`, `cy.loginWith`, `cy.createEmployee`, `cy.deleteEmployee`, `cy.createUser`, `cy.createEssWithLeave` |
| **2** roles in one flow | An ESS user applies for leave and the admin approves or rejects it                                               |
| **2** defects found     | Documented with steps, evidence per browser and impact                                                           |

---

## 💡 About

A test automation framework for **[OrangeHRM](https://opensource-demo.orangehrmlive.com/)**, the public demo of an open-source human resources system. It covers what HR teams do every day: managing employees, creating system users with different roles, and handling leave requests that go from an employee to an approver.

The project uses Cypress the way it works best:

| Technique                          | What it is used for                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Page Objects + custom commands** | Readable tests that describe what the user does, not how the page is built                                               |
| **`cy.session`**                   | Log in once per role and reuse the session, so tests stay fast                                                           |
| **`cy.request`**                   | Create and delete test data through the REST API, instead of clicking through forms that are not under test              |
| **`cy.intercept`**                 | Wait for the real API calls instead of fixed waits, and simulate empty lists and server errors to test how the UI reacts |
| **Fixtures**                       | Data-driven tests with JSON test data                                                                                    |

**Design goals**

- **Independent tests:** each test creates its own employees and users with unique names, and deletes them at the end.
- **No fixed waits:** every wait is tied to a network call or a visible element.
- **UI and API agree:** what the UI saves is checked through the API, and data created through the API is checked in the UI.
- **Two roles, one flow:** an employee requests leave and the admin approves it, each with their own session.

---

## 🧪 Test scope

| Area                    | What is tested                                                                                                               | Status                    |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Authentication          | Login, invalid credentials, required fields, logout, protected pages, forgot password                                        | ✅ Done                   |
| PIM · Employees         | Add an employee, required fields, duplicate ID, search by name and ID, edit personal details, delete                         | ✅ Done                   |
| Admin · User management | Create a system user for an employee, roles (Admin / ESS), disabled accounts, duplicate username, validation, search, delete | ✅ Done                   |
| Leave                   | An employee applies for leave, the admin approves or rejects it, required fields                                             | ✅ Done                   |
| Network behavior        | Stubbed results (fixture), empty results, a slow API and server errors, simulated with `cy.intercept`                        | ✅ Done                   |
| UI vs. API consistency  | An employee added in the UI exists in the API; data created through the API appears in the UI                                | ✅ Done, inside each area |

### Risk-based priorities

| Priority     | Features                                                          |
| ------------ | ----------------------------------------------------------------- |
| **Critical** | Authentication, access by role, employee records                  |
| **High**     | System users and roles, leave requests and approvals              |
| **Medium**   | Search and filters, validation messages, error handling in the UI |

Detailed test cases are in [`docs/test-cases.md`](docs/test-cases.md).

### 🐞 Defects found

| ID                                                                                                      | Severity | Defect                                                                                                                     |
| ------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| [BUG-001](docs/defects.md#bug-001--the-app-does-not-handle-requests-that-fail-or-are-cancelled)         | Low      | The app does not handle requests that fail or are cancelled (logout, leaving a page while it loads, ESS dashboard widgets) |
| [BUG-002](docs/defects.md#bug-002--the-employees-name-in-the-header-does-not-change-after-it-is-edited) | Low      | The employee's name in the header does not change after it is edited, until the page is reloaded                           |

---

## 🛠️ Tech stack

| Purpose       | Tool                                                                |
| ------------- | ------------------------------------------------------------------- |
| Language      | TypeScript                                                          |
| E2E framework | Cypress                                                             |
| Runtime       | Node.js 22                                                          |
| Test data     | Fixtures (JSON) and API setup with `cy.request`                     |
| Reporting     | Mochawesome (HTML) per browser, published on GitHub Pages           |
| Code quality  | ESLint, Prettier and the TypeScript compiler (`tsc --noEmit`)       |
| CI/CD         | GitHub Actions, with a cross-browser matrix (Chrome, Firefox, Edge) |
| IDE           | Visual Studio Code / WebStorm                                       |

---

## 🏗️ Architecture

```text
hr-management-web-automation-framework
├── cypress/
│   ├── e2e/
│   │   ├── auth/            Login, logout, protected pages
│   │   ├── pim/             Employees: add, search, edit, delete
│   │   ├── admin/           System users and roles
│   │   ├── leave/           Leave requests and approvals across two roles
│   │   └── network/         UI behavior with stubbed API responses
│   ├── pages/               Page Objects: LoginPage, DashboardPage, AddEmployeePage,
│   │                        PersonalDetailsPage, EmployeeListPage, AddSystemUserPage,
│   │                        SystemUsersPage, ApplyLeavePage, LeaveListPage, MyLeavePage,
│   │                        and shared components (fields, dropdowns, dates,
│   │                        autocomplete, tables, toasts, side menu)
│   ├── support/
│   │   ├── commands.ts      cy.loginAs(role), cy.loginWith(), cy.createEmployee(), cy.createUser(),
│   │   │                    cy.createEssWithLeave()
│   │   ├── index.d.ts       Types of the custom commands
│   │   ├── api/             Typed helpers for the OrangeHRM REST API
│   │   ├── data/            Test data builders with unique names and IDs
│   │   ├── known-defects.ts Handling of known app defects (BUG-001)
│   │   └── e2e.ts           Global hooks: reporter and clean-up after each test
│   └── fixtures/            JSON test data (invalid logins, stubbed employee list)
├── .github/               CI: lint, type check, cross-browser matrix and report publishing
├── report/                Landing page of the published reports
├── docs/                    Test strategy, test plan, test cases and defects
├── cypress.config.ts        Base URL, retries, reporter, environments
├── tsconfig.json
└── package.json
```

**How a test flows:**

```text
   cy.loginAs("admin")  ──►  session cached with cy.session
           │
   cy.createEmployee()  ──►  POST /api/v2/pim/employees    (fast setup, no clicking)
           │
   Page Object actions  ──►  the behavior under test, in the browser
           │
   cy.intercept + wait  ──►  the real API call finishes before asserting
           │
   assertions in UI and API, then clean-up through the API
```

---

## ✍️ Examples

**E2E test with a Page Object and a network wait**

```typescript
describe("PIM · Employees", () => {
  beforeEach(() => {
    cy.loginAs("admin");
  });

  it("adds an employee and finds them by name", () => {
    const employee = anEmployee();
    cy.intercept("POST", "**/api/v2/pim/employees").as("createEmployee");

    AddEmployeePage.open().fillName(employee).save();

    cy.wait("@createEmployee").its("response.statusCode").should("eq", 200);
    EmployeeListPage.open().searchByName(employee.firstName);
    EmployeeListPage.rows().should("contain", employee.lastName);
  });
});
```

**Simulating a server error**

```typescript
it("shows an error message when the employee list cannot be loaded", () => {
  cy.intercept("GET", "**/api/v2/pim/employees*", { statusCode: 500 }).as("employees");

  EmployeeListPage.open();

  cy.wait("@employees");
  cy.get(".oxd-toast").should("contain", "Error");
});
```

---

## ▶️ Run the tests

**Requirements:** Node.js 20+ (22 in CI) and Git.

```bash
# Install the dependencies
npm install

# Open the Cypress app to run tests one by one and watch them
npx cypress open

# Run every test headless (Electron)
npx cypress run

# Run in a specific browser
npx cypress run --browser chrome

# Run one area
npm run test:auth
npm run test:pim
npm run test:admin
npm run test:leave
npm run test:network

# Code quality
npm run lint
npm run typecheck
```

The HTML report is saved in `cypress/reports/index.html`.

---

## ⚙️ CI/CD

GitHub Actions runs on every push to `main`, on every pull request, and on demand:

1. **Quality:** ESLint and the TypeScript type check. The tests only run if this passes.
2. **Demo check:** each job waits up to 5 minutes for the public demo to answer before running the tests.
3. **Cross-browser matrix:** the full suite in Chrome, Firefox and Edge, in parallel.
4. **Artifacts:** the Mochawesome report for each browser, plus screenshots of failed tests.
5. **Published reports:** on `main`, the three reports are published on **[GitHub Pages](https://naksu707.github.io/hr-management-web-automation-framework/)**, with a landing page that shows the results of each browser.

---

## 🗺️ Roadmap

- [x] Framework core: Cypress with TypeScript, Page Objects, custom commands, `cy.session` login, API helpers
- [x] Authentication tests
- [x] PIM: add, search, edit and delete employees
- [x] Admin: system users and access by role
- [x] Leave: request, approval and rejection across two roles
- [x] Network behavior with `cy.intercept`
- [x] UI vs. API consistency tests
- [x] CI with GitHub Actions: lint, type check and cross-browser matrix
- [x] Reports published on GitHub Pages
- [x] Test cases and defect reports
- [x] Test strategy and test plan

---

## ⚠️ Known limitations

- The OrangeHRM demo is public and shared: other people change its data at the same time, and it resets regularly. Tests create the data they need with unique names and never rely on data they did not create.
- The admin credentials (`Admin` / `admin123`) are public demo data, shown on the demo's own login page.
- Some runs can fail because the demo is down or slow, not because of a defect. The CI waits for the demo and retries failed tests twice; a run can be repeated with **Run workflow**.

---

> [!NOTE]
> **Project status: Completed ✅**
> This repository is finished and is no longer being updated. All projects were last verified to work correctly as of **November 26, 2026**. Later changes to browsers, libraries or dependencies may affect how some projects run.

---

<div align="center">

Made by 💜 **[Maria Jose Ospina](https://github.com/naksu707)** 💜

</div>

