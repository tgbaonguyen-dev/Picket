import type { Item } from "@/types";

export const ITEM_CATEGORIES = ["Tất cả", "Công nghệ", "Gia dụng", "Nội thất", "Xe cộ"];

export const ITEMS: Item[] = [
  { id: "macbook", name: "MacBook Pro M3", category: "Công nghệ", price: 45000000, date: "15/01/2026", img: "💻", warranty: "Còn 6 tháng" },
  { id: "ps5", name: "PlayStation 5", category: "Công nghệ", price: 12500000, date: "10/11/2025", img: "🎮", warranty: "Sắp hết hạn" },
  { id: "sofa", name: "Sofa L-Shape", category: "Nội thất", price: 18000000, date: "05/03/2026", img: "🛋️", warranty: "Còn 2 năm" },
  { id: "fridge", name: "Tủ lạnh Samsung", category: "Gia dụng", price: 21000000, date: "20/12/2025", img: "🧊", warranty: "Còn 1.5 năm" },
  { id: "vision", name: "Apple Vision Pro", category: "Công nghệ", price: 85000000, date: "01/06/2026", img: "🥽", warranty: "Còn 11 tháng", returnBy: "Còn 7 ngày" },
  { id: "bike", name: "Xe đạp Trek", category: "Xe cộ", price: 15000000, date: "10/04/2026", img: "🚲", warranty: "Hết hạn" },
];

// Điểm nối API: thay thân hàm bằng fetch() khi có backend.
export function getItems(): Item[] {
  return ITEMS;
}

export function findItem(id: string): Item | undefined {
  return ITEMS.find((i) => i.id === id);
}
