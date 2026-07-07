import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Edit3, CalendarDays, ShieldCheck, Tag, Receipt, Link2, MapPin, Trash2, ArrowUpRight, TrendingDown } from "lucide-react";
import { PopIn, FadeInUp } from "@/components/ui/animations";

import { findItem } from "@/data/items";

export const Route = createFileRoute("/items/$id")({
  component: ItemDetail,
});

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function ItemDetail() {
  const { id } = useParams({ from: "/items/$id" });
  const item = findItem(id) || {
    name: "Tài sản không tìm thấy",
    category: "Chưa rõ",
    price: 0,
    img: "",
    warranty: "",
    date: ""
  };
  
  return (
    <PhoneFrame 
      title="Chi tiết tài sản" 
      subtitle={item.name}
      right={
        <Link 
          to="/items"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm backdrop-blur-md transition-transform active:scale-[0.97]"
        >
          <Edit3 className="h-4 w-4 text-foreground/70" />
        </Link>
      }
    >
      <div className="space-y-5 px-5 pb-8 pt-2">
        {/* Hero Card */}
        <PopIn className="relative overflow-hidden rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gray-100 text-7xl shadow-sm overflow-hidden">
              {item.img ? <img src={item.img} alt={item.name} className="h-full w-full object-cover" /> : null}
            </div>
            
            <div className="mt-5">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/60">
                <Tag className="h-3 w-3" /> {item.category}
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{item.name}</p>
              <p className="mt-1 text-3xl font-bold text-[#8F5F68]">{fmt(item.price)}</p>
            </div>
          </div>
        </PopIn>

        {/* Value Analysis */}
        <FadeInUp 
          delay={0.05}
          className="grid grid-cols-2 gap-2"
        >
          <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground/40">
              <TrendingDown className="h-3.5 w-3.5" /> Khấu hao
            </div>
            <p className="mt-2 text-xl font-bold tabular-nums text-foreground/50">{fmt(item.price * 0.85)}</p>
            <p className="mt-0.5 text-[11px] font-medium text-foreground/50">Giá trị ước tính hiện tại</p>
          </div>
          
          <div className="rounded-3xl bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600/60">
              <ShieldCheck className="h-3.5 w-3.5" /> Bảo hành
            </div>
            <p className="mt-2 text-xl font-bold tabular-nums text-emerald-600">{item.warranty}</p>
            <p className="mt-0.5 text-[11px] font-medium text-emerald-600/70">Theo thông tin gốc</p>
          </div>
        </FadeInUp>

        {/* Info List */}
        <FadeInUp 
          delay={0.1}
          className="space-y-4 rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground/60"><CalendarDays className="h-4 w-4" /> Ngày mua</div>
            <span className="text-sm font-bold">{item.date}</span>
          </div>
          <div className="h-px w-full bg-foreground/5" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground/60"><MapPin className="h-4 w-4" /> Nơi mua</div>
            <span className="text-sm font-bold">Apple Store</span>
          </div>
          <div className="h-px w-full bg-foreground/5" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-foreground/60"><Receipt className="h-4 w-4" /> Biên lai</div>
            <span className="text-sm font-bold text-blue-500 underline decoration-blue-500/30 underline-offset-2">Xem ảnh</span>
          </div>
        </FadeInUp>

        {/* Actions */}
        <FadeInUp 
          delay={0.15}
          className="grid grid-cols-2 gap-2 pt-2"
        >
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-[13px] font-bold text-background shadow-lg transition-transform active:scale-[0.97]">
            <ArrowUpRight className="h-4 w-4" /> Bán / Thanh lý
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-white/70 py-4 text-[13px] font-bold text-red-600 shadow-sm backdrop-blur-md transition-colors active:bg-red-50">
            <Trash2 className="h-4 w-4" /> Xoá tài sản
          </button>
        </FadeInUp>
      </div>
    </PhoneFrame>
  );
}
