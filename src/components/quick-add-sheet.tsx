import { Drawer } from "vaul";
import { useNavigate } from "@tanstack/react-router";
import { Camera, ScanLine, TrendingDown, TrendingUp, ArrowLeftRight, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { vibrateLight, vibrateMedium } from "@/lib/haptic";
import type { ReactNode } from "react";

type Action = {
  key: string;
  label: string;
  desc: string;
  icon: typeof Camera;
  bg: string;
  color: string;
  to?: string;
  available?: boolean;
};

const ACTIONS: Action[] = [
  { key: "receipt", label: "Chụp hoá đơn", desc: "OCR tự động điền", icon: Camera, bg: "bg-[#FFE9D9]", color: "text-[#B5828C]", to: "/capture-receipt", available: true },
  { key: "expense", label: "Thêm chi", desc: "Ghi khoản chi tay", icon: TrendingDown, bg: "bg-[#fee2e2]", color: "text-[#dc2626]", to: "/transactions/new", available: true },
  { key: "income", label: "Thêm thu", desc: "Lương, thưởng, hoàn tiền", icon: TrendingUp, bg: "bg-[#dcfce7]", color: "text-[#16a34a]", to: "/transactions/new?type=income", available: true },
  { key: "transfer", label: "Chuyển tiền", desc: "Giữa các tài khoản", icon: ArrowLeftRight, bg: "bg-[#fef3c7]", color: "text-[#b45309]", to: "/transactions/transfer", available: true },
  { key: "shared", label: "Chi tiêu chung", desc: "Chia bill với bạn bè", icon: Users, bg: "bg-[#ede9fe]", color: "text-[#7c3aed]", available: false },
];

const RECENT = ["receipt", "expense", "transfer"];

export function QuickAddSheet({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function trigger(a: Action) {
    vibrateLight();
    if (!a.available) {
      toast.error("Tính năng sắp ra mắt");
      return;
    }
    if (a.to) {
      setTimeout(() => navigate({ to: a.to }), 150); // Đợi drawer bắt đầu đóng rồi mới chuyển trang
    } else {
      toast.success(`Mở ${a.label.toLowerCase()}`);
    }
  }

  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] mt-24 flex h-auto flex-col rounded-t-[36px] bg-[#FFF8F0] shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.4)] sm:mx-auto sm:max-w-[390px]">
          <div className="flex-1 rounded-t-[36px] bg-[#FFF8F0] px-5 pb-8 pt-3">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-foreground/15" />
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h2 className="font-display text-[22px] font-bold text-foreground">Thêm nhanh</h2>
                <p className="font-sans text-[11px] font-medium text-foreground/55">Chạm để bắt đầu</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f9a8a8] to-[#f87171] text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            {/* Recent */}
            <p className="mb-2 pl-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/50">
              Gần đây
            </p>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {RECENT.map((k) => {
                const a = ACTIONS.find((x) => x.key === k)!;
                const Icon = a.icon;
                
                const ButtonElement = (
                  <button
                    key={k}
                    type="button"
                    onClick={() => trigger(a)}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-white bg-white px-3 py-2 shadow-sm transition active:scale-[0.97]"
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${a.bg} ${a.color}`}>
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </span>
                    <span className="font-sans text-[12px] font-semibold text-foreground">{a.label}</span>
                  </button>
                );

                return a.to ? (
                  <Drawer.Close asChild key={k}>
                    {ButtonElement}
                  </Drawer.Close>
                ) : ButtonElement;
              })}
            </div>

            <p className="mb-2 pl-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/50">
              Tất cả hành động
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ACTIONS.map((a) => {
                const Icon = a.icon;
                
                const ButtonElement = (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => trigger(a)}
                    className={`relative flex flex-col items-start rounded-[22px] border bg-white p-4 text-left shadow-[0_4px_14px_-8px_rgba(46,107,138,0.25)] transition active:scale-[0.97] ${
                      a.available ? "border-white" : "border-white opacity-55"
                    }`}
                  >
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${a.bg} ${a.color}`}>
                      <Icon className="h-5 w-5" strokeWidth={2.3} />
                    </span>
                    <span className="mt-3 font-display text-[14px] font-bold text-foreground">{a.label}</span>
                    <span className="mt-0.5 font-sans text-[11px] leading-snug text-foreground/55">{a.desc}</span>
                    {!a.available && (
                      <span className="absolute right-3 top-3 rounded-full bg-foreground/10 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-foreground/60">
                        Sắp có
                      </span>
                    )}
                  </button>
                );

                return a.to ? (
                  <Drawer.Close asChild key={a.key}>
                    {ButtonElement}
                  </Drawer.Close>
                ) : ButtonElement;
              })}
            </div>

            <Drawer.Close asChild>
              <button
                type="button"
                onClick={vibrateLight}
                className="mt-5 w-full rounded-2xl bg-foreground/5 py-3 font-sans text-[13px] font-semibold text-foreground/70 transition active:scale-[0.97]"
              >
                Đóng
              </button>
            </Drawer.Close>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
