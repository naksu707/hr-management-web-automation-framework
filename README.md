<div align="center">

# 👥 HR Management Web Automation Framework

**End-to-end test automation for an HR management system, with Cypress and TypeScript**

![Cypress](https://img.shields.io/badge/Cypress-17202C?style=flat-square&logo=cypress&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Mochawesome](https://img.shields.io/static/v1?label=&message=Mochawesome&color=8D6748&style=flat-square&logo=mocha&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

</div>

> [!NOTE]
> **Status: in progress 🚧** · The scope and architecture are defined. Implementation starts with the framework core, authentication and employee management (PIM).

---

## 💡 About

A test automation framework for **[OrangeHRM](https://opensource-demo.orangehrmlive.com/)**, the public demo of an open-source human resources system. It covers what HR teams do every day: managing employees, creating system users with different roles, and handling leave requests that go from an employee to an approver.

The project uses Cypress the way it works best:

| Technique | What it is used for |
|---|---|
| **Page Objects + custom commands** | Readable tests that describe what the user does, not how the page is built |
| **`cy.session`** | Log in once per role and reuse the session, so tests stay fast |
| **`cy.request`** | Create and delete test data through the REST API, instead of clicking through forms that are not under test |
| **`cy.intercept`** | Wait for the real API calls instead of fixed waits, and simulate empty lists and server errors to test how the UI reacts |
| **Fixtures** | Data-driven tests with JSON test data |

**Design goals**

- **Independent tests:** each test creates its own employees and users with unique names, and deletes them at the end.
- **No fixed waits:** every wait is tied to a network call or a visible element.
- **UI and API agree:** what the UI saves is checked through the API, and data created through the API is checked in the UI.
- **Two roles, one flow:** an employee requests leave and the admin approves it, each with their own session.

---

## 🧪 Test scope

| Area | What is tested | Status |
|---|---|---|
| Authentication | Login, invalid credentials, required fields, logout, protected pages, forgot password | Planned |
| PIM · Employees | Add an employee, required fields, search by name and ID, edit personal details, delete | Planned |
| Admin · User management | Create a system user for an employee, roles (Admin / ESS), status, duplicate username, password rules, search, delete | Planned |
| Leave | An employee applies for leave, the admin approves or rejects it, leave list filters | Planned |
| Network behavior | Empty results and server errors simulated with `cy.intercept`, and what the UI shows | Planned |
| UI vs. API consistency | An employee added in the UI exists in the API; data created through the API appears in the UI | Planned |

### Risk-based priorities

| Priority | Features |
|---|---|
| **Critical** | Authentication, access by role, employee records |
| **High** | System users and roles, leave requests and approvals |
| **Medium** | Search and filters, validation messages, error handling in the UI |

Detailed test cases will be documented in `docs/test-cases.md`, and defects found in `docs/defects.md`.

---

## 🛠️ Tech stack

| Purpose | Tool |
|---|---|
| Language | TypeScript |
| E2E framework | Cypress |
| Runtime | Node.js 20 |
| Test data | Fixtures (JSON) and API setup with `cy.request` |
| Reporting | Mochawesome (HTML), screenshots and videos of failed tests |
| Code quality | ESLint and Prettier |
| CI/CD | GitHub Actions, with a cross-browser matrix (Chrome, Firefox, Edge) |
| IDE | Visual Studio Code / WebStorm |

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
│   ├── pages/               Page Objects: LoginPage, EmployeeListPage, AddEmployeePage,
│   │                        UserManagementPage, LeaveListPage, ApplyLeavePage
│   ├── support/
│   │   ├── commands.ts      cy.loginAs(role), cy.createEmployee(), cy.deleteEmployee()
│   │   ├── api/             Typed helpers for the OrangeHRM REST API
│   │   └── e2e.ts           Global hooks and reporter setup
│   └── fixtures/            Users, employees and leave test data
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

**Requirements:** Node.js 20+ and Git.

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
npx cypress run --spec "cypress/e2e/pim/**"
```

---

## ⚙️ CI/CD

GitHub Actions will run the suite on every push to `main` and on every pull request:

- **Cross-browser matrix:** Chrome, Firefox and Edge.
- **Artifacts:** the Mochawesome report, plus screenshots and videos of failed tests.
- **Published report:** the HTML report on GitHub Pages, so the latest results can be seen without downloading anything.

---

## 🗺️ Roadmap

- [ ] Framework core: Cypress with TypeScript, Page Objects, custom commands, `cy.session` login, API helpers
- [ ] Authentication tests
- [ ] PIM: employee management
- [ ] Admin: system users and roles
- [ ] Leave: request and approval across two roles
- [ ] Network behavior with `cy.intercept`
- [ ] UI vs. API consistency tests
- [ ] CI with GitHub Actions: cross-browser matrix and published report
- [ ] Test strategy, test plan, test cases and defect reports

---

## ⚠️ Known limitations

- The OrangeHRM demo is public and shared: other people change its data at the same time, and it resets regularly. Tests create the data they need with unique names and never rely on data they did not create.
- The admin credentials (`Admin` / `admin123`) are public demo data, shown on the demo's own login page.

---

<div align="center">

Made by 💜 **[Maria Jose Ospina](https://github.com/naksu707)** 💜

</div>
