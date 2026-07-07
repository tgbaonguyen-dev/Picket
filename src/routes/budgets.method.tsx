import { FadeInUp } from "@/components/ui/animations";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/budgets/method")({ component: Method });

const methods = [
  { id: "simple", name: "Simple Limit", desc: "Đặt một hạn mức duy nhất cho mỗi danh mục.", ex: "Ăn uống 4tr/tháng", rec: true },
  { id: "envelope", name: "Envelope", desc: "Chia tiền vào các phong bì, chi hết là dừng.", ex: "Phong bì Đi chợ 3tr" },
  { id: "zero", name: "Zero-based", desc: "Mỗi đồng đều có mục đích, kết dư = 0.", ex: "Phân bổ 100% thu nhập" },
  { id: "503020", name: "50/30/20", desc: "50% nhu cầu, 30% mong muốn, 20% tiết kiệm.", ex: "Áp dụng theo tỷ lệ thu nhập" },
  { id: "event", name: "Event Budget", desc: "Ngân sách cho chuyến đi, đám cưới, dự án.", ex: "Du lịch Đà Nẵng 15tr" },
];

function Method() {
  return (
    <FadeInUp className="h-full flex flex-col w-full flex-1"><PhoneFrame title="Chọn phương pháp" subtitle="Ngân sách phù hợp bạn">
      <div className="space-y-3 px-5 pb-8">
        <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-4 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold"><Sparkles className="h-4 w-4" />Đề xuất cho bạn</div>
          <p className="mt-1 text-sm opacity-95">Dựa trên thu nhập ổn định hàng tháng, hãy thử <strong>Simple Limit</strong> để bắt đầu nhanh.</p>
        </div>

        {methods.map(m => (
          <Link key={m.id} to="/budgets/new" className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 active:scale-[0.97]">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{m.name}</p>
                {m.rec && <span className="rounded-full bg-[#FFE4D2] px-2 py-0.5 text-[10px] font-semibold text-[#8F5F68]">Đề xuất</span>}
              </div>
              <p className="mt-1 text-xs text-foreground/60">{m.desc}</p>
              <p className="mt-2 text-xs italic text-foreground/50">Ví dụ: {m.ex}</p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 text-foreground/40" />
          </Link>
        ))}

        <button className="w-full rounded-2xl border border-dashed border-foreground/20 py-3 text-sm font-medium text-foreground/60">So sánh các phương pháp</button>
      </div>
    </PhoneFrame></FadeInUp>
  );
}
