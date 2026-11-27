export interface Employee {
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeId: string;
}

export interface CreatedEmployee extends Employee {
  empNumber: number;
}

const FIRST_NAMES = ["Ada", "Grace", "Alan", "Katherine", "Linus", "Margaret", "Dennis", "Radia"];

export function randomLetters(length: number): string {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }
  return result;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** A 9-digit ID: OrangeHRM accepts up to 10 characters. */
export function uniqueEmployeeId(): string {
  const time = String(Date.now()).slice(-7);
  const random = String(Math.floor(Math.random() * 100)).padStart(2, "0");
  return `${time}${random}`;
}

/** An employee with unique names and ID, so tests never clash on the shared demo. */
export function anEmployee(overrides: Partial<Employee> = {}): Employee {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  return {
    firstName: `${firstName}${capitalize(randomLetters(5))}`,
    lastName: `Cy${capitalize(randomLetters(8))}`,
    employeeId: uniqueEmployeeId(),
    ...overrides,
  };
}

export function fullName(employee: Employee): string {
  return [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(" ");
}
