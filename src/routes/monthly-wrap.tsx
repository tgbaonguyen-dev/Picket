import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { TrendingUp, TrendingDown, Target, Wallet, Camera, Share2, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/monthly-wrap")({
  component: MonthlyWrapPage,
});

const TOP_MERCHANTS = [
  { name: "Shopee", change: +38, amount: "2.4tr" },
  { name: "Grab", change: +22, amount: "890k" },
  { name: "Starbucks", change: +15, amount: "620k" },
];

const PHOTOS = ["a1", "b1", "c1", "d1"].map((s) => `https://picsum.photos/seed/${s}/200/200`);

function MonthlyWrapPage() {
  return (
    <PhoneFrame
      title="Tổng kết tháng 3"
      subtitle="Kỳ đã đóng"
      right={
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-white text-[#B5828C] shadow-sm transition active:scale-95"
          aria-label="Chia sẻ"
        >
          <Share2 className="h-4 w-4" />
        </button>
      }
    >
      <div className="space-y-3 px-5 pb-10">
        {/* Hero story */}
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#B5828C] via-[#3a7ea3] to-[#5b9bbf] p-5 text-white shadow-lg">
          <div className="pointer-events-none absolute -right-8 -top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="pointer-events-none absolute -left-4 bottom-0 h-24 w-24 rounded-full bg-[#f9a8a8]/40 blur-2xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-widest backdrop-blur">
              <Sparkles className="h-3 w-3" /> Câu chuyện tháng
            </span>
            <h2 className="mt-3 font-display text-[26px] font-bold leading-tight">
              Bạn đã tiết kiệm được
            </h2>
            <p className="mt-1 font-display text-[40px] font-bold leading-none tabular-nums">
              +3.240.000₫
            </p>
            <p className="mt-2 font-sans text-[12px] font-medium text-white/85">
              Cao hơn tháng 2 tới 18% — nhờ giảm chi ăn ngoài 🎉
            </p>
          </div>
        </div>

        {/* Income / Expense */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={TrendingUp}
            label="Thu nhập"
            amount="18.500.000₫"
            delta="+5%"
            positive
            bg="bg-[#dcfce7]"
            color="text-[#16a34a]"
          />
          <StatCard
            icon={TrendingDown}
            label="Chi tiêu"
            amount="15.260.000₫"
            delta="-8%"
            positive
            bg="bg-[#fee2e2]"
            color="text-[#dc2626]"
          />
        </div>

        {/* Budget */}
        <div className="rounded-[22px] border border-white bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#FFE9D9] text-[#B5828C]">
                <Wallet className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-[14px] font-bold text-foreground">Ngân sách</p>
                <p className="font-sans text-[11px] text-foreground/55">15.26tr / 18tr</p>
              </div>
            </div>
            <span className="rounded-full bg-[#dcfce7] px-2.5 py-1 font-sans text-[11px] font-bold text-[#16a34a]">
              Đúng kế hoạch
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/5">
            <div className="h-full rounded-full bg-gradient-to-r from-[#B5828C] to-[#5b9bbf]" style={{ width: "85%" }} />
          </div>
        </div>

        {/* Goal */}
        <div className="rounded-[22px] border border-white bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#fef3c7] text-[#b45309]">
                <Target className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-[14px] font-bold text-foreground">Mục tiêu iPhone 16</p>
                <p className="font-sans text-[11px] text-foreground/55">21tr / 30tr</p>
              </div>
            </div>
            <span className="font-display text-[15px] font-bold text-foreground tabular-nums">70%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/5">
            <div className="h-full rounded-full bg-gradient-to-r from-[#f9a8a8] to-[#f87171]" style={{ width: "70%" }} />
          </div>
        </div>

        {/* Merchants */}
        <div className="rounded-[22px] border border-white bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-[14px] font-bold text-foreground">Merchant tăng mạnh</h3>
            <span className="font-sans text-[11px] text-foreground/50">so tháng trước</span>
          </div>
          <div className="space-y-2.5">
            {TOP_MERCHANTS.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground/5 font-display text-[13px] font-bold text-foreground">
                  {m.name[0]}
                </span>
                <span className="flex-1 font-sans text-[13px] font-semibold text-foreground">{m.name}</span>
                <span className="font-display text-[13px] font-bold text-foreground tabular-nums">{m.amount}</span>
                <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 font-sans text-[10px] font-bold text-[#dc2626]">
                  +{m.change}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="rounded-[22px] border border-white bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Camera className="h-4 w-4 text-[#B5828C]" />
            <h3 className="font-display text-[14px] font-bold text-foreground">Khoảnh khắc nổi bật</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PHOTOS.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="rounded-[22px] border border-[#B5828C]/15 bg-gradient-to-br from-[#FFE9D9] to-white p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#B5828C]">Bài học</p>
          <p className="mt-2 font-display text-[15px] font-bold leading-snug text-foreground">
            Chi tiêu cuối tuần chiếm 42% ngân sách — thử lên kế hoạch ăn tại nhà 2 tối/tuần?
          </p>
        </div>

        {/* Next steps */}
        <div className="rounded-[22px] border border-white bg-white p-4 shadow-sm">
          <p className="mb-3 font-display text-[14px] font-bold text-foreground">Cho kỳ tới</p>
          <div className="space-y-2">
            {[
              "Đặt ngân sách Ăn uống 3.5tr",
              "Tự động chuyển 3tr vào mục tiêu",
              "Bật cảnh báo khi vượt 80% ngân sách",
            ].map((n) => (
              <button
                key={n}
                type="button"
                className="flex w-full items-center justify-between rounded-xl bg-foreground/[0.03] px-3 py-2.5 text-left transition active:scale-[0.99]"
              >
                <span className="font-sans text-[13px] font-medium text-foreground">{n}</span>
                <ArrowRight className="h-4 w-4 text-[#B5828C]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function StatCard({
  icon: Icon,
  label,
  amount,
  delta,
  positive,
  bg,
  color,
}: {
  icon: typeof TrendingUp;
  label: string;
  amount: string;
  delta: string;
  positive: boolean;
  bg: string;
  color: string;
}) {
  return (
    <div className="rounded-[22px] border border-white bg-white p-4 shadow-sm">
      <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${bg} ${color}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 font-sans text-[11px] font-semibold text-foreground/55">{label}</p>
      <p className="mt-0.5 font-display text-[17px] font-bold text-foreground tabular-nums">{amount}</p>
      <span
        className={`mt-1 inline-block rounded-full px-2 py-0.5 font-sans text-[10px] font-bold ${
          positive ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fee2e2] text-[#dc2626]"
        }`}
      >
        {delta}
      </span>
    </div>
  );
}
