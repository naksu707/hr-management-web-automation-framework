import "cypress-mochawesome-reporter/register";
import "./commands";
import { cleanUpEmployees } from "./api/employees";

afterEach(() => {
  cleanUpEmployees();
});
