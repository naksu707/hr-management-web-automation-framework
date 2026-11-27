# Defects

Defects found while automating the public [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/).

| ID      | Severity | Title                                                        | Status | Found by   |
| ------- | -------- | ------------------------------------------------------------ | ------ | ---------- |
| BUG-001 | Low      | Logging out causes an unhandled promise rejection in the app | Open   | TC-AUTH-07 |

---

## BUG-001 · Logging out causes an unhandled promise rejection in the app

| Field           | Value                                                                             |
| --------------- | --------------------------------------------------------------------------------- |
| **Severity**    | Low: the user does not see an error, but the app fails without handling the error |
| **Area**        | Authentication · Logout                                                           |
| **Environment** | OrangeHRM public demo, Chrome 155, Firefox 161 and Edge (headless), Cypress 15    |
| **Found by**    | TC-AUTH-07                                                                        |

**Steps to reproduce**

1. Log in as `Admin` / `admin123`.
2. Open the user menu and select **Logout**.
3. Open `/web/index.php/dashboard/index` directly.

**Expected result:** the login page opens, and the app handles the requests that fail because there is no session.

**Actual result:** the login page opens, but the app throws unhandled promise rejections. The message changes by browser and by the page that was loading:

| Browser          | Error                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Chrome 155, Edge | `TypeError: Cannot read properties of undefined (reading 'response')` in the HTTP client |
| Firefox 161      | `can't access property "response", e is undefined` in the HTTP client                    |
| Firefox 161      | `can't access property "map", t is undefined` in a component's `beforeMount`             |

The app reads data from requests that failed or were cancelled without checking that the data exists.

**Impact:** low for users. It fills the browser console with errors, and it can hide real errors from monitoring tools.

**How the tests handle it:** after the logout, TC-AUTH-07 ignores unhandled promise rejections only. Any other error in the app still fails the test, and the rest of the suite fails on every uncaught error.
