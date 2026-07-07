import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Plus, ChevronLeft, ChevronRight, Calendar, List } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeInUp, PopIn } from "@/components/ui/animations";

export const Route = createFileRoute("/bills/")({ component: BillsCalendar });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

import { getBills } from "@/data";

function BillsCalendar() {
  const [tab, setTab] = useState<"cal" | "list">("cal");
  const year = 2026;
  const month = 6; // July (0-indexed)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const bills = getBills();
  const total = bills.reduce((s, b) => s + b.amount, 0);

  return (
    <PhoneFrame 
      title="Hoá đơn" 
      subtitle="Tháng 7, 2026" 
      right={
        <Link 
          to="/bills/new" 
          aria-label="Thêm hoá đơn" 
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg shadow-black/10 transition-transform active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </Link>
      }
    >
      <div className="space-y-6 px-5 pb-8">
        
        {/* Type Toggle */}
        <div className="flex gap-1 rounded-2xl bg-white/50 p-1.5 shadow-sm backdrop-blur-md">
          <Link to="/bills" className="flex-1 rounded-xl bg-white py-2.5 text-center text-[13px] font-semibold text-foreground shadow-sm">
            Hoá đơn cố định
          </Link>
          <Link to="/bills/subscriptions" className="flex-1 rounded-xl py-2.5 text-center text-[13px] font-medium text-foreground/50 transition-colors active:bg-white/40">
            Subscriptions
          </Link>
        </div>

        {/* Hero Summary Card */}
        <PopIn className="relative rounded-3xl shadow-xl shadow-[#8F5F68]/20">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#8F5F68] to-[#D5A3A0] p-6 text-white overflow-hidden">
            {/* Decorative blobs — clipped by this inner container */}
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
          
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-90">Tổng cần trả tháng này</p>
              <p className="mt-1 text-4xl font-bold tracking-tight">{fmt(total)}</p>
            
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-3 py-1.5 text-[11px] font-medium backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Số dư an toàn: {fmt(4200000)}
              </div>
            </div>
          </div>
        </PopIn>

        {/* View Toggle */}
        <div className="flex gap-2 rounded-2xl bg-white/40 p-1.5 backdrop-blur-sm">
          <button 
            onClick={() => setTab("cal")} 
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-medium transition-all ${tab === "cal" ? "bg-white text-foreground shadow-sm" : "text-foreground/50 active:bg-white/30"}`}
          >
            <Calendar className="h-4 w-4" /> Lịch
          </button>
          <button 
            onClick={() => setTab("list")} 
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-medium transition-all ${tab === "list" ? "bg-white text-foreground shadow-sm" : "text-foreground/50 active:bg-white/30"}`}
          >
            <List className="h-4 w-4" /> Danh sách
          </button>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {tab === "cal" && (
            <motion.div 
              key="cal"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md"
            >
              <div className="mb-4 flex items-center justify-between px-2">
                <button className="rounded-full bg-foreground/5 p-2 text-foreground/70 transition-colors active:bg-foreground/10">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-[13px] font-bold tracking-wide">Tháng 7, 2026</span>
                <button className="rounded-full bg-foreground/5 p-2 text-foreground/70 transition-colors active:bg-foreground/10">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => <div key={d} className="py-2">{d}</div>)}
              </div>
              
              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {Array.from({ length: firstDow }).map((_, i) => (
                  <div key={`blank-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const bill = bills.find(b => b.day === day);
                  
                  return (
                    <div 
                      key={day} 
                      className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl transition-transform active:scale-95 ${
                        bill 
                          ? bill.status === "paid" 
                            ? "bg-green-100/70 text-green-700" 
                            : bill.status === "due" 
                              ? "bg-red-100/80 text-red-700 shadow-sm shadow-red-200/50" 
                              : "bg-orange-50 text-orange-700" 
                          : "bg-white/40 text-foreground/60 hover:bg-white"
                      }`}
                    >
                      <span className={`text-[13px] ${bill ? "font-bold" : "font-medium"}`}>{day}</span>
                      {bill && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1.5 text-[11px] drop-shadow-sm"
                        >
                          {bill.icon}
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === "list" && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Optional: we can put something here if needed, but the list below is shared anyway or we can keep the list only shown when 'list' is selected. Wait, the original code showed the list below the calendar ALWAYS. Let's keep it below always, and tab 'list' just hides the calendar. */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shared List (Always visible or only in list mode? Let's make it always visible below, but maybe hide Calendar if 'list' is active) */}
        <motion.div layout className="pt-2">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-foreground/50">Danh sách hoá đơn</h2>
          </div>
          <div className="space-y-3">
            {bills.map((b, i) => (
              <FadeInUp
                key={b.id}
                delay={i * 0.05}
              >
                <Link 
                  to="/bills/$id" 
                  params={{ id: b.id }} 
                  className="flex items-center justify-between rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <span className="text-2xl">{b.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{b.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-foreground/50">
                        Ngày {b.day}/7 
                        <span className="h-1 w-1 rounded-full bg-foreground/20" />
                        <span className={
                          b.status === "due" ? "text-red-500 font-bold" 
                          : b.status === "paid" ? "text-green-600 font-bold" 
                          : ""
                        }>
                          {b.status === "paid" ? "Đã trả" : b.status === "due" ? "Đến hạn ngay!" : "Sắp tới"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold tabular-nums text-foreground">{fmt(b.amount)}</p>
                </Link>
              </FadeInUp>
            ))}
          </div>
        </motion.div>

      </div>
    </PhoneFrame>
  );
}