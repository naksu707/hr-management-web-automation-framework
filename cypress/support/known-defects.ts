/**
 * BUG-001: OrangeHRM does not handle requests that fail or are cancelled. When a page
 * is left while it is loading, or a widget gets a 401/403, the app reads data from
 * an undefined response and throws an unhandled promise rejection.
 *
 * Only that exact pattern is ignored, and every time it happens it is written to the
 * command log. Synchronous errors, and any other rejection, still fail the test.
 */
const BUG_001 =
  /Cannot read properties of undefined|can't access property "[^"]+", [\w.]+ is undefined/;

export function isBug001(error: Error, promise?: Promise<unknown>): boolean {
  return Boolean(promise) && error.name === "TypeError" && BUG_001.test(error.message);
}

export function ignoreBug001(): void {
  Cypress.on("uncaught:exception", (error, _runnable, promise) => {
    if (isBug001(error, promise)) {
      Cypress.log({ name: "BUG-001", message: error.message });
      return false;
    }
    return true;
  });
}
