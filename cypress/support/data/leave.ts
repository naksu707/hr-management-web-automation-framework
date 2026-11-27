import { randomLetters } from "./employees";

export interface LeavePeriod {
  startDate: string;
  endDate: string;
}

/** The employee, ESS user and leave type a leave test needs, with leave days granted. */
export interface LeaveSetup {
  empNumber: number;
  employeeName: string;
  firstName: string;
  username: string;
  password: string;
  leaveTypeId: number;
  leaveTypeName: string;
  period: LeavePeriod;
}

/** A unique leave type name, so tests never touch the demo's own leave types. */
export function aLeaveTypeName(): string {
  return `CY Leave ${randomLetters(8)}`;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * A working day (Monday to Friday) at least a week ahead, inside the leave period.
 * Late December and New Year's Day are skipped, because they may be holidays.
 */
export function aFutureWorkingDay(period: LeavePeriod): string {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + 7);

  const isHoliday = (d: Date) =>
    (d.getUTCMonth() === 11 && d.getUTCDate() >= 24) ||
    (d.getUTCMonth() === 0 && d.getUTCDate() === 1);

  while (date.getUTCDay() === 0 || date.getUTCDay() === 6 || isHoliday(date)) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  const iso = toIsoDate(date);
  if (iso > period.endDate) {
    throw new Error(`No working day left in the leave period that ends on ${period.endDate}`);
  }
  return iso;
}
