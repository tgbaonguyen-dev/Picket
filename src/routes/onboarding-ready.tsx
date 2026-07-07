import { FadeInUp } from "@/components/ui/animations";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  Receipt,
  Wallet,
  Home as HomeIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding-ready")({
  head: () => ({
    meta: [
      { title: "Sẵn sàng · Picket" },
      { name: "description", content: "Hoàn tất thiết lập. Chọn hành động đầu tiên để bắt đầu với Picket." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReadyPage,
});

type PermState = Record<string, "idle" | "granted" | "skipped">;

function ReadyPage() {
  const navigate = useNavigate();
  const [perms, setPerms] = useState<PermState>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("picket.permissions");
      if (raw) setPerms(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const finish = async (intent: "receipt" | "expense" | "home") => {
    try {
      localStorage.setItem("picket.onboarded", "1");
      localStorage.setItem("picket.firstIntent", intent);
    } catch {
      // ignore
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      navigate({ to: "/auth" });
      return;
    }
    if (intent === "receipt" || intent === "expense") {
      navigate({ to: "/expenses" });
    } else {
      navigate({ to: "/" });
    }
  };

  const checklist = [
    { label: "Tài khoản đã được bảo vệ", done: true },
    { label: "Nguyên tắc riêng tư đã xác nhận", done: true },
    {
      label: "Quyền cần thiết đã thiết lập",
      done: Object.values(perms).some((s) => s === "granted"),
    },
  ];

  return (
    <FadeInUp className="h-full flex flex-col w-full flex-1"><main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-32px)] flex-col overflow-hidden sm:rounded-[44px] bg-[#f4f8fb] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#dcfce7] to-transparent" />
        <div className="pointer-events-none absolute -left-16 top-32 h-56 w-56 rounded-full bg-[#fde68a]/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-16 h-40 w-40 rounded-full bg-[#FFB4A2]/40 blur-3xl" />

        <div className="relative flex min-h-[780px] w-full flex-col px-6 pb-6 pt-8">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/45">
            Bước 3 / 3 · Hoàn tất
          </p>

          <div className="mt-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[36px] bg-[#86efac]/60 blur-2xl" />
              <div className="flex h-28 w-28 items-center justify-center rounded-[32px] border border-white/70 bg-white/90 text-[#15803d] shadow-[0_20px_50px_-20px_rgba(15,42,66,0.35)] backdrop-blur-xl">
                <Sparkles className="h-12 w-12" strokeWidth={2.1} />
              </div>
            </div>
          </div>

          <h1 className="mt-7 text-center font-display text-[28px] font-bold leading-[1.1] tracking-tight text-foreground">
            Tuyệt vời!
            <br />
            Sẵn sàng bắt đầu.
          </h1>
          <p className="mx-auto mt-3 max-w-[290px] text-center font-sans text-[13px] font-medium leading-relaxed text-foreground/60">
            Chọn hành động đầu tiên bên dưới — bạn có thể quay lại các bước khác bất cứ lúc nào.
          </p>

          {/* Checklist */}
          <div className="mt-6 rounded-[22px] border border-white/70 bg-white/75 p-4 backdrop-blur-md">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/55">
              Tóm tắt thiết lập
            </p>
            <ul className="mt-2.5 flex flex-col gap-2">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      c.done ? "bg-[#15803d] text-white" : "bg-foreground/10 text-foreground/40"
                    }`}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span
                    className={`font-sans text-[12.5px] font-semibold ${
                      c.done ? "text-foreground/80" : "text-foreground/45"
                    }`}
                  >
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Intents */}
          <div className="mt-5 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => finish("receipt")}
              className="flex items-center gap-3 rounded-[20px] bg-[#B5828C] p-4 text-left text-white shadow-[0_18px_40px_-16px_rgba(46,107,138,0.7)] transition active:scale-[0.97]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Receipt className="h-5 w-5" strokeWidth={2.3} />
              </div>
              <div className="flex-1">
                <p className="font-display text-[15px] font-bold leading-tight">
                  Chụp hoá đơn đầu tiên
                </p>
                <p className="mt-0.5 font-sans text-[11.5px] font-medium text-white/75">
                  Nhanh nhất để ghi giao dịch đầu tiên.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 opacity-80" strokeWidth={2.6} />
            </button>

            <button
              type="button"
              onClick={() => finish("expense")}
              className="flex items-center gap-3 rounded-[20px] border border-white/70 bg-white/85 p-4 text-left backdrop-blur-md transition active:scale-[0.97]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffe4e6] text-[#b03a4a]">
                <Wallet className="h-5 w-5" strokeWidth={2.3} />
              </div>
              <div className="flex-1">
                <p className="font-display text-[15px] font-bold leading-tight text-foreground">
                  Thêm giao dịch thủ công
                </p>
                <p className="mt-0.5 font-sans text-[11.5px] font-medium text-foreground/55">
                  Nhập số tiền và danh mục trong vài giây.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-foreground/50" strokeWidth={2.6} />
            </button>

            <button
              type="button"
              onClick={() => finish("home")}
              className="flex items-center gap-3 rounded-[20px] border border-white/60 bg-white/60 p-4 text-left backdrop-blur-md transition active:scale-[0.97]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFE9D9] text-[#B5828C]">
                <HomeIcon className="h-5 w-5" strokeWidth={2.3} />
              </div>
              <div className="flex-1">
                <p className="font-display text-[14.5px] font-bold leading-tight text-foreground">
                  Vào Trang chủ
                </p>
                <p className="mt-0.5 font-sans text-[11.5px] font-medium text-foreground/55">
                  Khám phá app trước đã.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-foreground/50" strokeWidth={2.6} />
            </button>
          </div>
        </div>
      </div>
    </main></FadeInUp>
  );
}
