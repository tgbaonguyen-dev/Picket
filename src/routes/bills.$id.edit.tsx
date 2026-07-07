import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { useState } from "react";
import { motion } from "framer-motion";
import { FadeInUp } from "@/components/ui/animations";
import { Wallet, Tag, RefreshCw, Zap, Trash2 } from "lucide-react";

export const Route = createFileRoute("/bills/$id/edit")({ component: EditBill });

function EditBill() {
  const { id } = useParams({ from: "/bills/$id/edit" });
  const [cadence, setCadence] = useState("monthly");
  const [isVarying, setIsVarying] = useState(true);
  const [autopay, setAutopay] = useState(false);

  return (
    <PhoneFrame title="Chỉnh sửa khoản định kỳ" subtitle={`ID: ${id}`}>
      <div className="space-y-5 px-5 pb-8 pt-2">
        
        {/* Amount & Name Card */}
        <FadeInUp 
          className="overflow-hidden rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md"
        >
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Tên khoản định kỳ</label>
              <input 
                defaultValue="Điện EVN" 
                className="mt-1.5 w-full bg-transparent text-lg font-semibold text-foreground focus:outline-none" 
              />
            </div>
            
            <div className="h-px w-full bg-foreground/5" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Số tiền</label>
                <div className="mt-1.5 flex items-baseline">
                  <span className="text-xl font-bold text-foreground/50">₫</span>
                  <input 
                    defaultValue="850000" 
                    inputMode="numeric" 
                    className="w-full bg-transparent text-3xl font-bold tabular-nums text-foreground focus:outline-none" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Ngày bắt đầu</label>
                <input 
                  type="date" 
                  defaultValue="2026-07-10"
                  className="mt-2.5 w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none" 
                />
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Frequency & Settings */}
        <FadeInUp 
          delay={0.05}
          className="space-y-2"
        >
          <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Số tiền thay đổi mỗi kỳ</p>
                <p className="text-[11px] font-medium text-foreground/50">Dành cho tiền điện, nước...</p>
              </div>
              <button 
                onClick={() => setIsVarying(!isVarying)}
                className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${isVarying ? "bg-[#8F5F68]" : "bg-foreground/10"}`}
              >
                <motion.div 
                  className="absolute h-5 w-5 rounded-full bg-white shadow-sm"
                  layout
                  animate={{ left: isVarying ? "22px" : "2px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
            
            <div className="my-4 h-px w-full bg-foreground/5" />
            
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-foreground/40">Lặp lại</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "weekly", label: "Tuần" },
                  { id: "monthly", label: "Tháng" },
                  { id: "quarterly", label: "Quý" },
                  { id: "yearly", label: "Năm" }
                ].map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setCadence(item.id)} 
                    className={`rounded-xl py-2 text-[12px] font-semibold transition-colors ${cadence === item.id ? "bg-[#8F5F68] text-white shadow-sm" : "bg-foreground/5 text-foreground/60 active:bg-foreground/10"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#8F5F68]/5 p-3 text-xs font-medium text-[#8F5F68]">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Đang lặp lại vào ngày 10 hàng tháng</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-between rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-md active:scale-[0.97] transition-transform">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Tài khoản</p>
                <p className="mt-1 text-sm font-semibold text-foreground">VCB *8899</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Wallet className="h-4 w-4" />
              </div>
            </button>
            <button className="flex items-center justify-between rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-md active:scale-[0.97] transition-transform">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Danh mục</p>
                <p className="mt-1 text-sm font-semibold text-foreground">Hóa đơn</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Tag className="h-4 w-4" />
              </div>
            </button>
          </div>

          <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Autopay</p>
                  <p className="text-[11px] font-medium text-foreground/50">Tự động ghi nhận khi đến hạn</p>
                </div>
              </div>
              <button 
                onClick={() => setAutopay(!autopay)}
                className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${autopay ? "bg-amber-400" : "bg-foreground/10"}`}
              >
                <motion.div 
                  className="absolute h-5 w-5 rounded-full bg-white shadow-sm"
                  layout
                  animate={{ left: autopay ? "22px" : "2px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </FadeInUp>

        <FadeInUp 
          delay={0.1}
          className="space-y-2 pt-2"
        >
          <Link 
            to="/bills/$id" 
            params={{ id }}
            className="flex w-full items-center justify-center rounded-2xl bg-foreground py-4 text-sm font-bold text-background shadow-lg transition-transform active:scale-[0.97]"
          >
            Lưu thay đổi
          </Link>
          
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50/50 py-4 text-sm font-bold text-red-600 transition-colors active:bg-red-50">
            <Trash2 className="h-4 w-4" />
            Xoá khoản định kỳ này
          </button>
        </FadeInUp>

      </div>
    </PhoneFrame>
  );
}
