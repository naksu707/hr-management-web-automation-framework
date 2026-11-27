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
| **Environment** | OrangeHRM public demo, Chrome 155 (headless), Cypress 15                          |
| **Found by**    | TC-AUTH-07                                                                        |

**Steps to reproduce**

1. Log in as `Admin` / `admin123`.
2. Open the user menu and select **Logout**.
3. Open `/web/index.php/dashboard/index` directly.

**Expected result:** the login page opens and the app handles any request that was cancelled by the logout.

**Actual result:** the login page opens, but the app's HTTP client throws an unhandled promise rejection:

```text
TypeError: Cannot read properties of undefined (reading 'response')
    at app.js
    at async ln.request (chunk-vendors.js)
```

The app's error handler reads `error.response` from an error that has no response, which happens when a request is cancelled or fails before the server answers.

**Impact:** low for users. It fills the browser console with errors, and it can hide real errors from monitoring tools.

**How the tests handle it:** TC-AUTH-07 ignores only this exact error message, so any other error in the app still fails the test.
