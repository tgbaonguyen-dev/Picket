import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { CATEGORIES } from "@/lib/mock-transactions";
import { Plus, Tag } from "lucide-react";
import { useState } from "react";
import { vibrateLight } from "@/lib/haptic";
import { Drawer } from "vaul";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const [tab, setTab] = useState<"expense" | "income" | "labels">("expense");

  // Filter categories
  const expenseCats = CATEGORIES.slice(0, 10);
  const incomeCats = CATEGORIES.slice(10);
  
  // Dummy labels
  const labels = [
    { id: "l1", name: "Du lịch", color: "bg-blue-100 text-blue-600" },
    { id: "l2", name: "Được hoàn ứng", color: "bg-emerald-100 text-emerald-600" },
    { id: "l3", name: "Cá nhân", color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <PhoneFrame title="Danh mục & Nhãn" back>
      <div className="flex h-full flex-col">
        {/* Tabs */}
        <div className="px-5 pt-2 pb-4">
          <div className="flex rounded-2xl bg-foreground/5 p-1">
            {(["expense", "income", "labels"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  vibrateLight();
                  setTab(t);
                }}
                className={`flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition ${
                  tab === t ? "bg-white text-foreground shadow" : "text-foreground/55 hover:text-foreground/80"
                }`}
              >
                {t === "expense" ? "Khoản Chi" : t === "income" ? "Khoản Thu" : "Nhãn (Tag)"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-32">
          {tab === "expense" || tab === "income" ? (
            <div className="grid grid-cols-4 gap-x-4 gap-y-6 pt-4">
              {(tab === "expense" ? expenseCats : incomeCats).map((cat) => (
                <button
                  key={cat.id}
                  className="group flex flex-col items-center gap-2 active:scale-95 transition-transform"
                >
                  <div 
                    className="flex h-[60px] w-[60px] items-center justify-center rounded-[22px] text-[26px] shadow-sm transition-shadow group-hover:shadow-md"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {cat.emoji}
                  </div>
                  <span className="text-center font-sans text-[11px] font-semibold leading-tight text-foreground/75">
                    {cat.label}
                  </span>
                </button>
              ))}
              
              {/* Add New Category Button */}
              <Drawer.Root>
                <Drawer.Trigger asChild>
                  <button
                    onClick={vibrateLight}
                    className="group flex flex-col items-center gap-2 active:scale-95 transition-transform"
                  >
                    <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[22px] bg-white border-2 border-dashed border-foreground/15 text-foreground/40 transition-colors group-hover:border-foreground/30 group-hover:text-foreground/60">
                      <Plus className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <span className="text-center font-sans text-[11px] font-semibold leading-tight text-foreground/50">
                      Thêm mới
                    </span>
                  </button>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />
                  <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] mt-24 flex h-[85vh] flex-col rounded-t-[36px] bg-[#FFF8F0] shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.4)] sm:mx-auto sm:max-w-[390px]">
                    <div className="flex-1 overflow-y-auto rounded-t-[36px] bg-[#FFF8F0] px-5 pb-8 pt-3">
                      <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-foreground/15" />
                      <h2 className="mb-2 font-display text-[22px] font-bold text-foreground">
                        Danh mục {tab === "expense" ? "Chi" : "Thu"}
                      </h2>
                      <p className="mb-6 font-sans text-[13px] text-foreground/60">
                        Tạo nhóm phân loại mới cho giao dịch của bạn.
                      </p>
                      
                      {/* Mock Form */}
                      <div className="space-y-4">
                        <div className="flex justify-center mb-6">
                          <button className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-sm border border-foreground/5 text-[32px]">
                            📁
                          </button>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-foreground/40">Tên danh mục</label>
                          <input 
                            type="text" 
                            placeholder="Vd: Cà phê, Lương..." 
                            className="w-full bg-transparent outline-none mt-1 font-display text-[16px] font-semibold text-foreground placeholder:text-foreground/20"
                          />
                        </div>
                        <Drawer.Close asChild>
                          <button className="w-full rounded-2xl bg-foreground py-4 font-sans text-[14px] font-bold text-background transition active:scale-[0.98]">
                            Lưu danh mục
                          </button>
                        </Drawer.Close>
                      </div>
                    </div>
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.Root>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {labels.map((label) => (
                <div key={label.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${label.color}`}>
                    <Tag className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <p className="font-display text-[15px] font-bold text-foreground flex-1">
                    {label.name}
                  </p>
                </div>
              ))}
              <button className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-dashed border-foreground/15 active:scale-95 transition-transform">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground/40">
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <p className="font-sans text-[14px] font-semibold text-foreground/50">
                  Tạo nhãn mới...
                </p>
              </button>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
