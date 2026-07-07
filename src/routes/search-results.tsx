import { FadeInUp } from "@/components/ui/animations";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/phone-frame";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search, SlidersHorizontal, Bookmark, Receipt, Package, User, Wallet, X } from "lucide-react";
import { toast } from "sonner";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search-results")({
  validateSearch: zodValidator(searchSchema),
  component: ResultsPage,
});

type Kind = "transaction" | "receipt" | "item" | "people";
type Result = {
  id: string;
  kind: Kind;
  title: string;
  sub: string;
  right?: string;
  snippet?: string;
};

const RESULTS: Result[] = [
  { id: "r1", kind: "transaction", title: "Starbucks Reserve", sub: "12/04 · Ăn uống", right: "-125.000₫" },
  { id: "r2", kind: "transaction", title: "Grab · Đi lại", sub: "10/04 · Di chuyển", right: "-45.000₫" },
  { id: "r3", kind: "receipt", title: "Hoá đơn Circle K", sub: "14/04", snippet: "…Coca 20.000, Bánh mì 25.000, Tổng 128.000…", right: "3 dòng" },
  { id: "r4", kind: "receipt", title: "Hoá đơn Big C", sub: "07/04", snippet: "…Sữa Vinamilk, Trứng gà, Rau xà lách…", right: "12 dòng" },
  { id: "r5", kind: "item", title: "AirPods Pro 2", sub: "Mua 03/2026 · Bảo hành 09/2027", right: "6.5tr" },
  { id: "r6", kind: "item", title: "Ghế công thái học", sub: "Mua 11/2025", right: "4.2tr" },
  { id: "r7", kind: "people", title: "Nhóm ăn tối cùng An", sub: "5 người · 8 giao dịch", right: "1.2tr" },
];

const KIND_META: Record<Kind, { label: string; icon: typeof Receipt; color: string; bg: string }> = {
  transaction: { label: "Giao dịch", icon: Wallet, color: "text-[#B5828C]", bg: "bg-[#FFE9D9]" },
  receipt: { label: "Hoá đơn", icon: Receipt, color: "text-[#b45309]", bg: "bg-[#fef3c7]" },
  item: { label: "Món đồ", icon: Package, color: "text-[#c026d3]", bg: "bg-[#fae8ff]" },
  people: { label: "Người", icon: User, color: "text-[#16a34a]", bg: "bg-[#dcfce7]" },
};

const TABS: { key: "all" | Kind; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "transaction", label: "Giao dịch" },
  { key: "receipt", label: "Hoá đơn" },
  { key: "item", label: "Món đồ" },
  { key: "people", label: "Người" },
];

function ResultsPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [filters, setFilters] = useState<string[]>(["Tháng 4", "Chỉ có ảnh"]);

  const filtered = RESULTS.filter((r) => tab === "all" || r.kind === tab);
  const counts = RESULTS.reduce<Record<string, number>>((acc, r) => {
    acc[r.kind] = (acc[r.kind] ?? 0) + 1;
    acc.all = (acc.all ?? 0) + 1;
    return acc;
  }, {});

  return (
    <FadeInUp className="h-full flex flex-col w-full flex-1"><PhoneFrame
      title={`“${q || "…"}”`}
      subtitle={`${filtered.length} kết quả`}
      right={
        <button
          type="button"
          onClick={() => toast.success("Đã lưu tìm kiếm")}
          aria-label="Lưu tìm kiếm"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-white text-[#B5828C] shadow-sm transition active:scale-95"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      }
    >
      {/* Search field */}
      <div className="px-5 pb-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/search" })}
          className="relative flex h-11 w-full items-center rounded-2xl border border-white bg-white pl-11 pr-4 text-left shadow-[0_4px_14px_-8px_rgba(46,107,138,0.25)]"
        >
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
          <span className="truncate font-sans text-[14px] font-medium text-foreground">{q || "Tìm kiếm…"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-[12px] font-semibold transition ${
              tab === t.key ? "bg-[#B5828C] text-white shadow-sm" : "border border-white/80 bg-white/70 text-foreground/70"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                tab === t.key ? "bg-white/25 text-white" : "bg-foreground/5 text-foreground/60"
              }`}
            >
              {counts[t.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filter summary */}
      <div className="flex items-center gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button className="flex shrink-0 items-center gap-1 rounded-full border border-[#B5828C]/25 bg-white px-3 py-1.5 font-sans text-[11px] font-semibold text-[#B5828C] shadow-sm">
          <SlidersHorizontal className="h-3 w-3" /> Bộ lọc
        </button>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilters((prev) => prev.filter((x) => x !== f))}
            className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFE9D9] px-3 py-1.5 font-sans text-[11px] font-semibold text-[#B5828C]"
          >
            {f} <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2 px-5 pb-10">
        {filtered.map((r) => {
          const m = KIND_META[r.kind];
          const Icon = m.icon;
          return (
            <button
              type="button"
              key={r.id}
              className="flex w-full items-start gap-3 rounded-2xl border border-white bg-white p-3.5 text-left shadow-[0_4px_14px_-8px_rgba(46,107,138,0.2)] transition active:scale-[0.99]"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${m.bg} ${m.color}`}>
                <Icon className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider ${m.bg} ${m.color}`}>
                    {m.label}
                  </span>
                </div>
                <h3 className="mt-1 truncate font-display text-[14px] font-bold text-foreground">
                  {highlight(r.title, q)}
                </h3>
                <p className="mt-0.5 truncate font-sans text-[11px] text-foreground/55">{r.sub}</p>
                {r.snippet && (
                  <p className="mt-1.5 rounded-lg bg-foreground/5 px-2 py-1 font-sans text-[11px] italic text-foreground/60">
                    {highlight(r.snippet, q)}
                  </p>
                )}
              </div>
              {r.right && (
                <span className="shrink-0 font-display text-[13px] font-bold text-foreground tabular-nums">
                  {r.right}
                </span>
              )}
            </button>
          );
        })}
        {!filtered.length && (
          <p className="mt-10 text-center font-sans text-[13px] text-foreground/50">Không có kết quả phù hợp.</p>
        )}
      </div>
    </PhoneFrame></FadeInUp>
  );
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-[#fef3c7] px-0.5 text-foreground">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}
