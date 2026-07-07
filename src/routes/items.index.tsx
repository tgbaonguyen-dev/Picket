import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Plus, Search, Filter, Box } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/items/")({
  component: ItemsIndex,
});

const ITEM_CATEGORIES = ["Tất cả", "Công nghệ", "Gia dụng", "Nội thất", "Xe cộ"];

const ITEMS = [
  { id: "macbook", name: "MacBook Pro M3", category: "Công nghệ", price: 45000000, date: "15/01/2026", img: "💻", warranty: "Còn 6 tháng" },
  { id: "ps5", name: "PlayStation 5", category: "Công nghệ", price: 12500000, date: "10/11/2025", img: "🎮", warranty: "Còn 4 tháng" },
  { id: "sofa", name: "Sofa L-Shape", category: "Nội thất", price: 18000000, date: "05/03/2026", img: "🛋️", warranty: "Còn 2 năm" },
  { id: "fridge", name: "Tủ lạnh Samsung", category: "Gia dụng", price: 21000000, date: "20/12/2025", img: "🧊", warranty: "Còn 1.5 năm" },
  { id: "vision", name: "Apple Vision Pro", category: "Công nghệ", price: 85000000, date: "01/06/2026", img: "🥽", warranty: "Còn 11 tháng" },
  { id: "bike", name: "Xe đạp Trek", category: "Xe cộ", price: 15000000, date: "10/04/2026", img: "🚲", warranty: "Hết hạn" },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function ItemsIndex() {
  const [activeCat, setActiveCat] = useState("Tất cả");
  const [search, setSearch] = useState("");

  const filtered = ITEMS.filter(item => {
    const matchCat = activeCat === "Tất cả" || item.category === activeCat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PhoneFrame
      title="Tài sản"
      subtitle="Quản lý món đồ giá trị"
      right={
        <Link
          to="/items/new"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg shadow-black/10 transition-transform active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </Link>
      }
    >
      <div className="space-y-5 px-5 pb-8 pt-2">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tài sản..."
            className="w-full rounded-2xl bg-white/70 py-3.5 pl-11 pr-4 text-[13px] font-medium shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#8F5F68]/50 transition-all placeholder:text-foreground/40"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar -mx-2 px-2">
          {ITEM_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-[12px] font-bold transition-all active:scale-95 ${
                activeCat === cat 
                  ? "bg-foreground text-background shadow-md shadow-black/10" 
                  : "bg-white/50 text-foreground/60 shadow-sm backdrop-blur-md"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid (using CSS columns) */}
        {filtered.length > 0 ? (
          <motion.div layout className="columns-2 gap-3 space-y-3 pt-2">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="break-inside-avoid"
                >
                  <Link
                    to="/items/$id"
                    params={{ id: item.id }}
                    className="block overflow-hidden rounded-3xl bg-white/70 shadow-sm backdrop-blur-md transition-transform active:scale-[0.97]"
                  >
                    <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-6xl">
                      {item.img}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">{item.category}</p>
                      <p className="mt-0.5 text-sm font-bold leading-tight">{item.name}</p>
                      <p className="mt-2 text-[13px] font-bold text-[#8F5F68]">{fmt(item.price)}</p>
                      
                      <div className="mt-2.5 inline-flex items-center gap-1 rounded-lg bg-black/5 px-2 py-1 text-[9px] font-bold uppercase text-foreground/60">
                        {item.warranty === "Hết hạn" ? (
                          <span className="text-red-500">Hết bảo hành</span>
                        ) : (
                          <span className="text-emerald-600">{item.warranty}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/50 shadow-sm backdrop-blur-md">
              <Box className="h-8 w-8 text-foreground/30" />
            </div>
            <p className="mt-4 text-sm font-bold">Không tìm thấy tài sản</p>
            <p className="mt-1 text-xs text-foreground/50">Thử tìm kiếm với từ khoá khác xem sao.</p>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
