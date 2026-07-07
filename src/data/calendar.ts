export const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;
export const LEADING_BLANKS = 2;
export const DAYS_IN_MONTH = 30;
export const TODAY = 15;

// ---- Global Mock Dates cho UI ----
export const CURRENT_YEAR = 2026;
export const CURRENT_MONTH_NUM = 7;
export const CURRENT_MONTH_STR = "Tháng 7 - 2026";
export const CURRENT_MONTH_SHORT = "Tháng 7, 2026";
export const CURRENT_DATE_ISO = "2026-07-07";


export function getWeekdays() { return WEEKDAYS; }
