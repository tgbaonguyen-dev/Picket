export interface SubSuggestion { name: string; icon: string; price: number; }
export const SUB_SUGGESTIONS: SubSuggestion[] = [
  { name: "Netflix", icon: "🎬", price: 260000 },
  { name: "Spotify", icon: "🎵", price: 149000 },
  { name: "YouTube Premium", icon: "▶️", price: 79000 },
  { name: "iCloud+", icon: "☁️", price: 59000 },
  { name: "ChatGPT Plus", icon: "🤖", price: 520000 },
  { name: "Apple Music", icon: "🎶", price: 65000 },
  { name: "Notion", icon: "📝", price: 240000 },
  { name: "Figma", icon: "🎨", price: 360000 },
];

export const RECURRENCE_CYCLES = [
  { id: "monthly", label: "Hàng tháng" },
  { id: "yearly", label: "Hàng năm" },
  { id: "weekly", label: "Hàng tuần" },
] as const;


export function getSubSuggestions() { return SUB_SUGGESTIONS; }
export function getRecurrenceCycles() { return RECURRENCE_CYCLES; }
