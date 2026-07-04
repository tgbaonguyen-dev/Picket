import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/phone-frame";
import { Search, Clock, X, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

const RECENT = ["Starbucks", "Grab tháng 3", "Hoá đơn > 500k", "iPhone 15", "An chia"];
const CHIPS = ["Giao dịch", "Merchant", "Hoá đơn", "Món đồ", "Tài khoản", "Bài đăng"];
const SUGGESTIONS = [
  "Chi tiêu ăn uống tuần này",
  "Giao dịch chưa phân loại",
  "Hoá đơn có ảnh mờ",
  "Merchant tăng chi 20%",
];

function SearchPage() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function submit(term: string) {
    const value = term.trim();
    if (!value) return;
    navigate({ to: "/search-results", search: { q: value } });
  }

  return (
    <PhoneFrame title="Tìm kiếm" subtitle="Toàn bộ dữ liệu">
      {/* Sticky search */}
      <div className="sticky top-0 z-10 -mt-3 bg-[#FFF8F0]/95 px-5 pb-3 pt-3 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(q);
          }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm giao dịch, merchant, món đồ…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-12 w-full rounded-2xl border border-white bg-white pl-11 pr-11 font-sans text-[14px] font-medium text-foreground placeholder:text-foreground/40 shadow-[0_4px_14px_-8px_rgba(46,107,138,0.25)] focus:outline-none focus:ring-2 focus:ring-[#B5828C]/30"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Xoá"
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/10 text-foreground/60"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          )}
        </form>

        <div className="mt-3 flex items-center gap-1.5 font-sans text-[10px] font-medium text-foreground/50">
          <Lock className="h-3 w-3" /> Bàn phím riêng tư · dữ liệu không rời thiết bị
        </div>
      </div>

      <div className="px-5 pb-10">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 py-3">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => submit(c)}
              className="rounded-full border border-white bg-white/80 px-3 py-1.5 font-sans text-[11px] font-semibold text-foreground/70 shadow-sm transition active:scale-95"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Recent */}
        <p className="mt-3 mb-2 pl-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/50">
          Tìm gần đây
        </p>
        <div className="rounded-2xl bg-white/70 p-1">
          {RECENT.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => submit(r)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white"
            >
              <Clock className="h-4 w-4 text-foreground/40" />
              <span className="flex-1 font-sans text-[13px] font-medium text-foreground/80">{r}</span>
              <span className="font-sans text-[11px] text-foreground/40">↗</span>
            </button>
          ))}
        </div>

        {/* Suggestions */}
        <p className="mt-6 mb-2 pl-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/50">
          Gợi ý cho bạn
        </p>
        <div className="space-y-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="flex w-full items-center gap-3 rounded-2xl border border-white bg-white p-3 text-left shadow-sm transition active:scale-[0.99]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFE9D9] text-[#B5828C]">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="font-sans text-[13px] font-semibold text-foreground">{s}</span>
            </button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
