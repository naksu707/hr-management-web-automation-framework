# Test cases

Test cases automated against the public [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/).

**Priority:** Critical · High · Medium  
**Type:** UI (browser only) · UI + API (the API sets up data or confirms the result)

## Authentication

| ID         | Title                                                                                                                                      | Priority | Type            | Spec                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------- | -------------------- |
| TC-AUTH-01 | Valid admin credentials open the dashboard                                                                                                 | Critical | UI              | `auth/login.cy.ts`   |
| TC-AUTH-02 | Invalid credentials are rejected with "Invalid credentials" (3 data sets: wrong password, unknown username, wrong case and wrong password) | Critical | UI, data-driven | `auth/login.cy.ts`   |
| TC-AUTH-03 | Empty username and password show "Required" on both fields                                                                                 | Medium   | UI              | `auth/login.cy.ts`   |
| TC-AUTH-04 | An empty password shows "Required"                                                                                                         | Medium   | UI              | `auth/login.cy.ts`   |
| TC-AUTH-05 | The password is hidden while it is typed                                                                                                   | High     | UI              | `auth/login.cy.ts`   |
| TC-AUTH-06 | A visitor without a session is sent to the login page                                                                                      | Critical | UI              | `auth/session.cy.ts` |
| TC-AUTH-07 | Logout closes access to protected pages (finds BUG-001)                                                                                    | Critical | UI              | `auth/session.cy.ts` |
| TC-AUTH-08 | A cached admin session opens protected pages directly                                                                                      | High     | UI              | `auth/session.cy.ts` |
| TC-AUTH-09 | "Forgot your password?" opens the reset password page                                                                                      | Medium   | UI              | `auth/session.cy.ts` |

### Example: TC-AUTH-07

| Step | Action                                   | Expected result                                  |
| ---- | ---------------------------------------- | ------------------------------------------------ |
| 1    | Log in as Admin                          | The dashboard opens                              |
| 2    | Open the user menu and select **Logout** | The login page opens                             |
| 3    | Open the dashboard URL directly          | The app sends the visitor back to the login page |

## PIM · Employees

| ID        | Title                                                                                                                      | Priority | Type     | Spec                         |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | -------- | -------- | ---------------------------- |
| TC-PIM-01 | Adding an employee saves them, opens their personal details, and the API returns them                                      | Critical | UI + API | `pim/add-employee.cy.ts`     |
| TC-PIM-02 | An employee with a middle name appears in the list with their full name                                                    | High     | UI       | `pim/add-employee.cy.ts`     |
| TC-PIM-03 | First and last name are required, and nothing is sent to the API                                                           | High     | UI       | `pim/add-employee.cy.ts`     |
| TC-PIM-04 | An employee ID that is already taken shows "Employee Id already exists"                                                    | High     | UI + API | `pim/add-employee.cy.ts`     |
| TC-PIM-05 | An employee created through the API is found by ID                                                                         | High     | UI + API | `pim/employee-list.cy.ts`    |
| TC-PIM-06 | An employee is found by name with the autocomplete                                                                         | Medium   | UI + API | `pim/employee-list.cy.ts`    |
| TC-PIM-07 | Searching for an unused ID shows "No Records Found"                                                                        | Medium   | UI       | `pim/employee-list.cy.ts`    |
| TC-PIM-08 | Deleting an employee from the list removes them, and the API confirms it                                                   | Critical | UI + API | `pim/employee-list.cy.ts`    |
| TC-PIM-09 | Editing the employee's name saves it, the API returns the new name, and the header shows it after a reload (finds BUG-002) | High     | UI + API | `pim/personal-details.cy.ts` |
| TC-PIM-10 | The driver's license number is kept after a reload                                                                         | Medium   | UI + API | `pim/personal-details.cy.ts` |
| TC-PIM-11 | A cleared first name shows "Required", and nothing is sent to the API                                                      | Medium   | UI + API | `pim/personal-details.cy.ts` |

### Example: TC-PIM-08

| Step | Action                                                | Expected result                              |
| ---- | ----------------------------------------------------- | -------------------------------------------- |
| 1    | Create an employee through the API                    | The API answers 200 with the new `empNumber` |
| 2    | Search the list by the employee's ID                  | One row is shown                             |
| 3    | Click the trash icon and confirm with **Yes, Delete** | "Successfully Deleted" is shown              |
| 4    | Search for the employee through the API               | No employee is returned                      |

## Admin · System users and roles

| ID        | Title                                                                                                           | Priority | Type     | Spec                       |
| --------- | --------------------------------------------------------------------------------------------------------------- | -------- | -------- | -------------------------- |
| TC-ADM-01 | Creating an ESS user for an employee shows them in the list, and the API confirms the role, status and employee | Critical | UI + API | `admin/system-users.cy.ts` |
| TC-ADM-02 | A username that is already taken shows "Already exists"                                                         | High     | UI + API | `admin/system-users.cy.ts` |
| TC-ADM-03 | A username shorter than 5 characters is rejected                                                                | Medium   | UI       | `admin/system-users.cy.ts` |
| TC-ADM-04 | A confirmation that does not match the password shows "Passwords do not match"                                  | High     | UI       | `admin/system-users.cy.ts` |
| TC-ADM-05 | Every required field is checked, and nothing is sent to the API                                                 | Medium   | UI       | `admin/system-users.cy.ts` |
| TC-ADM-06 | Deleting a system user from the list removes them, and the API confirms it                                      | High     | UI + API | `admin/system-users.cy.ts` |
| TC-ADM-07 | An admin sees the Admin and PIM menus                                                                           | Critical | UI       | `admin/user-roles.cy.ts`   |
| TC-ADM-08 | An ESS user logs in and does not see the Admin or PIM menus                                                     | Critical | UI + API | `admin/user-roles.cy.ts`   |
| TC-ADM-09 | An ESS user cannot open the list of system users                                                                | Critical | UI + API | `admin/user-roles.cy.ts`   |
| TC-ADM-10 | A disabled user cannot log in and sees "Account disabled"                                                       | Critical | UI + API | `admin/user-roles.cy.ts`   |

### Example: TC-ADM-08

| Step | Action                                                                        | Expected result                                     |
| ---- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| 1    | As admin, create an employee and an enabled ESS user for them through the API | The API answers 200 for both                        |
| 2    | Log in with the new user                                                      | The dashboard opens                                 |
| 3    | Look at the main menu                                                         | **My Info** is shown; **Admin** and **PIM** are not |

## Test data

- Every employee gets unique names and a unique 9-digit ID, built in `cypress/support/data/employees.ts`.
- Employees and system users created by a test are deleted through the API after the test, even when it fails. The clean-up runs as admin, because a test may end logged in as an ESS user.
- System users get a unique username and a password that meets the demo's rules (`cypress/support/data/users.ts`).
- Invalid login data lives in `cypress/fixtures/invalid-logins.json`.
