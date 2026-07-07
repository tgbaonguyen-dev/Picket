import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { useState } from "react";
import { Check, Camera, Image as ImageIcon, Receipt, MapPin, Tag, ShieldCheck, Link2, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { FadeInUp } from "@/components/ui/animations";

export const Route = createFileRoute("/items/new")({
  component: NewItem,
});

const ITEM_CATEGORIES = ["Công nghệ", "Gia dụng", "Nội thất", "Xe cộ", "Khác"];

function NewItem() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("Công nghệ");
  const [date, setDate] = useState("2026-07-06");
  const [warranty, setWarranty] = useState(12);

  return (
    <PhoneFrame
      title="Thêm tài sản"
      subtitle="Ghi nhận món đồ mới"
      right={
        <button
          type="button"
          onClick={() => navigate({ to: "/items" })}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm backdrop-blur-md transition-transform active:scale-95"
        >
          <Check className="h-4 w-4 text-foreground/70" />
        </button>
      }
    >
      <div className="space-y-5 px-5 pb-8 pt-2">
        {/* Image Upload Area */}
        <FadeInUp className="relative overflow-hidden rounded-3xl bg-white/70 p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-col items-center justify-center gap-3 py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 text-foreground/40">
              <Camera className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">Thêm ảnh tài sản</p>
              <p className="mt-1 text-[11px] font-medium text-foreground/50">Chụp ảnh hoặc chọn từ thư viện</p>
            </div>
            <div className="mt-2 flex gap-2">
              <button className="flex items-center gap-1.5 rounded-xl bg-foreground/5 px-4 py-2 text-[12px] font-bold text-foreground/70 transition-colors active:bg-foreground/10">
                <Camera className="h-3.5 w-3.5" /> Chụp
              </button>
              <button className="flex items-center gap-1.5 rounded-xl bg-foreground/5 px-4 py-2 text-[12px] font-bold text-foreground/70 transition-colors active:bg-foreground/10">
                <ImageIcon className="h-3.5 w-3.5" /> Chọn ảnh
              </button>
            </div>
          </div>
        </FadeInUp>

        {/* Basic Info */}
        <FadeInUp 
          delay={0.05}
          className="space-y-4 rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md"
        >
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Tên món đồ</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="VD: MacBook Pro M3"
              className="mt-1.5 w-full bg-transparent text-lg font-bold text-foreground placeholder:text-foreground/30 focus:outline-none"
            />
          </div>
          
          <div className="h-px w-full bg-foreground/5" />
          
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Giá mua (₫)</label>
            <input
              inputMode="numeric"
              value={price ? price.toLocaleString("vi-VN") : ""}
              onChange={e => setPrice(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
              placeholder="0"
              className="mt-1.5 w-full bg-transparent text-3xl font-bold tabular-nums text-foreground placeholder:text-foreground/20 focus:outline-none"
            />
          </div>
        </FadeInUp>

        {/* Category */}
        <FadeInUp 
          delay={0.1}
          className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-foreground/40">
            <Tag className="h-4 w-4" /> Danh mục
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {ITEM_CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-xl px-3.5 py-1.5 text-[12px] font-bold transition-all active:scale-95 ${category === c ? "bg-foreground text-background shadow-sm" : "bg-white/50 text-foreground/60 shadow-sm"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </FadeInUp>

        {/* Details Grid */}
        <FadeInUp 
          delay={0.15}
          className="grid grid-cols-2 gap-2"
        >
          <div className="space-y-1.5 rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground/40">
              <CalendarDays className="h-3.5 w-3.5" /> Ngày mua
            </div>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-foreground focus:outline-none"
            />
          </div>
          
          <div className="space-y-1.5 rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground/40">
              <ShieldCheck className="h-3.5 w-3.5" /> Bảo hành (Tháng)
            </div>
            <input
              type="number"
              value={warranty}
              onChange={e => setWarranty(Number(e.target.value))}
              className="w-full bg-transparent text-sm font-bold tabular-nums text-foreground focus:outline-none"
            />
          </div>
        </FadeInUp>

        {/* Optional Info */}
        <FadeInUp 
          delay={0.2}
          className="space-y-2"
        >
          <button className="flex w-full items-center justify-between rounded-3xl bg-white/70 p-4 text-left shadow-sm backdrop-blur-md active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-500">
                <Receipt className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[13px] font-bold">Hoá đơn / Biên lai</p>
                <p className="text-[11px] font-medium text-foreground/50">Chưa đính kèm</p>
              </div>
            </div>
          </button>

          <button className="flex w-full items-center justify-between rounded-3xl bg-white/70 p-4 text-left shadow-sm backdrop-blur-md active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-500">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[13px] font-bold">Nơi mua</p>
                <p className="text-[11px] font-medium text-foreground/50">Apple Store</p>
              </div>
            </div>
          </button>
          
          <button className="flex w-full items-center justify-between rounded-3xl bg-white/70 p-4 text-left shadow-sm backdrop-blur-md active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-100 text-purple-500">
                <Link2 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[13px] font-bold">Link sản phẩm</p>
                <p className="text-[11px] font-medium text-foreground/50">apple.com</p>
              </div>
            </div>
          </button>
        </FadeInUp>

        <FadeInUp 
          delay={0.25}
          className="pt-2"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/items" })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-sm font-bold text-background shadow-lg shadow-black/20 transition-transform active:scale-[0.98]"
          >
            Lưu tài sản
          </button>
        </FadeInUp>
      </div>
    </PhoneFrame>
  );
}
