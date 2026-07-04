import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Sparkles, Check } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { CATEGORIES } from "@/lib/mock-transactions";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/category")({
  component: CategoryPicker,
});

const RECENT_IDS = ["food", "transport", "shopping"];
const TAGS = ["#công-tác", "#gia-đình", "#du-lịch", "#khẩn-cấp", "#thưởng"];

function CategoryPicker() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const recent = CATEGORIES.filter((c) => RECENT_IDS.includes(c.id));
  const filtered = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <PhoneFrame title="Chọn danh mục">
      <div className="space-y-4 px-5 pb-6">
        <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-2.5 shadow-sm">
          <Search className="h-4 w-4 text-foreground/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm danh mục..."
            className="w-full bg-transparent text-[14px] outline-none"
          />
        </div>

        <section>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
            Gần đây
          </p>
          <div className="flex gap-2 overflow-x-auto">
            {recent.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                  selected === c.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-white/80 bg-white"
                }`}
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
            Tất cả danh mục
          </p>
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  selected === c.id
                    ? "border-foreground bg-foreground/5"
                    : "border-white/80 bg-white"
                }`}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: c.color + "22" }}
                >
                  {c.emoji}
                </div>
                <span className="text-[13px] font-semibold">{c.label}</span>
                {selected === c.id && <Check className="ml-auto h-4 w-4" />}
              </button>
            ))}
            <button className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-foreground/20 p-3 text-left text-foreground/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5">
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-[13px] font-semibold">Tạo mới</span>
            </button>
          </div>
        </section>

        <section>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
            Nhãn
          </p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const on = tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() =>
                    setTags((s) => (on ? s.filter((x) => x !== t) : [...s, t]))
                  }
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
                    on ? "border-foreground bg-foreground text-background" : "border-white/80 bg-white"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </section>

        {selected && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
            <p className="flex items-start gap-2 text-[12px]">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <b>Gợi ý quy tắc:</b> Áp dụng danh mục này cho mọi giao dịch từ merchant tương tự trong tương lai?
              </span>
            </p>
            <button className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
              Tạo rule
            </button>
          </div>
        )}

        <button
          disabled={!selected}
          onClick={() => {
            toast.success("Đã chọn danh mục");
            nav({ to: "/transactions/new" });
          }}
          className="w-full rounded-2xl bg-foreground py-3.5 text-[14px] font-semibold text-background disabled:opacity-40"
        >
          Áp dụng
        </button>
      </div>
    </PhoneFrame>
  );
}
