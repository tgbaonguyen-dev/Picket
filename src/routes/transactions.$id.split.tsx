import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Users, Percent, Divide } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { findTx, formatVND, CATEGORIES } from "@/lib/mock-transactions";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/$id/split")({
  loader: ({ params }) => {
    const tx = findTx(params.id);
    if (!tx) throw notFound();
    return tx;
  },
  errorComponent: ({ error }) => (
    <PhoneFrame title="Lỗi"><div className="p-6 text-sm text-destructive">{error.message}</div></PhoneFrame>
  ),
  notFoundComponent: () => (
    <PhoneFrame title="Không tìm thấy"><div className="p-6 text-sm">Không tìm thấy.</div></PhoneFrame>
  ),
  component: SplitTx,
});

type Row = { id: string; label: string; amount: number; category: string };

function SplitTx() {
  const t = Route.useLoaderData();
  const nav = useNavigate();
  const [mode, setMode] = useState<"equal" | "percent" | "custom">("custom");
  const [rows, setRows] = useState<Row[]>([
    { id: "r1", label: "Ăn uống", amount: Math.round(t.amount * 0.6), category: "food" },
    { id: "r2", label: "Đồ uống", amount: Math.round(t.amount * 0.4), category: "food" },
  ]);

  const total = rows.reduce((s, r) => s + r.amount, 0);
  const remaining = t.amount - total;
  const balanced = remaining === 0;

  const add = () =>
    setRows((s) => [
      ...s,
      { id: "r" + (s.length + 1), label: "Phần " + (s.length + 1), amount: 0, category: "other" },
    ]);

  const equalize = () => {
    const share = Math.floor(t.amount / rows.length);
    const rest = t.amount - share * rows.length;
    setRows((s) =>
      s.map((r, i) => ({ ...r, amount: share + (i === 0 ? rest : 0) })),
    );
    setMode("equal");
  };

  const distributeRemaining = () => {
    if (rows.length === 0) return;
    setRows((s) => {
      const copy = [...s];
      copy[copy.length - 1].amount += remaining;
      return copy;
    });
  };

  return (
    <PhoneFrame title="Split giao dịch" subtitle={t.merchant}>
      <div className="space-y-4 px-5 pb-6">
        {/* Total */}
        <div className="rounded-3xl bg-gradient-to-br from-foreground to-foreground/85 p-5 text-background shadow-lg">
          <p className="text-[11px] uppercase tracking-widest opacity-70">Tổng giao dịch</p>
          <p className="mt-1 font-display text-[30px] font-bold tabular-nums">
            {formatVND(t.amount)}
          </p>
          <div className="mt-3 flex justify-between text-[12px]">
            <span>Đã phân: {formatVND(total)}</span>
            <span className={remaining === 0 ? "text-[#FFB4A2]" : "text-amber-300"}>
              Còn lại: {formatVND(remaining)}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className={`h-full ${balanced ? "bg-[#FFB4A2]" : "bg-amber-400"}`}
              style={{ width: `${Math.min(100, (total / t.amount) * 100)}%` }}
            />
          </div>
        </div>

        {/* Mode */}
        <div className="flex gap-2">
          <ModeBtn active={mode === "equal"} onClick={equalize} icon={<Divide className="h-4 w-4" />}>
            Chia đều
          </ModeBtn>
          <ModeBtn active={mode === "percent"} onClick={() => setMode("percent")} icon={<Percent className="h-4 w-4" />}>
            Phần trăm
          </ModeBtn>
          <ModeBtn active={mode === "custom"} onClick={() => setMode("custom")} icon={<Users className="h-4 w-4" />}>
            Tuỳ chỉnh
          </ModeBtn>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((r, i) => {
            const cat = CATEGORIES.find((c) => c.id === r.category) ?? CATEGORIES[0];
            return (
              <div key={r.id} className="rounded-2xl border border-white/70 bg-white/85 p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/5 text-base">
                    {cat.emoji}
                  </div>
                  <input
                    value={r.label}
                    onChange={(e) =>
                      setRows((s) => s.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                    }
                    className="flex-1 bg-transparent text-[14px] font-semibold outline-none"
                  />
                  <button
                    onClick={() => setRows((s) => s.filter((_, j) => j !== i))}
                    className="p-1 text-foreground/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <input
                    type="number"
                    value={r.amount}
                    onChange={(e) =>
                      setRows((s) =>
                        s.map((x, j) =>
                          j === i ? { ...x, amount: Number(e.target.value) || 0 } : x,
                        ),
                      )
                    }
                    className="w-full bg-transparent font-display text-[20px] font-bold tabular-nums outline-none"
                  />
                  <span className="text-[11px] text-foreground/50">
                    {((r.amount / t.amount) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={add}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-foreground/20 py-3 text-[13px] font-semibold text-foreground/60"
          >
            <Plus className="h-4 w-4" /> Thêm phần
          </button>
          {!balanced && (
            <button
              onClick={distributeRemaining}
              className="rounded-2xl bg-amber-100 px-4 py-3 text-[13px] font-semibold text-amber-800"
            >
              Cân bằng
            </button>
          )}
        </div>

        <button
          disabled={!balanced}
          onClick={() => {
            toast.success("Đã lưu split");
            nav({ to: "/transactions/$id", params: { id: t.id } });
          }}
          className="w-full rounded-2xl bg-foreground py-3.5 text-[14px] font-semibold text-background disabled:opacity-40"
        >
          {balanced ? "Lưu split" : `Còn ${formatVND(Math.abs(remaining))} chưa cân`}
        </button>
      </div>
    </PhoneFrame>
  );
}

function ModeBtn({
  active, onClick, icon, children,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-semibold transition ${
        active ? "bg-foreground text-background" : "border border-white/70 bg-white/70"
      }`}
    >
      {icon} {children}
    </button>
  );
}
