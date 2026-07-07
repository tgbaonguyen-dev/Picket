export const PREFS_KEY = "picket.prefs";

export interface CurrencyConfig { code: string; label: string; symbol: string }

export const CURRENCIES: CurrencyConfig[] = [
  { code: "VND", label: "Việt Nam Đồng", symbol: "₫" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "KRW", label: "Korean Won", symbol: "₩" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { code: "THB", label: "Thai Baht", symbol: "฿" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
];

export const TIMEZONES = [
  "Asia/Ho_Chi_Minh",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
  "UTC",
];

export interface LanguageConfig { code: string; label: string }

export const LANGUAGES: LanguageConfig[] = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
];

export const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "D MMM YYYY"] as const;


export function getCurrencies() { return CURRENCIES; }
export function getTimezones() { return TIMEZONES; }
export function getLanguages() { return LANGUAGES; }
export function getDateFormats() { return DATE_FORMATS; }
