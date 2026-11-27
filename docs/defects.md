# Defects

Defects found while automating the public [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/).

| ID      | Severity | Title                                                                | Status | Found by                                               |
| ------- | -------- | -------------------------------------------------------------------- | ------ | ------------------------------------------------------ |
| BUG-001 | Low      | The app does not handle requests that fail or are cancelled          | Open   | TC-AUTH-07, TC-PIM-02, TC-PIM-10, TC-ADM-08, TC-ADM-09 |
| BUG-002 | Low      | The employee's name in the header does not change after it is edited | Open   | TC-PIM-09                                              |

---

## BUG-001 · The app does not handle requests that fail or are cancelled

| Field           | Value                                                                             |
| --------------- | --------------------------------------------------------------------------------- |
| **Severity**    | Low: the user does not see an error, but the app throws errors it does not handle |
| **Area**        | Whole app: HTTP client, dashboard widgets, PIM pages                              |
| **Environment** | OrangeHRM public demo, Chrome 155, Firefox 161 and Edge (headless), Cypress 15    |
| **Found by**    | TC-AUTH-07, TC-PIM-02, TC-PIM-10, TC-ADM-08, TC-ADM-09                            |

**Steps to reproduce (one of the cases)**

1. Log in as `Admin` / `admin123`.
2. Open the user menu and select **Logout**.
3. Open `/web/index.php/dashboard/index` directly.

**Expected result:** the login page opens, and the app handles the requests that fail because there is no session.

**Actual result:** the login page opens, but the app throws unhandled promise rejections. The same happens in other situations:

| Situation                                        | Browser          | Error                                                                         |
| ------------------------------------------------ | ---------------- | ----------------------------------------------------------------------------- |
| Opening a page after logout                      | Chrome 155, Edge | `Cannot read properties of undefined (reading 'response')` in the HTTP client |
| Opening a page after logout                      | Firefox 161      | `can't access property "map", t is undefined` in a component's `beforeMount`  |
| Leaving the personal details page while it loads | Firefox 161      | `can't access property "firstName", e.data is undefined`                      |
| Leaving the personal details page while it loads | Firefox 161      | `can't access property "fields", o is undefined`                              |
| An ESS user's dashboard loads its widgets        | Firefox 161      | `can't access property "map", t is undefined` in `fetchWidgetData`            |

The app reads data from responses that failed or were cancelled without checking that the data exists.

**Impact:** low for users. It fills the browser console with errors, and it can hide real errors from monitoring tools.

**How the tests handle it:** `cypress/support/known-defects.ts` ignores only unhandled promise rejections that are a `TypeError` reading a property of `undefined`, and writes each one to the Cypress command log as `BUG-001`. Synchronous errors, and any other rejection, still fail the test.

---

## BUG-002 · The employee's name in the header does not change after it is edited

| Field           | Value                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| **Severity**    | Low: the data is saved, but the page shows the old name                  |
| **Area**        | PIM · Personal details                                                   |
| **Environment** | OrangeHRM public demo, Chrome 155 and Firefox 161 (headless), Cypress 15 |
| **Found by**    | TC-PIM-09                                                                |

**Steps to reproduce**

1. Log in as `Admin` / `admin123`.
2. Open **PIM** and an employee's **Personal Details**.
3. Change the first name and the last name, and click **Save**.

**Expected result:** "Successfully Updated" is shown, and the name above the employee's photo changes to the new name.

**Actual result:** "Successfully Updated" is shown and the API returns the new name, but the name above the photo keeps the old name until the page is reloaded.

**Impact:** low. The user may think the change was not saved and edit the employee again.

**How the tests handle it:** TC-PIM-09 checks the new name through the API, then reloads the page and checks the header.
