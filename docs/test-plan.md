# Test plan

| Field          | Value                                      |
| -------------- | ------------------------------------------ |
| **Product**    | OrangeHRM 5 (public demo)                  |
| **URL**        | https://opensource-demo.orangehrmlive.com  |
| **Approach**   | See [`test-strategy.md`](test-strategy.md) |
| **Test cases** | See [`test-cases.md`](test-cases.md)       |
| **Defects**    | See [`defects.md`](defects.md)             |

## 1. Features and priorities

| Feature                           | Priority        | Test cases                                            | Spec files                                                                        |
| --------------------------------- | --------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| Authentication and sessions       | Critical        | 11 (TC-AUTH-01 to 09, with 3 data sets in TC-AUTH-02) | `auth/login.cy.ts`, `auth/session.cy.ts`                                          |
| PIM · Employees                   | Critical        | 11 (TC-PIM-01 to 11)                                  | `pim/add-employee.cy.ts`, `pim/employee-list.cy.ts`, `pim/personal-details.cy.ts` |
| Admin · System users and roles    | Critical / High | 10 (TC-ADM-01 to 10)                                  | `admin/system-users.cy.ts`, `admin/user-roles.cy.ts`                              |
| Leave · Requests across two roles | Critical / High | 4 (TC-LV-01 to 04)                                    | `leave/leave-requests.cy.ts`                                                      |
| Network · Simulated API responses | Medium / High   | 4 (TC-NET-01 to 04)                                   | `network/employee-list-network.cy.ts`                                             |

**Total:** 40 tests, run in 3 browsers: 120 test runs per CI run.

## 2. Approach per feature

| Feature        | How it is tested                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Authentication | UI only. Data-driven invalid logins from a fixture. Logout and protected pages with a fresh login, so the cached session stays valid.                                    |
| PIM            | Employees are created through the API for search, edit and delete; the add-employee tests use the UI and confirm through the API.                                        |
| Admin          | Users are created in the UI and confirmed in the API, or created through the API to test validation, roles and disabled accounts. Role tests log in as the new ESS user. |
| Leave          | `cy.createEssWithLeave()` prepares an employee, an ESS user, a leave type and 10 days of leave. The ESS user applies and the admin decides, each with their own session. |
| Network        | `cy.intercept` replaces the employee list with a fixture, an empty list, a delayed answer or a 500 error.                                                                |

## 3. Schedule

| Phase | Content                                                | Status  |
| ----- | ------------------------------------------------------ | ------- |
| 1     | Framework core, authentication, PIM add and search, CI | ✅ Done |
| 2     | System users, access by role, personal details         | ✅ Done |
| 3     | Leave across two roles, network tests                  | ✅ Done |
| 4     | Published report, test strategy and test plan          | ✅ Done |

## 4. Deliverables

- The automated suite in `cypress/`.
- Test cases, defect reports, this plan and the test strategy in `docs/`.
- Mochawesome reports for Chrome, Firefox and Edge on GitHub Pages.

## 5. Running the tests

```bash
npm install
npx cypress run --browser chrome   # every test
npm run test:leave                 # one area
```

In CI the suite runs on every push to `main`, on pull requests, and on demand with **Run workflow**.

## 6. Risks

| Risk                                                            | Impact                          | Mitigation                                                                            |
| --------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| The shared demo is down or slow                                 | Runs fail without a real defect | CI waits up to 3 minutes for the demo; retries; tests can be re-run                   |
| The demo's data or settings change (leave periods, date format) | Leave tests could fail          | Leave periods are read from the API, and the date format from the field's placeholder |
| The demo is upgraded and selectors change                       | UI tests fail                   | Selectors live in Page Objects and shared components, so they change in one place     |
