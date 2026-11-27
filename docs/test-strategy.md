# Test strategy

The approach used to test [OrangeHRM](https://opensource-demo.orangehrmlive.com/), an open-source human resources system, through its public demo.

## 1. Goals

- Check that the HR flows people use every day work end to end: logging in, managing employees, managing system users and roles, and handling leave requests.
- Check that access by role is enforced: an ESS user (employee) must not reach admin pages.
- Check that what the UI shows agrees with what the API stores.
- Find and document defects with clear steps, so a developer could reproduce them.

## 2. Test levels and tools

| Level                           | What it covers                                                          | Tool                                    |
| ------------------------------- | ----------------------------------------------------------------------- | --------------------------------------- |
| End-to-end (UI)                 | Full user flows in the browser, with one or two roles                   | Cypress 15 with TypeScript              |
| API checks inside E2E tests     | Setting up data and confirming results through the REST API (`/api/v2`) | `cy.request`                            |
| UI behavior with simulated APIs | Empty lists, slow answers and server errors                             | `cy.intercept` with fixtures and delays |
| Static checks                   | Lint and types, before any test runs                                    | ESLint, Prettier, `tsc --noEmit`        |
| Cross-browser                   | Every test in Chrome, Firefox and Edge                                  | GitHub Actions matrix                   |

## 3. What is in and out of scope

**In scope:** authentication and sessions, PIM (add, search, edit, delete employees), Admin · User management (system users, roles, disabled accounts), Leave (apply, approve, reject), and how the employee list reacts to API failures.

**Out of scope:** performance and load (shared demo), security testing beyond access by role, email notifications, the mobile layout, and modules not listed above (Recruitment, Time, Performance, Claims, Buzz).

## 4. Test design techniques

- **Risk-based priority:** authentication, access by role and employee records are Critical; users, roles and leave are High; search, validation messages and UI error handling are Medium.
- **Equivalence partitions and boundary values:** valid and invalid logins, a username of 4 characters (below the minimum of 5), required fields left empty.
- **Data-driven tests:** invalid logins come from a JSON fixture, one test per data set.
- **State transitions:** a leave request moves from Pending Approval to Scheduled or Rejected, and each transition is checked in the UI and the API.
- **Error guessing:** duplicate employee IDs and usernames, disabled accounts, an ESS user opening an admin URL directly.

## 5. Test data

- Every test creates the employees, users and leave types it needs through the API, with unique names, IDs and usernames.
- A global `afterEach` deletes that data as admin, even when the test fails or ends logged in as another user.
- No test depends on data that exists in the demo, except the public admin account.

## 6. Environments and risks of a shared public demo

| Risk                                                | How the framework handles it                                                            |
| --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Other people change or delete data at the same time | Each test uses its own unique data                                                      |
| The demo resets and cached sessions stop working    | `cy.session` validates the session through the API and logs in again if needed          |
| The demo is slow or does not answer                 | Longer timeouts, 2 retries in CI, and a CI step that waits up to 3 minutes for the demo |
| The app throws errors it does not handle (BUG-001)  | Only that exact pattern is ignored, and it is logged; any other error fails the test    |

## 7. Defect management

Defects are written in [`defects.md`](defects.md) with an ID, severity, environment, steps to reproduce, expected and actual results, impact, and how the tests deal with them. A test that finds a defect names it in a comment and in [`test-cases.md`](test-cases.md).

## 8. Entry and exit criteria

**Entry:** lint and type check pass, and the demo answers.

**Exit:** every test passes in Chrome, Firefox and Edge, and every defect found is documented.

## 9. Reporting

- A Mochawesome HTML report per browser, with screenshots of failures embedded.
- Reports published on GitHub Pages after every run on `main`, with a summary page per browser.
- Artifacts in each GitHub Actions run: the reports and the screenshots of failed tests.
