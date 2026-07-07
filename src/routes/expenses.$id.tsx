import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { TRANSACTIONS, formatVND } from "@/lib/mock-transactions";
import { TransactionRow } from "@/components/transaction-row";
import { Utensils, Car, ShoppingBag, Receipt, Film, MoreHorizontal, PieChart } from "lucide-react";
import { useMemo } from "react";
import { FadeInUp } from "@/components/ui/animations";

export const Route = createFileRoute("/expenses/$id")({
  component: CategoryDetail,
});

const CATEGORIES: Record<string, { label: string; icon: React.ComponentType<any>; bg: string; fg: string }> = {
  food: { label: "Ăn uống", icon: Utensils, bg: "#ffe4e6", fg: "#b03a4a" },
  transport: { label: "Di chuyển", icon: Car, bg: "#FFE9D9", fg: "#B5828C" },
  shopping: { label: "Mua sắm", icon: ShoppingBag, bg: "#fef3c7", fg: "#a16207" },
  bills: { label: "Hóa đơn", icon: Receipt, bg: "#ede9fe", fg: "#6d28d9" },
  entertainment: { label: "Giải trí", icon: Film, bg: "#dcfce7", fg: "#15803d" },
  other: { label: "Khác", icon: MoreHorizontal, bg: "#f1f5f9", fg: "#475569" },
};

const CATEGORY_MAP: Record<string, string> = {
  "Ăn uống": "food",
  "Di chuyển": "transport",
  "Mua sắm": "shopping",
  "Hóa đơn": "bills",
  "Giải trí": "entertainment",
};

function CategoryDetail() {
  const { id } = useParams({ from: "/expenses/$id" });
  
  const catInfo = CATEGORIES[id] ?? CATEGORIES.other;

  const categoryTxs = useMemo(() => {
    return TRANSACTIONS.filter(t => t.type === "expense" && (CATEGORY_MAP[t.category] === id || (id === "other" && !CATEGORY_MAP[t.category])));
  }, [id]);

  const total = categoryTxs.reduce((s, t) => s + t.amount, 0);

  return (
    <PhoneFrame title={catInfo.label} subtitle="Chi tiết danh mục">
      <div className="space-y-6 px-5 pb-8 pt-2">
        {/* Summary Card */}
        <div 
          className="relative overflow-hidden rounded-[28px] p-5 shadow-sm"
          style={{ backgroundColor: catInfo.bg, color: catInfo.fg }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40 shadow-sm backdrop-blur-md">
              <catInfo.icon className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-sans text-[11px] font-bold uppercase tracking-wider opacity-70">Tổng chi tháng này</p>
              <p className="font-display text-[24px] font-bold tabular-nums">{formatVND(total)}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/30 p-3 backdrop-blur-md">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-70">Giao dịch</p>
              <p className="text-[14px] font-bold">{categoryTxs.length}</p>
            </div>
            <div className="h-6 w-px bg-black/10" />
            <div>
              <p className="text-[10px] font-bold uppercase opacity-70">Trung bình</p>
              <p className="text-[14px] font-bold tabular-nums">{categoryTxs.length > 0 ? formatVND(Math.round(total / categoryTxs.length)) : "0₫"}</p>
            </div>
          </div>
        </div>

        {/* Action / Budget link */}
        <Link to="/budgets/$id" params={{ id }} className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-md active:scale-95 transition">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 opacity-50" />
            <span className="text-[13px] font-bold">Xem ngân sách {catInfo.label}</span>
          </div>
          <span className="text-[11px] font-bold text-[#B5828C]">Quản lý →</span>
        </Link>

        {/* Transactions List */}
        <div>
          <h2 className="mb-3 font-display text-[16px] font-bold text-foreground px-1">Lịch sử giao dịch</h2>
          
          {categoryTxs.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {categoryTxs.map((t, i) => (
                <FadeInUp key={t.id} delay={i * 0.05}>
                  <Link to="/transactions/$id" params={{ id: t.id }} className="block">
                    <TransactionRow transaction={t} />
                  </Link>
                </FadeInUp>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-foreground/10 py-10 text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 text-foreground/30">
                <catInfo.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="text-[13px] font-medium text-foreground/50">Chưa có giao dịch nào</p>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
