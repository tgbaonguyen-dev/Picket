import type { Item } from "@/types";

export const ITEM_CATEGORIES = ["Tất cả", "Công nghệ", "Gia dụng", "Nội thất", "Xe cộ"];

export const ITEMS: Item[] = [
  { id: "macbook", name: "MacBook Pro M3", category: "Công nghệ", price: 45000000, date: "15/01/2026", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80&fit=crop", warranty: "Còn 6 tháng" },
  { id: "ps5", name: "PlayStation 5", category: "Công nghệ", price: 12500000, date: "10/11/2025", img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80&fit=crop", warranty: "Sắp hết hạn" },
  { id: "sofa", name: "Sofa L-Shape", category: "Nội thất", price: 18000000, date: "05/03/2026", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&fit=crop", warranty: "Còn 2 năm" },
  { id: "fridge", name: "Tủ lạnh Samsung", category: "Gia dụng", price: 21000000, date: "20/12/2025", img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80&fit=crop", warranty: "Còn 1.5 năm" },
  { id: "vision", name: "Apple Vision Pro", category: "Công nghệ", price: 85000000, date: "01/06/2026", img: "https://images.unsplash.com/photo-1707328123512-320e8b28a2a7?w=800&q=80&fit=crop", warranty: "Còn 11 tháng", returnBy: "Còn 7 ngày" },
  { id: "bike", name: "Xe đạp Trek", category: "Xe cộ", price: 15000000, date: "10/04/2026", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80&fit=crop", warranty: "Hết hạn" },
];

// Điểm nối API: thay thân hàm bằng fetch() khi có backend.
export function getItems(): Item[] {
  return ITEMS;
}

export function findItem(id: string): Item | undefined {
  return ITEMS.find((i) => i.id === id);
}
